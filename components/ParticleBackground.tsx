'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLES_COUNT = 1500;

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();

  const [positions, initialPositions] = useMemo(() => {
    const poss = new Float32Array(PARTICLES_COUNT * 3);
    const initialPoss = new Float32Array(PARTICLES_COUNT * 3);
    for (let i = 0; i < PARTICLES_COUNT; i++) {
      // spread particles across the screen
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10;
      poss[i * 3] = x;
      poss[i * 3 + 1] = y;
      poss[i * 3 + 2] = z;

      initialPoss[i * 3] = x;
      initialPoss[i * 3 + 1] = y;
      initialPoss[i * 3 + 2] = z;
    }
    return [poss, initialPoss];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const array = positionsAttr.array as Float32Array;

    // Convert normalized mouse to world coordinates approximately
    const targetX = (mouse.x * viewport.width) / 2;
    const targetY = (mouse.y * viewport.height) / 2;

    for (let i = 0; i < PARTICLES_COUNT; i++) {
      const idx = i * 3;
      const currentX = array[idx];
      const currentY = array[idx + 1];
      
      const initX = initialPositions[idx];
      const initY = initialPositions[idx + 1];

      // Distance to mouse
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      const dist = Math.hypot(dx, dy);

      // Magnetic pull radius
      const maxDist = 4;
      
      if (dist < maxDist) {
        // Fast swirl towards mouse
        const force = (maxDist - dist) / maxDist;
        array[idx] += dx * 0.05 * force;
        array[idx + 1] += dy * 0.05 * force;
      } else {
        // Slowly return to original position
        array[idx] += (initX - currentX) * 0.02;
        array[idx + 1] += (initY - currentY) * 0.02;
      }

      // Slow idle drift based on time
      array[idx] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002;
      array[idx + 1] += Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.002;
      
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Particles />
      </Canvas>
    </div>
  );
}
