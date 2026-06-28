'use client';

import { useCallback, useRef } from 'react';
import { type MotionValue, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface UseTiltOptions {
  /** Maximum rotation in degrees */
  maxTilt?: number;
  /** Scale on hover */
  scale?: number;
  /** Spring stiffness for smooth animation */
  stiffness?: number;
  /** Spring damping */
  damping?: number;
}

interface UseTiltResult {
  ref: React.RefCallback<HTMLElement>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  scale: MotionValue<number>;
  /** Glare/shine position transforms for a gradient overlay */
  glareX: MotionValue<string>;
  glareY: MotionValue<string>;
  glareOpacity: MotionValue<number>;
}

/**
 * Creates a 3D tilt effect on cards that follows the mouse cursor.
 * Attach the ref to the card element and apply the motion values.
 *
 * @example
 * const { ref, rotateX, rotateY, scale } = useTilt({ maxTilt: 8 });
 * <motion.div ref={ref} style={{ rotateX, rotateY, scale }}>...</motion.div>
 */
export function useTilt(options: UseTiltOptions = {}): UseTiltResult {
  const { maxTilt = 8, scale: hoverScale = 1.02, stiffness = 200, damping = 20 } = options;

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scaleMotion = useMotionValue(1);
  const glareOpacity = useMotionValue(0);

  const springRotateX = useSpring(rotateX, { stiffness, damping });
  const springRotateY = useSpring(rotateY, { stiffness, damping });
  const springScale = useSpring(scaleMotion, { stiffness, damping });
  const springGlareOpacity = useSpring(glareOpacity, { stiffness, damping });

  const glareX = useTransform(springRotateY, [-maxTilt, maxTilt], ['0%', '100%']);
  const glareY = useTransform(springRotateX, [-maxTilt, maxTilt], ['0%', '100%']);

  const elementRef = useRef<HTMLElement | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = elementRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateYVal = ((x - centerX) / centerX) * maxTilt;
      const rotateXVal = ((centerY - y) / centerY) * maxTilt;

      rotateX.set(rotateXVal);
      rotateY.set(rotateYVal);
      scaleMotion.set(hoverScale);
      glareOpacity.set(0.15);
    },
    [maxTilt, hoverScale, rotateX, rotateY, scaleMotion, glareOpacity],
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scaleMotion.set(1);
    glareOpacity.set(0);
  }, [rotateX, rotateY, scaleMotion, glareOpacity]);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (elementRef.current) {
        elementRef.current.removeEventListener('mousemove', handleMouseMove);
        elementRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }

      elementRef.current = node;

      if (node) {
        node.addEventListener('mousemove', handleMouseMove);
        node.addEventListener('mouseleave', handleMouseLeave);
        node.style.transformStyle = 'preserve-3d';
        node.style.perspective = '1000px';
      }
    },
    [handleMouseMove, handleMouseLeave],
  );

  return {
    ref,
    rotateX: springRotateX,
    rotateY: springRotateY,
    scale: springScale,
    glareX,
    glareY,
    glareOpacity: springGlareOpacity,
  };
}
