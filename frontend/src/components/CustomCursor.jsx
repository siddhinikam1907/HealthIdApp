import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cursorX = useSpring(0, { stiffness: 300, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 300, damping: 28 });
  const dotX = useSpring(0, { stiffness: 800, damping: 35 });
  const dotY = useSpring(0, { stiffness: 800, damping: 35 });

  useEffect(() => {
    // Check for touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsTouchDevice(true);
      return;
    }

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-hover')
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-hover')
      ) {
        setIsHovering(false);
      }
    };

    const handleMouseOut = () => setIsVisible(false);
    const handleMouseIn = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseIn);
    document.addEventListener('mouseleave', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseIn);
      document.removeEventListener('mouseleave', handleMouseOut);
    };
  }, [cursorX, cursorY, dotX, dotY, isVisible]);

  if (isTouchDevice) return null;

  return (
    <>
      <style>{`
        @media (hover: hover) {
          * { cursor: none !important; }
        }
      `}</style>
      {/* Follower ring */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: cursorX,
          y: cursorY,
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          borderRadius: '50%',
          border: `1.5px solid ${isHovering ? 'rgba(255,51,102,0.6)' : 'rgba(255,255,255,0.25)'}`,
          pointerEvents: 'none',
          zIndex: 99999,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
          mixBlendMode: 'difference',
          transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease',
        }}
      />
      {/* Center dot */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: dotX,
          y: dotY,
          width: isHovering ? 6 : 4,
          height: isHovering ? 6 : 4,
          borderRadius: '50%',
          background: isHovering ? '#FF3366' : '#F0EDE8',
          pointerEvents: 'none',
          zIndex: 99999,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.2s ease, height 0.2s ease, background 0.2s ease',
        }}
      />
    </>
  );
};

export default CustomCursor;
