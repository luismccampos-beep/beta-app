'use client';

import { type SVGProps } from 'react';

/* ── Abstract geometric illustrations for feature cards ──
   Each component renders a 200×200 viewBox illustration
   with layered geometric shapes that match the feature's theme. */

function IllustrationWrapper({ children, className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/* ── AI / Brain ── */
export function AIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <IllustrationWrapper {...props}>
      {/* Background glow */}
      <circle cx="100" cy="100" r="90" fill="url(#aiGrad1)" opacity="0.15" />
      {/* Neural node circles */}
      <circle cx="100" cy="45" r="16" fill="url(#aiGrad2)" opacity="0.9" />
      <circle cx="55" cy="155" r="12" fill="url(#aiGrad2)" opacity="0.8" />
      <circle cx="145" cy="155" r="12" fill="url(#aiGrad2)" opacity="0.8" />
      <circle cx="100" cy="100" r="10" fill="url(#aiGrad2)" opacity="0.7" />
      <circle cx="72" cy="72" r="8" fill="url(#aiGrad2)" opacity="0.6" />
      <circle cx="128" cy="72" r="8" fill="url(#aiGrad2)" opacity="0.6" />
      {/* Connections */}
      <line x1="100" y1="45" x2="145" y2="155" stroke="url(#aiGrad2)" strokeWidth="1.5" opacity="0.4" />
      <line x1="100" y1="45" x2="55" y2="155" stroke="url(#aiGrad2)" strokeWidth="1.5" opacity="0.4" />
      <line x1="100" y1="100" x2="145" y2="155" stroke="url(#aiGrad2)" strokeWidth="1.5" opacity="0.3" />
      <line x1="100" y1="100" x2="55" y2="155" stroke="url(#aiGrad2)" strokeWidth="1.5" opacity="0.3" />
      <line x1="72" y1="72" x2="128" y2="72" stroke="url(#aiGrad2)" strokeWidth="1.5" opacity="0.3" />
      {/* Pulse ring */}
      <circle cx="100" cy="45" r="28" stroke="url(#aiGrad2)" strokeWidth="1" opacity="0.3" strokeDasharray="6 4" />
      <defs>
        <radialGradient id="aiGrad1" cx="50%" cy="50%" r="50%">
          <stop stopColor="#06b6d4" />
          <stop offset="1" stopColor="#06b6d4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="aiGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#06b6d4" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
      </defs>
    </IllustrationWrapper>
  );
}

/* ── Globe / Coverage ── */
export function GlobeIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <IllustrationWrapper {...props}>
      <circle cx="100" cy="100" r="80" fill="url(#globeGrad1)" opacity="0.12" />
      <circle cx="100" cy="100" r="62" stroke="url(#globeGrad2)" strokeWidth="2" opacity="0.5" />
      {/* Meridians */}
      <ellipse cx="100" cy="100" rx="62" ry="30" stroke="url(#globeGrad2)" strokeWidth="1.5" opacity="0.4" />
      <ellipse cx="100" cy="100" rx="62" ry="30" stroke="url(#globeGrad2)" strokeWidth="1.5" opacity="0.4" transform="rotate(60 100 100)" />
      <ellipse cx="100" cy="100" rx="62" ry="30" stroke="url(#globeGrad2)" strokeWidth="1.5" opacity="0.4" transform="rotate(-60 100 100)" />
      <line x1="38" y1="100" x2="162" y2="100" stroke="url(#globeGrad2)" strokeWidth="2" opacity="0.5" />
      {/* Dots on globe */}
      <circle cx="80" cy="60" r="4" fill="url(#globeGrad2)" opacity="0.8" />
      <circle cx="130" cy="75" r="3" fill="url(#globeGrad2)" opacity="0.7" />
      <circle cx="65" cy="130" r="3.5" fill="url(#globeGrad2)" opacity="0.6" />
      <circle cx="140" cy="120" r="3" fill="url(#globeGrad2)" opacity="0.7" />
      <circle cx="100" cy="90" r="2.5" fill="url(#globeGrad2)" opacity="0.5" />
      {/* Orbit ring */}
      <ellipse cx="100" cy="100" rx="90" ry="20" stroke="url(#globeGrad2)" strokeWidth="1" opacity="0.2" strokeDasharray="4 8" transform="rotate(-20 100 100)" />
      <defs>
        <radialGradient id="globeGrad1" cx="50%" cy="50%" r="50%">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="globeGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </IllustrationWrapper>
  );
}

/* ── Security / Lock ── */
export function SecurityIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <IllustrationWrapper {...props}>
      {/* Shield shape */}
      <path
        d="M100 20 L160 45 L160 105 C160 145 130 170 100 182 C70 170 40 145 40 105 L40 45 Z"
        fill="url(#secGrad1)"
        opacity="0.1"
      />
      <path
        d="M100 30 L152 52 L152 105 C152 140 126 163 100 174 C74 163 48 140 48 105 L48 52 Z"
        stroke="url(#secGrad2)"
        strokeWidth="2"
        opacity="0.5"
      />
      {/* Lock icon inside shield */}
      <rect x="85" y="80" width="30" height="26" rx="5" fill="url(#secGrad2)" opacity="0.7" />
      <path d="M91 80 V70 C91 60 109 60 109 70 V80" stroke="url(#secGrad2)" strokeWidth="3" fill="none" opacity="0.7" strokeLinecap="round" />
      <circle cx="100" cy="95" r="4" fill="white" opacity="0.7" />
      {/* Checkmark */}
      <path d="M88 138 L96 148 L116 125" stroke="url(#secGrad2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <defs>
        <linearGradient id="secGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#22c55e" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="secGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#22c55e" />
          <stop offset="1" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </IllustrationWrapper>
  );
}

/* ── Smart Recommendations / Trending ── */
export function TrendingIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <IllustrationWrapper {...props}>
      {/* Graph axes */}
      <line x1="30" y1="170" x2="180" y2="170" stroke="url(#trendGrad2)" strokeWidth="1.5" opacity="0.3" />
      <line x1="30" y1="170" x2="30" y2="20" stroke="url(#trendGrad2)" strokeWidth="1.5" opacity="0.3" />
      {/* Upward trend line */}
      <path
        d="M40 150 L80 120 L100 130 L135 70 L160 40"
        stroke="url(#trendGrad2)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.8"
      />
      {/* Area fill under line */}
      <path
        d="M40 150 L80 120 L100 130 L135 70 L160 40 L160 170 L40 170 Z"
        fill="url(#trendGrad1)"
        opacity="0.15"
      />
      {/* Data points */}
      <circle cx="40" cy="150" r="5" fill="url(#trendGrad2)" opacity="0.8" />
      <circle cx="80" cy="120" r="5" fill="url(#trendGrad2)" opacity="0.8" />
      <circle cx="100" cy="130" r="5" fill="url(#trendGrad2)" opacity="0.8" />
      <circle cx="135" cy="70" r="5" fill="url(#trendGrad2)" opacity="0.8" />
      <circle cx="160" cy="40" r="6" fill="url(#trendGrad2)" opacity="1" />
      {/* Arrow tip */}
      <path d="M160 40 L152 52" stroke="url(#trendGrad2)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <path d="M160 40 L168 52" stroke="url(#trendGrad2)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <defs>
        <linearGradient id="trendGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ea580c" />
          <stop offset="1" stopColor="#ea580c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="trendGrad2" x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="#ea580c" />
          <stop offset="1" stopColor="#dc2626" />
        </linearGradient>
      </defs>
    </IllustrationWrapper>
  );
}

/* ── Seamless Booking / Zap ── */
export function ZapIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <IllustrationWrapper {...props}>
      {/* Card shape */}
      <rect x="40" y="40" width="120" height="140" rx="12" fill="url(#zapGrad1)" opacity="0.08" />
      <rect x="40" y="40" width="120" height="140" rx="12" stroke="url(#zapGrad2)" strokeWidth="1.5" opacity="0.3" />
      {/* Card lines */}
      <rect x="60" y="60" width="40" height="6" rx="3" fill="url(#zapGrad2)" opacity="0.4" />
      <rect x="60" y="76" width="80" height="4" rx="2" fill="url(#zapGrad2)" opacity="0.2" />
      <rect x="60" y="88" width="60" height="4" rx="2" fill="url(#zapGrad2)" opacity="0.2" />
      {/* Lightning bolt */}
      <path
        d="M115 90 L95 115 L108 115 L92 145 L128 112 L113 112 Z"
        fill="url(#zapGrad2)"
        opacity="0.7"
      />
      {/* Check badge */}
      <circle cx="145" cy="55" r="14" fill="url(#zapGrad2)" opacity="0.18" />
      <path d="M139 55 L143 60 L152 50" stroke="url(#zapGrad2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <defs>
        <linearGradient id="zapGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#eab308" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="zapGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#eab308" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </IllustrationWrapper>
  );
}

/* ── Sustainable Travel / Nature ── */
export function NatureIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <IllustrationWrapper {...props}>
      {/* Sun */}
      <circle cx="100" cy="100" r="70" fill="url(#natGrad1)" opacity="0.1" />
      <circle cx="100" cy="100" r="32" fill="url(#natGrad2)" opacity="0.15" />
      {/* Leaf shapes */}
      <path
        d="M100 100 C80 60 50 70 55 90 C60 110 80 130 100 100 Z"
        fill="url(#natGrad2)"
        opacity="0.6"
      />
      <path
        d="M100 100 C120 60 150 70 145 90 C140 110 120 130 100 100 Z"
        fill="url(#natGrad2)"
        opacity="0.5"
      />
      <path
        d="M100 100 C85 130 90 160 100 165 C110 160 115 130 100 100 Z"
        fill="url(#natGrad2)"
        opacity="0.4"
      />
      {/* Stem */}
      <line x1="100" y1="160" x2="100" y2="180" stroke="url(#natGrad2)" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
      {/* Small circles (dewdrops) */}
      <circle cx="70" cy="95" r="3" fill="url(#natGrad2)" opacity="0.5" />
      <circle cx="130" cy="95" r="3" fill="url(#natGrad2)" opacity="0.5" />
      <defs>
        <radialGradient id="natGrad1" cx="50%" cy="50%" r="50%">
          <stop stopColor="#84cc16" />
          <stop offset="1" stopColor="#84cc16" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="natGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#84cc16" />
          <stop offset="1" stopColor="#16a34a" />
        </linearGradient>
      </defs>
    </IllustrationWrapper>
  );
}
