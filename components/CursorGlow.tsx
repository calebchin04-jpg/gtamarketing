'use client';

import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      // Move the glow canvas instantly
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(
          600px circle at ${e.pageX}px ${e.pageY}px,
          rgba(47, 79, 79, 0.18) 0%,
          rgba(20, 30, 50, 0.10) 40%,
          transparent 70%
        )`;
      }

      // Move dot cursor instantly
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    // Smooth ring follow via RAF
    const animateRing = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.25; // Snappier follow
      ring.current.y += (mouse.current.y - ring.current.y) * 0.25;
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top = `${ring.current.y}px`;
      }
      rafId.current = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove);
    rafId.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      {/* Fintech glow overlay */}
      <div
        ref={glowRef}
        className="fixed inset-0 pointer-events-none z-0 transition-none"
        style={{ background: 'radial-gradient(600px circle at -200px -200px, transparent 0%, transparent 100%)' }}
      />
      {/* Custom cursor dot */}
      <div ref={dotRef} className="cursor-dot" />
      {/* Custom cursor ring */}
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
