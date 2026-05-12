'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { cn } from '../../utils/cn';

interface OrbProps {
  color: string;
  className?: string;
  delay?: number;
  duration?: number;
  size?: string;
}

const Orb: React.FC<OrbProps> = ({ color, className, delay = 0, duration = 20, size = '40vw' }) => (
  <motion.div
    initial={{ x: '-10%', y: '-10%', scale: 1, opacity: 0.3 }}
    animate={{ 
      x: ['0%', '20%', '-10%', '10%', '0%'],
      y: ['0%', '-20%', '10%', '-10%', '0%'],
      scale: [1, 1.2, 0.9, 1.1, 1],
      opacity: [0.3, 0.5, 0.2, 0.4, 0.3],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
    className={cn(
      "absolute rounded-full blur-[120px] pointer-events-none",
      color,
      className
    )}
    style={{ 
      width: size, 
      height: size,
    }}
  />
);

export const VibrantBackground: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Background Base */}
      <div className="fixed inset-0 bg-slate-50 dark:bg-zinc-950 transition-colors duration-700" />

      {/* Premium Animated Orbs - Dark Mode Colors */}
      <div className="fixed inset-0 z-0 opacity-0 dark:opacity-100 transition-opacity duration-1000">
        <Orb color="bg-indigo-600/30" className="top-[-10%] left-[-10%]" duration={25} />
        <Orb color="bg-purple-600/20" className="bottom-[-10%] right-[-10%]" delay={2} duration={30} />
        <Orb color="bg-blue-500/10" className="top-[30%] right-[10%]" delay={5} duration={22} size="30vw" />
        <Orb color="bg-pink-500/10" className="bottom-[20%] left-[20%]" delay={8} duration={28} size="25vw" />
      </div>

      {/* Premium Animated Orbs - Light Mode Colors */}
      <div className="fixed inset-0 z-0 opacity-100 dark:opacity-0 transition-opacity duration-1000">
        <Orb color="bg-sky-400/20" className="top-[-5%] right-[-5%]" duration={20} />
        <Orb color="bg-rose-400/10" className="bottom-[10%] left-[-5%]" delay={3} duration={25} />
        <Orb color="bg-amber-300/10" className="top-[40%] left-[30%]" delay={6} duration={35} size="35vw" />
        <Orb color="bg-indigo-300/15" className="bottom-[30%] right-[20%]" delay={1} duration={24} size="28vw" />
      </div>

      {/* Mesh Gradient + Noise Overlay */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Glassmorphism Mask (Optional, add a subtle grid or gradient fade) */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(255,255,255,0.2)_100%)] dark:bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(0,0,0,0.3)_100%)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default VibrantBackground;
