'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('gta-map-visited')) {
      const t = setTimeout(() => {
        setVisible(true);
        localStorage.setItem('gta-map-visited', '1');
      }, 1200);
      const hide = setTimeout(() => setVisible(false), 7000);
      return () => { clearTimeout(t); clearTimeout(hide); };
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setVisible(false)}
          style={{
            position: 'absolute', bottom: 52, left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 40,
            background: 'rgba(20,20,22,0.94)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12, padding: '10px 20px',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', gap: 12,
            cursor: 'pointer', whiteSpace: 'nowrap',
            pointerEvents: 'auto',
          }}
        >
          <span style={{
            fontSize: 13, color: 'rgba(239,239,239,0.65)', letterSpacing: '0.01em',
          }}>
            Tap any industry bubble to see the businesses inside.
          </span>
          <span style={{
            fontSize: 10, color: 'rgba(239,239,239,0.25)',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            paddingLeft: 12, letterSpacing: '0.06em',
          }}>
            Got it ✓
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
