'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent } from '../app/components/ui/card';
import { Button } from '../app/components/ui/button';
import { useTilt } from '../hooks/useTilt';
import { useMagnetic } from '../hooks/useMagnetic';

/* ── Hooks Showcase ──
   Interactive demonstrations of the custom hooks. */

/* useTilt demo */
function TiltDemo() {
  const { ref, rotateX, rotateY, scale, glareX, glareY, glareOpacity } = useTilt({ maxTilt: 8 });

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
      className="w-64 h-40 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-xl flex items-center justify-center cursor-pointer overflow-hidden relative"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.3) 0%, transparent 60%)`,
          opacity: glareOpacity,
        }}
      />
      <span className="text-white font-black text-xl" style={{ transform: 'translateZ(20px)' }}>Tilt Me</span>
    </motion.div>
  );
}

/* useMagnetic demo */
function MagneticDemo() {
  const magnet = useMagnetic({ maxDistance: 8, stiffness: 200, damping: 12 });

  return (
    <div ref={magnet.ref}>
      <motion.div style={{ x: magnet.x, y: magnet.y }}>
        <Button variant="brand" size="lg">
          Magnetic Hover
        </Button>
      </motion.div>
    </div>
  );
}

/* useParallax demo — scroll-driven */
function ParallaxDemo() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl overflow-y-auto relative">
      <div className="h-[400px] flex flex-col items-center justify-center gap-8 p-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">Scroll within this box to see parallax</p>
        <motion.div
          className="w-16 h-16 bg-primary rounded-full"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="w-12 h-12 bg-accent rounded-full"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">↑ Scroll-based parallax is active in the landing page hero section</p>
      </div>
    </div>
  );
}

function HooksPage() {
  return (
    <div className="p-12 max-w-5xl mx-auto space-y-12 bg-white dark:bg-gray-950 min-h-screen">
      <div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">🪝 Custom Hooks</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Interactive micro-interaction hooks for advanced UI effects.</p>
      </div>

      {/* useTilt */}
      <Card className="p-6">
        <CardContent className="space-y-4 pt-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">useTilt</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            3D card tilt effect following mouse cursor. Uses framer-motion springs for smooth animation.
            Configurable maxTilt, scale, stiffness, and damping.
          </p>
          <div className="flex justify-center pt-4">
            <TiltDemo />
          </div>
        </CardContent>
      </Card>

      {/* useMagnetic */}
      <Card className="p-6">
        <CardContent className="space-y-4 pt-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">useMagnetic</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Magnetic hover effect — element is attracted toward the cursor.
            Configurable maxDistance, stiffness, and damping. Used in RippleButton and LandingPage CTAs.
          </p>
          <div className="flex justify-center pt-4">
            <MagneticDemo />
          </div>
        </CardContent>
      </Card>

      {/* useParallax */}
      <Card className="p-6">
        <CardContent className="space-y-4 pt-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">useParallax</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Scroll-based parallax effect. Uses framer-motion&apos;s useScroll and useTransform.
            Supports shared containerRef for multiple elements with different speeds.
            Active in the landing page hero section (floating orbs, content wrapper).
          </p>
          <ParallaxDemo />
        </CardContent>
      </Card>

      {/* useRipple */}
      <Card className="p-6">
        <CardContent className="space-y-4 pt-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">useRipple</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click ripple effect. Creates a span.ripple-effect element at the click position
            that animates outward and auto-removes. Used by RippleButton.
            Requires the <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono">ripple</code> utility class on the target element.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            See the RippleButton component story for an interactive demo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const meta: Meta = {
  title: '🪝 Hooks / Overview',
  component: HooksPage,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const AllHooks: Story = { render: () => <HooksPage /> };
