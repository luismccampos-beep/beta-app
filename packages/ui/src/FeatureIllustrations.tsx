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

/* ── Map / Destinations ── */
export function MapIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <IllustrationWrapper {...props}>
      <circle cx="100" cy="100" r="80" fill="url(#mapGrad1)" opacity="0.12" />
      <path d="M50 60 L70 50 L95 65 L115 55 L140 70 L160 60 L170 80 L150 100 L160 120 L140 140 L120 150 L95 135 L75 145 L55 130 L45 110 L55 90 Z" stroke="url(#mapGrad2)" strokeWidth="2" opacity="0.4" fill="none" strokeLinejoin="round" />
      <circle cx="100" cy="90" r="26" stroke="url(#mapGrad2)" strokeWidth="1.5" opacity="0.3" strokeDasharray="4 4" />
      <circle cx="100" cy="90" r="6" fill="url(#mapGrad2)" opacity="0.8" />
      <path d="M100 90 L100 130" stroke="url(#mapGrad2)" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
      <circle cx="100" cy="135" r="5" fill="url(#mapGrad2)" opacity="0.7" />
      <circle cx="72" cy="70" r="4" fill="url(#mapGrad2)" opacity="0.6" />
      <circle cx="135" cy="78" r="4" fill="url(#mapGrad2)" opacity="0.6" />
      <circle cx="80" cy="120" r="3" fill="url(#mapGrad2)" opacity="0.5" />
      <circle cx="125" cy="115" r="3" fill="url(#mapGrad2)" opacity="0.5" />
      <defs>
        <radialGradient id="mapGrad1" cx="50%" cy="50%" r="50%">
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mapGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
    </IllustrationWrapper>
  );
}

/* ── Building / Hotels ── */
export function BuildingIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <IllustrationWrapper {...props}>
      <circle cx="100" cy="100" r="80" fill="url(#bldGrad1)" opacity="0.12" />
      <rect x="55" y="60" width="35" height="90" rx="4" fill="url(#bldGrad2)" opacity="0.15" />
      <rect x="55" y="60" width="35" height="90" rx="4" stroke="url(#bldGrad2)" strokeWidth="1.5" opacity="0.4" />
      <rect x="65" y="75" width="15" height="15" rx="2" fill="url(#bldGrad2)" opacity="0.5" />
      <rect x="65" y="100" width="15" height="15" rx="2" fill="url(#bldGrad2)" opacity="0.4" />
      <rect x="110" y="40" width="35" height="110" rx="4" fill="url(#bldGrad2)" opacity="0.15" />
      <rect x="110" y="40" width="35" height="110" rx="4" stroke="url(#bldGrad2)" strokeWidth="1.5" opacity="0.4" />
      <rect x="120" y="55" width="15" height="15" rx="2" fill="url(#bldGrad2)" opacity="0.5" />
      <rect x="120" y="80" width="15" height="15" rx="2" fill="url(#bldGrad2)" opacity="0.5" />
      <rect x="120" y="105" width="15" height="15" rx="2" fill="url(#bldGrad2)" opacity="0.4" />
      <rect x="55" y="148" width="90" height="6" rx="3" fill="url(#bldGrad2)" opacity="0.6" />
      <rect x="45" y="154" width="110" height="4" rx="2" fill="url(#bldGrad2)" opacity="0.4" />
      <defs>
        <radialGradient id="bldGrad1" cx="50%" cy="50%" r="50%">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bldGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#e11d48" />
        </linearGradient>
      </defs>
    </IllustrationWrapper>
  );
}

/* ── Award / Satisfaction ── */
export function AwardIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <IllustrationWrapper {...props}>
      <circle cx="100" cy="100" r="80" fill="url(#awdGrad1)" opacity="0.12" />
      <circle cx="100" cy="85" r="30" stroke="url(#awdGrad2)" strokeWidth="2.5" opacity="0.6" fill="url(#awdGrad1)" fillOpacity="0.08" />
      <polygon points="100,60 107,78 127,80 111,94 116,114 100,103 84,114 89,94 73,80 93,78" fill="url(#awdGrad2)" opacity="0.8" />
      <path d="M85 120 L75 155 L100 140 L125 155 L115 120" stroke="url(#awdGrad2)" strokeWidth="2" opacity="0.4" fill="none" strokeLinejoin="round" />
      <line x1="100" y1="140" x2="100" y2="155" stroke="url(#awdGrad2)" strokeWidth="2" opacity="0.4" />
      <circle cx="72" cy="102" r="2.5" fill="url(#awdGrad2)" opacity="0.5" />
      <circle cx="128" cy="102" r="2.5" fill="url(#awdGrad2)" opacity="0.5" />
      <defs>
        <radialGradient id="awdGrad1" cx="50%" cy="50%" r="50%">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="awdGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </IllustrationWrapper>
  );
}

/* ── Users / Community ── */
export function UsersIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <IllustrationWrapper {...props}>
      <circle cx="100" cy="100" r="80" fill="url(#usrGrad1)" opacity="0.12" />
      <circle cx="100" cy="65" r="20" stroke="url(#usrGrad2)" strokeWidth="2" opacity="0.5" fill="url(#usrGrad1)" fillOpacity="0.1" />
      <circle cx="100" cy="65" r="8" fill="url(#usrGrad2)" opacity="0.8" />
      <circle cx="70" cy="55" r="14" stroke="url(#usrGrad2)" strokeWidth="1.5" opacity="0.4" fill="url(#usrGrad1)" fillOpacity="0.08" />
      <circle cx="70" cy="55" r="5" fill="url(#usrGrad2)" opacity="0.6" />
      <circle cx="130" cy="55" r="14" stroke="url(#usrGrad2)" strokeWidth="1.5" opacity="0.4" fill="url(#usrGrad1)" fillOpacity="0.08" />
      <circle cx="130" cy="55" r="5" fill="url(#usrGrad2)" opacity="0.6" />
      <path d="M62 95 C62 80 138 80 138 95" stroke="url(#usrGrad2)" strokeWidth="2" opacity="0.35" fill="none" />
      <path d="M52 105 C52 94 148 94 148 105" stroke="url(#usrGrad2)" strokeWidth="2" opacity="0.25" fill="none" strokeDasharray="4 4" />
      <circle cx="45" cy="68" r="3" fill="url(#usrGrad2)" opacity="0.4" />
      <circle cx="155" cy="68" r="3" fill="url(#usrGrad2)" opacity="0.4" />
      <defs>
        <radialGradient id="usrGrad1" cx="50%" cy="50%" r="50%">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="usrGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#db2777" />
        </linearGradient>
      </defs>
    </IllustrationWrapper>
  );
}

/* ── Plane / Flights ── */
export function PlaneIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <IllustrationWrapper {...props}>
      <circle cx="100" cy="100" r="80" fill="url(#plnGrad1)" opacity="0.12" />
      <path d="M100 40 L110 80 L145 95 L155 100 L145 105 L110 120 L100 160 L90 120 L55 105 L45 100 L55 95 L90 80 Z" fill="url(#plnGrad2)" opacity="0.7" />
      <path d="M70 100 L130 100" stroke="white" strokeWidth="1.5" opacity="0.3" />
      <path d="M100 75 L100 125" stroke="white" strokeWidth="1.5" opacity="0.2" />
      <circle cx="100" cy="100" r="50" stroke="url(#plnGrad2)" strokeWidth="1" opacity="0.2" strokeDasharray="6 8" />
      <circle cx="72" cy="72" r="3" fill="url(#plnGrad2)" opacity="0.5" />
      <circle cx="128" cy="72" r="3" fill="url(#plnGrad2)" opacity="0.5" />
      <circle cx="72" cy="128" r="3" fill="url(#plnGrad2)" opacity="0.5" />
      <circle cx="128" cy="128" r="3" fill="url(#plnGrad2)" opacity="0.5" />
      <defs>
        <radialGradient id="plnGrad1" cx="50%" cy="50%" r="50%">
          <stop stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#0ea5e9" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="plnGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </IllustrationWrapper>
  );
}

/* ── Star / Rating ── */
export function StarIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <IllustrationWrapper {...props}>
      <circle cx="100" cy="100" r="80" fill="url(#strGrad1)" opacity="0.12" />
      <polygon points="100,35 113,70 150,73 120,98 130,135 100,114 70,135 80,98 50,73 87,70" fill="url(#strGrad2)" opacity="0.8" />
      <polygon points="100,50 108,72 132,74 113,90 119,113 100,98 81,113 87,90 68,74 92,72" fill="url(#strGrad1)" opacity="0.2" />
      <circle cx="100" cy="85" r="40" stroke="url(#strGrad2)" strokeWidth="1" opacity="0.2" strokeDasharray="4 6" />
      <circle cx="70" cy="68" r="2.5" fill="url(#strGrad2)" opacity="0.4" />
      <circle cx="130" cy="68" r="2.5" fill="url(#strGrad2)" opacity="0.4" />
      <defs>
        <radialGradient id="strGrad1" cx="50%" cy="50%" r="50%">
          <stop stopColor="#facc15" />
          <stop offset="1" stopColor="#facc15" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="strGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#facc15" />
          <stop offset="1" stopColor="#eab308" />
        </linearGradient>
      </defs>
    </IllustrationWrapper>
  );
}
