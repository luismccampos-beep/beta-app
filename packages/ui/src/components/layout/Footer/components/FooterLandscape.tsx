"use client";

import React, { useState, useEffect } from "react";

import Footer from "../index";

export const FooterLandscape: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setIsDarkMode(media.matches);

    update();

    if (media.addEventListener) {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    } else {
      media.addListener(update);
      return () => media.removeListener(update);
    }
  }, []);

  const colors = {
    sky: isDarkMode
      ? ["#1f2937", "#1e3a8a", "#0f172a", "#0f172a"]
      : ["#f59e0b", "#db2777", "#4f46e5", "#0f172a"],

    mountainBack: isDarkMode
      ? ["#1e293b", "#1e3a5c"]
      : ["#9d174d", "#4c1d95"],

    mountainFront: isDarkMode
      ? ["#1e3340", "#1e3a6c"]
      : ["#701a75", "#312e81"],

    ocean1: isDarkMode
      ? ["#1e2937", "#0f172a"]
      : ["#0284c7", "#0f172a"],

    ocean2: isDarkMode
      ? ["#1e2937", "#0f172a"]
      : ["#0369a1", "#0f172a"],
  };

  return (
    <div className={`w-full overflow-hidden leading-none ${className}`}>
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-auto block min-h-[250px] md:min-h-[400px]"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.sky[0]} />
            <stop offset="30%" stopColor={colors.sky[1]} />
            <stop offset="70%" stopColor={colors.sky[2]} />
            <stop offset="100%" stopColor={colors.sky[3]} />
          </linearGradient>

          <linearGradient id="mountainBack" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.mountainBack[0]} />
            <stop offset="100%" stopColor={colors.mountainBack[1]} />
          </linearGradient>

          <linearGradient id="mountainFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.mountainFront[0]} />
            <stop offset="100%" stopColor={colors.mountainFront[1]} />
          </linearGradient>

          <linearGradient id="oceanGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.ocean1[0]} />
            <stop offset="100%" stopColor={colors.ocean1[1]} />
          </linearGradient>

          <linearGradient id="oceanGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.ocean2[0]} />
            <stop offset="100%" stopColor={colors.ocean2[1]} />
          </linearGradient>
        </defs>

        <rect width="1440" height="400" fill="url(#skyGrad)" />

        {!isDarkMode && (
          <g>
            <circle cx="200" cy="200" r="140" fill="#fcd34d" opacity="0.1" />
            <circle cx="200" cy="200" r="90" fill="#fcd34d" opacity="0.2" />
            <circle cx="200" cy="200" r="50" fill="#fcd34d" />
          </g>
        )}

        {isDarkMode && (
          <g>
            <circle cx="1250" cy="140" r="80" fill="#e2e8f0" opacity="0.05" />
            <circle cx="1250" cy="140" r="50" fill="#e2e8f0" opacity="0.1" />
            <circle cx="1250" cy="140" r="35" fill="#f8fafc" />
          </g>
        )}

        {/* Twinkling stars */}
        <g fill="#fff" opacity={isDarkMode ? 1 : 0.2} className="stars">
          <circle cx="1050" cy="80" r="1.5" />
          <circle cx="1150" cy="150" r="2" />
          <circle cx="1250" cy="60" r="1" />
          <circle cx="1320" cy="180" r="1.5" />
          <circle cx="1400" cy="110" r="2" />
        </g>

        <path
          d="M-50,400 L-50,220 L150,90 L320,240 L480,120 L750,350 L900,400 Z"
          fill="url(#mountainBack)"
        />

        <path
          d="M-50,400 L-50,300 L200,160 L380,310 L580,220 L850,400 Z"
          fill="url(#mountainFront)"
        />

        {/* Animated waves */}
        <path
          className="waveSlow"
          d="M400,400 L550,320 C750,230 950,350 1150,320 C1300,295 1440,340 1440,340 L1440,400 Z"
          fill="url(#oceanGrad1)"
        />

        <path
          className="waveFast"
          d="M200,400 L400,360 C650,300 850,380 1100,350 C1300,320 1440,370 1440,385 L1440,400 Z"
          fill="url(#oceanGrad2)"
        />

        <path
          d="M0,400 L0,390 C400,350 800,410 1440,385 L1440,400 Z"
          fill="#0f172a"
        />
      </svg>

      <Footer />

      <style jsx>{`
        .waveSlow {
          animation: waveSlow 12s ease-in-out infinite alternate;
          transform-origin: center;
        }

        .waveFast {
          animation: waveFast 6s ease-in-out infinite alternate;
          transform-origin: center;
        }

        .stars circle {
          animation: twinkle 3s ease-in-out infinite;
        }

        .stars circle:nth-child(2) {
          animation-delay: 1s;
        }

        .stars circle:nth-child(3) {
          animation-delay: 2s;
        }

        .stars circle:nth-child(4) {
          animation-delay: 0.5s;
        }

        @keyframes waveSlow {
          from {
            transform: translateX(-10px);
          }
          to {
            transform: translateX(10px);
          }
        }

        @keyframes waveFast {
          from {
            transform: translateX(15px);
          }
          to {
            transform: translateX(-15px);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};