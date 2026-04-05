'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { Industry } from '@/lib/supabaseClient';
import { Business } from '@/lib/supabaseClient';
import { getBusinessesByIndustry } from '@/lib/mockData';
import { useSwitcherStore } from '@/lib/store';

type NodeDatum = d3.SimulationNodeDatum & {
  id: string;
  label: string;
  radius: number;
  hoverRadius?: number;
  type: 'industry' | 'business';
  tier?: 'small' | 'medium' | 'large';
  originalData: Industry | Business;
};

type Props = {
  industries: Industry[];
  onBusinessSelect: (business: Business) => void;
  /** When true: disables click-to-zoom, cursor repulsion, and side panel interactions */
  readOnly?: boolean;
  /** Multiply all node radii by this factor — use <1 for small containers like MiniConstellation */
  radiusScale?: number;
  /** ID of the currently selected business — renders gold stroke on that node */
  selectedId?: string;
  /** When true: uses space-filling force parameters — no center clustering, bubbles spread to fill the full container */
  compact?: boolean;
};

// ── Dynamic radius computation ───────────────────────────────────────────────
// All radii derived from actual canvas dimensions + node count so circles always
// fit on screen regardless of viewport size or industry count.
// Target: total bubble area ≈ 55% of canvas area.

function computeBaseRadius(nodeCount: number, w: number, h: number, fill = 0.40): number {
  const avgArea = (w * h * fill) / Math.max(nodeCount, 1);
  return Math.sqrt(avgArea / Math.PI);
}

function computeIndustryRadius(ind: Industry, nodeCount: number, w: number, h: number): number {
  const base   = computeBaseRadius(nodeCount, w, h, 0.40);
  const maxR   = Math.min(w, h) * 0.14;              // cap at 14% of shorter dimension
  let relScale: number;
  if (ind.revenue && ind.revenue > 0) {
    relScale = 0.75 + Math.min(0.4, Math.log10(ind.revenue + 1) / 10);
  } else {
    const wNorm = (Math.max(40, Math.min(100, ind.weight)) - 40) / 60; // 0→1
    relScale = 0.75 + wNorm * 0.35;
  }
  return Math.max(22, Math.min(maxR, base * relScale));
}

function computeBusinessRadius(tier: string, nodeCount: number, w: number, h: number): number {
  const base = computeBaseRadius(nodeCount, w, h, 0.40);
  const maxR = Math.min(w, h) * 0.16;
  const mult: Record<string, number> = { large: 1.4, medium: 1.0, small: 0.65 };
  return Math.max(16, Math.min(maxR, base * (mult[tier] ?? 1.0)));
}

export default function ConstellationCanvas({ industries, onBusinessSelect, readOnly = false, radiusScale = 1, selectedId, compact = false }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const simRef = useRef<d3.Simulation<NodeDatum, undefined> | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [zoomedId, setZoomedId] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const hasAnimatedMacro = useRef(false);

  const { isSwitcherOpen } = useSwitcherStore();

  useEffect(() => {
    if (simRef.current) {
      if (isSwitcherOpen) {
        simRef.current.stop();
      } else {
        simRef.current.alpha(0.1).restart();
      }
    }
  }, [isSwitcherOpen]);

  // Shuffle industries exactly once per page load so the layout is preserved across navigations
  const shuffledIndustries = useMemo(() => {
    return [...industries].sort(() => Math.random() - 0.5);
  }, [industries]);

  // Global mouse tracker for cursor repulsion (skipped in readOnly mode)
  useEffect(() => {
    if (readOnly) return;
    const fn = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, [readOnly]);

  // ── Core simulation builder ──────────────────────────────────────────────
  const buildSim = useCallback((
    nodes: NodeDatum[],
    w: number,
    h: number,
    onClickNode: (d: NodeDatum) => void,
    animateEntrance: boolean = true,
    animateStagger: boolean = true,
    isCompact: boolean = false
  ) => {
    simRef.current?.stop();
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Grid
    const defs = svg.append('defs');
    const pat = defs.append('pattern')
      .attr('id', 'grid').attr('width', 44).attr('height', 44)
      .attr('patternUnits', 'userSpaceOnUse');
    pat.append('path').attr('d', 'M 44 0 L 0 0 0 44')
      .attr('fill', 'none').attr('stroke', 'rgba(47,79,79,0.07)').attr('stroke-width', 0.5);
    svg.append('rect').attr('width', w).attr('height', h).attr('fill', 'url(#grid)');

    // Subtle center glow bloom
    const radialGlow = defs.append('radialGradient')
      .attr('id', 'center-glow').attr('cx', '50%').attr('cy', '50%').attr('r', '55%');
    radialGlow.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(45,90,79,0.08)');
    radialGlow.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(45,90,79,0)');
    svg.append('ellipse')
      .attr('cx', w / 2).attr('cy', h / 2)
      .attr('rx', w * 0.55).attr('ry', h * 0.5)
      .attr('fill', 'url(#center-glow)');

    const g = svg.append('g');

    const sim = isCompact
      ? d3.forceSimulation<NodeDatum>(nodes)
          // Compact/fill mode: no center clustering — bubbles stay distributed where placed,
          // only collision detection nudges them into non-overlapping positions.
          .force('center', null)
          .force('charge', d3.forceManyBody().strength(-8))  // Near-zero — just enough to discourage pile-ups
          .force('collide', d3.forceCollide<NodeDatum>(d => (d.hoverRadius || d.radius) + 2).strength(1.0).iterations(12))
          .force('x', d3.forceX(w / 2).strength(0.003))  // Bare minimum drift correction
          .force('y', d3.forceY(h / 2).strength(0.003))
          .alphaDecay(0.006)   // Settle slowly so collision has time to find good positions
          .velocityDecay(0.72)
      : d3.forceSimulation<NodeDatum>(nodes)
          .force('center', d3.forceCenter(w / 2, h / 2).strength(0.025)) // Moderate center pull for tight clustering
          .force('charge', d3.forceManyBody().strength(-160))             // Lower repulsion so bubbles pack closer
          // iterations(16): many passes per tick — fully resolves overlap before nodes move again
          .force('collide', d3.forceCollide<NodeDatum>(d => (d.hoverRadius || d.radius) + 2).strength(1.0).iterations(16))
          .force('x', d3.forceX(w / 2).strength(0.012)) // Tighter pull toward center
          .force('y', d3.forceY(h / 2).strength(0.012))
          .alphaDecay(0.010)
          // 0.7 = heavier friction — less bouncing, nodes settle into tight pack sooner
          .velocityDecay(0.70);

    simRef.current = sim;

    const nodeG = g.selectAll<SVGGElement, NodeDatum>('g.n')
      .data(nodes, d => d.id)
      .join(enter =>
        enter.append('g').attr('class', 'n')
          .style('cursor', 'pointer')
      );

    // Create an inner group for scaling specifically, to isolate it from the tick's translate()
    const innerG = nodeG.selectAll('g.inner')
      .data(d => [d])
      .join(enter =>
        enter.append('g').attr('class', 'inner')
          .style('opacity', animateEntrance ? 0 : 1)
          .style('transform', animateEntrance ? 'scale(0)' : 'scale(1)')
      );

    if (animateEntrance) {
      // Apply staggered 3.2s pop-in animation radiating outward from the center bubble
      const nodeCount = Math.max(1, nodes.length);
      const staggerDelay = animateStagger ? 3200 / nodeCount : 0; // 3.2 seconds total, or simultaneous

      // Build stagger order: closest to center animates first, outer bubbles radiate outward
      const staggerOrder = new Map<string, number>();
      if (animateStagger) {
        [...nodes]
          .map(d => ({ id: d.id, dist: Math.hypot((d.x ?? w / 2) - w / 2, (d.y ?? h / 2) - h / 2) }))
          .sort((a, b) => a.dist - b.dist)
          .forEach((item, i) => staggerOrder.set(item.id, i));
      }

      nodeG.each(function (d, i) {
        const order = staggerOrder.get(d.id) ?? i;
        d3.select(this).select('.inner')
          .transition()
          .duration(200)
          .delay(order * staggerDelay)
          // Release the node into the physics engine exactly when its visual pop-in starts
          .on('start', function () {
            d.fx = null;
            d.fy = null;
          })
          .style('opacity', 1)
          .style('transform', 'scale(1.1)')
          .transition()
          .duration(150)
          .style('transform', 'scale(1)');
      });
    } else {
      // Instant appearance for return visits
      nodeG.each(function (d) {
        d3.select(this).select('.inner')
          .style('opacity', 1)
          .style('transform', 'scale(1)');
        d.fx = null;
        d.fy = null;
      });
    }

    // Glow ring
    innerG.append('circle')
      .attr('r', d => d.radius + 14)
      .attr('fill', 'none')
      .attr('stroke', d => d.tier === 'large' ? 'rgba(220,220,220,0.1)' : 'rgba(47,79,79,0.12)')
      .attr('stroke-width', d => d.tier === 'large' ? 1.5 : 0.7)
      .attr('class', d => `glow ${d.type === 'business' && (d.originalData as Business).trending ? 'trending-glow' : ''}`);

    // Body
    innerG.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.tier === 'large' ? 'rgba(28,28,28,0.96)' : d.type === 'industry' ? 'rgba(14,14,14,0.93)' : 'rgba(18,18,18,0.92)')
      .attr('stroke', d => d.tier === 'large' ? 'rgba(220,220,220,0.5)' : 'rgba(47,79,79,0.55)')
      .attr('stroke-width', d => d.tier === 'large' ? 1.5 : 1)
      .attr('class', 'body');

    // Label — multi-line wrapping with adaptive font size so text always fits
    innerG.each(function (d) {
      const el = d3.select(this);
      const words = d.label.split(' ');
      // Decide font size based on the longest word and bubble radius
      const longestWord = Math.max(...words.map(w => w.length));
      const charsPerLine = Math.floor((d.radius * 1.6) / 8); // ~8px per char at size 12
      const fSize = Math.min(20, Math.max(11, Math.floor((d.radius * 1.4) / longestWord)));
      const lineH = fSize * 1.25;

      if (words.length === 1 || longestWord > charsPerLine * 0.75) {
        // Single line
        el.append('text')
          .attr('class', 'default-label')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', fSize)
          .attr('fill', d.tier === 'large' ? '#FFFFFF' : '#DCDCDC')
          .attr('font-family', 'Space Grotesk, Inter, sans-serif')
          .attr('font-weight', d.tier === 'large' ? '600' : '500')
          .attr('letter-spacing', '0.3')
          .style('pointer-events', 'none').style('user-select', 'none')
          .text(d.label);
      } else if (words.length === 2) {
        // Two words: stack them
        const t = el.append('text').attr('class', 'default-label').attr('text-anchor', 'middle')
          .attr('font-size', fSize)
          .attr('fill', d.tier === 'large' ? '#FFFFFF' : '#DCDCDC')
          .attr('font-family', 'Space Grotesk, Inter, sans-serif')
          .attr('font-weight', d.tier === 'large' ? '600' : '500')
          .attr('letter-spacing', '0.3')
          .style('pointer-events', 'none').style('user-select', 'none');
        t.append('tspan').attr('x', 0).attr('dy', -lineH / 2).text(words[0]);
        t.append('tspan').attr('x', 0).attr('dy', lineH).text(words[1]);
      } else {
        // 3+ words: split into two lines evenly
        const mid = Math.ceil(words.length / 2);
        const line1 = words.slice(0, mid).join(' ');
        const line2 = words.slice(mid).join(' ');
        const t = el.append('text').attr('class', 'default-label').attr('text-anchor', 'middle')
          .attr('font-size', fSize)
          .attr('fill', d.tier === 'large' ? '#FFFFFF' : '#DCDCDC')
          .attr('font-family', 'Space Grotesk, Inter, sans-serif')
          .attr('font-weight', d.tier === 'large' ? '600' : '500')
          .attr('letter-spacing', '0.3')
          .style('pointer-events', 'none').style('user-select', 'none');
        t.append('tspan').attr('x', 0).attr('dy', -lineH / 2).text(line1);
        t.append('tspan').attr('x', 0).attr('dy', lineH).text(line2);
      }
    });

    // Sub-carousel layer inside innerG (only visible on hover)
    innerG.each(function (d) {
      if (d.type !== 'industry') return;
      const el = d3.select(this);

      const carouselG = el.append('g')
        .attr('class', 'carousel')
        .style('opacity', 0)
        .style('pointer-events', 'none');

      const businesses = getBusinessesByIndustry(d.id);
      const partners = businesses
        .filter(b => b.tier === 'large' || b.tier === 'medium')
        .sort((a, b) => {
          if (!a.committed_date) return 1;
          if (!b.committed_date) return -1;
          return new Date(a.committed_date).getTime() - new Date(b.committed_date).getTime();
        })
        .slice(0, 3);

      if (partners.length === 0) {
        carouselG.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', 11)
          .attr('fill', '#DCDCDC')
          .attr('font-family', 'Inter, sans-serif')
          .text('View Businesses');
        return;
      }

      const cycleDuration = 3000;
      const totalDuration = cycleDuration * partners.length;

      partners.forEach((p, i) => {
        const itemG = carouselG.append('g')
          .style('animation', partners.length > 1 ? `carousel-fade ${totalDuration}ms infinite ${i * cycleDuration}ms` : 'none');

        itemG.append('text')
          .attr('text-anchor', 'middle')
          .attr('y', -10)
          .attr('font-size', 9)
          .attr('fill', '#FFFFFF')
          .attr('font-family', 'Space Grotesk, sans-serif')
          .attr('font-weight', '600')
          .text(p.name);

        itemG.append('text')
          .attr('text-anchor', 'middle')
          .attr('y', 4)
          .attr('font-size', 8)
          .attr('fill', 'rgba(220,220,220,0.6)')
          .attr('font-family', 'Inter, sans-serif')
          .text(p.phone || 'No Phone');

        itemG.append('text')
          .attr('text-anchor', 'middle')
          .attr('y', 16)
          .attr('font-size', 7)
          .attr('fill', 'rgba(220,220,220,0.4)')
          .attr('font-family', 'Inter, sans-serif')
          .text(p.address || '');
      });
    });

    // Vote count (micro only)
    innerG.filter(d => d.type === 'business').append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('dy', d => d.radius - 9)
      .attr('font-size', '7')
      .attr('fill', 'rgba(220,220,220,0.4)')
      .style('pointer-events', 'none').style('user-select', 'none')
      .text(d => {
        const b = d.originalData as Business;
        return b.vote_count ? `${b.vote_count} votes` : '';
      });

    // Hover (attach to outer nodeG for better event target area)
    nodeG
      .on('mouseenter', function (_, d) {
        if (d.type === 'industry') {
          // Hostile Hover: Expand physical collision radius and heat up sim
          d.hoverRadius = d.radius * 1.15;
          simRef.current?.force('collide', d3.forceCollide<NodeDatum>(n => (n.hoverRadius || n.radius) + 2).strength(1.0).iterations(16));
          simRef.current?.alpha(0.3).restart();

          d3.select(this).select<SVGGElement>('.inner')
            .transition().duration(400).ease(d3.easeCubicOut)
            .style('transform', 'scale(1.08)');

          // Hide standard label, show rich carousel details
          d3.select(this).select<SVGTextElement>('text.default-label')
            .transition().duration(200).style('opacity', 0);
          d3.select(this).select<SVGGElement>('.carousel')
            .transition().duration(300).style('opacity', 1);
        } else {
          d3.select(this).select<SVGCircleElement>('.body')
            .transition().duration(180)
            .attr('stroke', 'rgba(220,220,220,0.75)').attr('stroke-width', 2);
          d3.select(this).select<SVGCircleElement>('.glow')
            .transition().duration(180).attr('r', d.radius + 20)
            .attr('class', `glow ${d.type === 'business' && (d.originalData as Business).trending ? 'trending-glow' : ''}`);
        }
      })
      .on('mouseleave', function (_, d) {
        if (d.type === 'industry') {
          // Restore physical collision radius and let them settle back
          d.hoverRadius = undefined;
          simRef.current?.force('collide', d3.forceCollide<NodeDatum>(n => (n.hoverRadius || n.radius) + 2).strength(1.0).iterations(16));
          simRef.current?.alpha(0.3).restart();

          d3.select(this).select<SVGGElement>('.inner')
            .transition().duration(500).ease(d3.easeCubicOut)
            .style('transform', 'scale(1)');

          // Restore standard label — carousel fades out first, then label fades in
          d3.select(this).select<SVGGElement>('.carousel')
            .transition().duration(200).delay(0).style('opacity', 0);
          d3.select(this).select<SVGTextElement>('text.default-label')
            .transition().duration(250).delay(150).style('opacity', 1);
        } else {
          d3.select(this).select<SVGCircleElement>('.body')
            .transition().duration(280)
            .attr('stroke', d.tier === 'large' ? 'rgba(220,220,220,0.5)' : 'rgba(47,79,79,0.55)')
            .attr('stroke-width', d.tier === 'large' ? 1.5 : 1);
          d3.select(this).select<SVGCircleElement>('.glow')
            .transition().duration(280).attr('r', d.radius + 14)
            .attr('class', `glow ${d.type === 'business' && (d.originalData as Business).trending ? 'trending-glow' : ''}`);
        }
      })
      .on('click', function (event, d) {
        event.stopPropagation();
        onClickNode(d);
      });

    // Tick — with hard boundary clamping (reads live SVG size to avoid stale closure)
    sim.on('tick', () => {
      const svgEl = svgRef.current;
      const liveW = svgEl?.clientWidth ?? w;
      const liveH = svgEl?.clientHeight ?? h;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const repR = 140, repS = 0.9;
      nodes.forEach(n => {
        if (n.x == null || n.y == null) return;
        // Cursor repulsion (disabled in readOnly mode)
        if (!readOnly) {
          const dx = n.x - mx, dy = n.y - my;
          const dist = Math.hypot(dx, dy);
          if (dist < repR && dist > 1) {
            const f = ((repR - dist) / repR) * repS;
            n.vx = (n.vx ?? 0) + (dx / dist) * f;
            n.vy = (n.vy ?? 0) + (dy / dist) * f;
          }
        }

        // Soft bouncy repelling walls (only activates perfectly on the edge)
        const wallMargin = 0;
        const bounceStrength = 0.8;
        if (n.x < wallMargin + n.radius) {
          n.vx = (n.vx ?? 0) + bounceStrength * (wallMargin + n.radius - n.x);
        } else if (n.x > liveW - wallMargin - n.radius) {
          n.vx = (n.vx ?? 0) - bounceStrength * (n.x - (liveW - wallMargin - n.radius));
        }
        if (n.y < wallMargin + n.radius) {
          n.vy = (n.vy ?? 0) + bounceStrength * (wallMargin + n.radius - n.y);
        } else if (n.y > liveH - wallMargin - n.radius) {
          n.vy = (n.vy ?? 0) - bounceStrength * (n.y - (liveH - wallMargin - n.radius));
        }

        // Hard boundary clamping — keep entire bubble inside the SVG using live dimensions
        const pad = n.radius + 4;
        n.x = Math.max(pad, Math.min(liveW - pad, n.x));
        n.y = Math.max(pad, Math.min(liveH - pad, n.y));
      });
      nodeG.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });
  }, []);

  // ── Macro view ────────────────────────────────────────────────────────────
  const showMacro = useCallback(() => {
    const w = svgRef.current?.clientWidth ?? window.innerWidth;
    const h = svgRef.current?.clientHeight ?? window.innerHeight;

    // Fibonacci golden-angle spiral — starting from center working outwards
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ≈ 2.399 rad
    const minDim = Math.min(w, h);

    const animate = !hasAnimatedMacro.current;

    const nodes: NodeDatum[] = shuffledIndustries.map((ind, i) => {
      // compact: start all bubbles inside the container so they fill corners, not cluster in center.
      // normal: wider spawn for cinematic entrance animation.
      const radiusMult = compact ? 0.42 : (animate ? 0.72 : 0.55);
      const spiralR = Math.sqrt(i + 0.5) * (minDim * radiusMult) / Math.sqrt(shuffledIndustries.length);
      const angle = i * goldenAngle;
      const initialX = w / 2 + spiralR * Math.cos(angle);
      const initialY = h / 2 + spiralR * Math.sin(angle);
      return {
        id: ind.id, label: ind.name,
        radius: computeIndustryRadius(ind, shuffledIndustries.length, w, h) * radiusScale, type: 'industry', originalData: ind,
        x: initialX, y: initialY,
        fx: animate ? initialX : null,
        fy: animate ? initialY : null
      };
    });
    // Pass the animate flag into buildSim
    buildSim(nodes, w, h, (d) => {
      if (readOnly) return;
      if (d.type === 'industry' && !transitioning) {
        setTransitioning(true);
        // Zoom-through: expand clicked node, fade rest
        const svg = d3.select(svgRef.current);
        svg.selectAll<SVGGElement, NodeDatum>('g.n')
          .transition().duration(650).ease(d3.easeCubicInOut)
          .style('opacity', (n: NodeDatum) => n.id === d.id ? 0 : 0)
          .attr('transform', (n: NodeDatum) => {
            if (n.id === d.id) {
              const w2 = svgRef.current?.clientWidth ?? window.innerWidth;
              const h2 = svgRef.current?.clientHeight ?? window.innerHeight;
              return `translate(${w2 / 2},${h2 / 2}) scale(20)`;
            }
            return `translate(${(n.x ?? 0) * 0.7},${(n.y ?? 0) * 0.7}) scale(0.05)`;
          });
        setTimeout(() => {
          setZoomedId(d.id);
          setTransitioning(false);
        }, 680);
      }
    }, animate, true, compact);

    // Once macro view has been shown, prevent future entrance animations
    hasAnimatedMacro.current = true;
  }, [industries, buildSim, transitioning, compact]);

  // ── Micro view ────────────────────────────────────────────────────────────
  const showMicro = useCallback((industryId: string) => {
    const w = svgRef.current?.clientWidth ?? window.innerWidth;
    const h = svgRef.current?.clientHeight ?? window.innerHeight;
    const businesses = getBusinessesByIndustry(industryId);
    // Fibonacci spiral for micro view too
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const minDim = Math.min(w, h);
    const sorted = [...businesses].sort((a, b) => {
      const order = { large: 0, medium: 1, small: 2 };
      return order[a.tier] - order[b.tier];
    });
    const nodes: NodeDatum[] = sorted.map((biz, i) => {
      const spiralR = Math.sqrt(i + 0.5) * (minDim * 0.35) / Math.sqrt(Math.max(sorted.length, 4));
      const angle = i * goldenAngle;
      return {
        id: biz.id, label: biz.name,
        radius: computeBusinessRadius(biz.tier, sorted.length, w, h) * radiusScale,
        type: 'business', tier: biz.tier, originalData: biz,
        x: w / 2 + spiralR * Math.cos(angle),
        y: h / 2 + spiralR * Math.sin(angle),
      };
    });

    // Fallback: if industry has no businesses, show a placeholder
    if (nodes.length === 0) {
      nodes.push({
        id: 'placeholder',
        label: 'Coming Soon',
        radius: 50,
        type: 'business',
        originalData: { id: 'placeholder', industry_id: industryId, name: 'Coming Soon', tier: 'small' },
      });
    }

    buildSim(nodes, w, h, (d) => {
      if (d.type === 'business') {
        onBusinessSelect(d.originalData as Business);
      }
    }, true, false); // true for animateEntrance, false for animateStagger
  }, [buildSim, onBusinessSelect]);

  // ── React to zoom state changes ───────────────────────────────────────────
  useEffect(() => {
    if (zoomedId === null) {
      showMacro();
    } else {
      showMicro(zoomedId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomedId]);

  // ── Initial load ─────────────────────────────────────────────────────────
  useEffect(() => {
    showMacro();
    const onResize = () => { if (!zoomedId) showMacro(); };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); simRef.current?.stop(); };
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Gold stroke on selected business ─────────────────────────────────────
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll<SVGCircleElement, NodeDatum>('circle.body')
      .attr('stroke', (d: NodeDatum) => {
        if (d.id === selectedId) return 'rgba(201,168,112,0.85)';
        if (d.tier === 'large') return 'rgba(220,220,220,0.5)';
        return 'rgba(47,79,79,0.55)';
      })
      .attr('stroke-width', (d: NodeDatum) => d.id === selectedId ? 2.5 : d.tier === 'large' ? 1.5 : 1);
  }, [selectedId]);

  // ── Background click = zoom out ───────────────────────────────────────────
  const handleBgClick = () => {
    if (readOnly || !zoomedId || transitioning) return;
    setTransitioning(true);
    const svg = d3.select(svgRef.current);
    svg.selectAll('g.inner').transition().duration(350).style('opacity', 0).style('transform', 'scale(0.8)');
    setTimeout(() => {
      setZoomedId(null);
      setTransitioning(false);
    }, 370);
  };

  return (
    <div
      className="relative w-full h-full"
      onWheel={e => window.scrollBy({ top: e.deltaY, behavior: 'auto' })}
    >
      <svg ref={svgRef} className="w-full h-full" onClick={handleBgClick} />
      {!readOnly && zoomedId && !transitioning && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none animate-fade-in">
          <p className="text-xs tracking-[0.3em] text-gainsboro/30 uppercase">
            click empty space to return
          </p>
        </div>
      )}
    </div>
  );
}
