# GTA Marketing Digital Hub - Phase 2 Summary

This document outlines everything built in Phase 2 of the GTA Marketing Digital Hub. You can provide this to any LLM or chatbot to give it complete context on the current state of the application's graphics and physics engine.

## 1. Tech Stack & Architecture
- **Framework:** Next.js 14+ (App Router), React, TypeScript.
- **Styling:** Tailwind CSS + custom traditional `globals.css` for advanced animations.
- **Physics Engine:** D3.js (`d3-force`) integrated inside a React component (`ConstellationCanvas.tsx`), rendering SVG elements mapped via React state and ref.

## 2. Aesthetic & Layout
- **Style:** "Premium Dark Web3 / Fintech" aesthetic. Deep charcoal backgrounds, sharp white text, subtle glowing borders.
- **Typography:** `Space Grotesk` for primary structural elements and `Inter` for supporting text. All text scales dynamically to fit perfectly inside its respective SVG node.
- **Emojis:** Completely removed. The design relies purely on clean typography and negative space.
- **Scroll Structure:** The app is no longer locked to a single screen. The D3 constellation exists inside a 100vh hero section, but standard vertical scrolling is enabled so the user can scroll down to a placeholder "Mission & Information" text block.

## 3. Custom Hardware-Accelerated Cursor
- **Design:** Replaced the OS cursor with a sharp 4px solid white dot.
- **Trailing Ring:** Added a subtle 20px elastic outer ring that trails the mouse with spring physics.
- **Background Glow:** A massive, soft Navy/Charcoal radial gradient (`CursorGlow.tsx`) tracking the mouse in the background behind everything else.
- **Integration:** The cursor uses `clientX/clientY` and absolute screen positioning so it remains locked to the mouse smoothly even when the user scrolls down the page.

## 4. D3 Physics & "Heavy Gravity" Tuning
- **Randomized Spiral Spawn:** On the very first page load, the 30 industries are shuffled randomly and spawned in a wide Fibonacci spiral (radius multiplier 0.40) so they start spread out across the screen.
- **Kinetic Gravity:** A strong center force slowly pulls the wide array of bubbles inward. The velocity decay (friction) is set aggressively to `0.65`, giving the bubbles a "heavy" feel. When they collide, they don't bounce wildly; they slide and lock together with deadened collisions to form a dense cluster perfectly in the center.
- **Soft Repelling Screen Edges:** A custom tick calculation checks if a bubble's radius touches the mathematical edge of the visible screen. If it does, a bouncy force instantly pushes it back toward the center so bubbles never clip outside the viewport.
- **Hover Interactions:** Hovering over an industry node expands its glowing border by 20px and brightens its stroke, providing premium tactile feedback.

## 5. The 3.2-Second Sequential "Bloom" Animation
- **Initial Load:** A specialized sequence was built over top of the physics engine. On the first page load, the 30 bubbles appear one-by-one from the center outwards over exactly 3.2 seconds.
- **Mechanism:** The D3 force simulation (`fx` and `fy` coordinates) freezes each node in its initial wide spiral placement. A chained D3 transition delays the `scale()` and `opacity` pop-in by calculating `index * (3200 / 30)`. At the exact millisecond a node's visual pop-in begins, `fx` and `fy` are cleared, dropping it into the live gravity simulation.
- **Preserved Randomization & Skipped Animation:** The randomized industry order is locked via React `useMemo`. Furthermore, a `useRef` flag (`hasAnimatedMacro`) ensures that the 3.2-second animation only plays *once*. If a user clicks into a micro view and then returns to the macro hub, the sequence is completely bypassed, and the bubbles render instantly in their settled, center-clustered shape.

## 6. Current State
Phase 2 foundation is 100% complete. The project is ready for Phase 3, which involves building the real responsive HTML content for the vertical scrolling "Mission & Goals" section underneath the hero, and designing the rich UI layout for the "Micro View" when a user clicks into a specific industry to view its local businesses.
