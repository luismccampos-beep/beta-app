"use client";

import React, { type HTMLAttributes, useEffect, useId, useMemo, useState } from 'react';

import { cn } from '../../utils/index';

type LogoVariant = 'default' | 'inverted' | 'gradient';
type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
    variant?: LogoVariant;
    size?: LogoSize;
    withIcon?: boolean;
    withText?: boolean;
    animateOnHover?: boolean;
    glowEffect?: boolean;
    withParticles?: boolean;
    pulseOnIdle?: boolean;
    label?: string;
    imageSrc?: string;
    className?: string;
}

// Utilitário simples para compor classes
const cx = (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(' ');

// Configurações por tamanho
const SIZES: Record<
    LogoSize,
    { container: string; icon: string; gap: string; particleBase: number; font: string }
> = {
    xs: { container: 'h-6', icon: 'h-4 w-4', gap: 'gap-0.5', particleBase: 1, font: 'text-sm' },
    sm: { container: 'h-8', icon: 'h-5 w-5', gap: 'gap-1', particleBase: 1.4, font: 'text-lg' },
    md: { container: 'h-10', icon: 'h-6 w-6', gap: 'gap-1', particleBase: 1.8, font: 'text-2xl' },
    lg: { container: 'h-12', icon: 'h-8 w-8', gap: 'gap-1.5', particleBase: 2.4, font: 'text-3xl' },
    xl: { container: 'h-14', icon: 'h-10 w-10', gap: 'gap-2', particleBase: 3, font: 'text-4xl' },
};

// Estilos por variante
const VARIANTS: Record<
    LogoVariant,
    { base: string; accent: string; glow: string; iconTone: string }
> = {
    default: {
        base: 'text-blue-600',
        accent: 'text-blue-500',
        glow: 'shadow-blue-500/50',
        iconTone: 'text-blue-600',
    },
    inverted: {
        base: 'text-white',
        accent: 'text-white/80',
        glow: 'shadow-white/40',
        iconTone: 'text-white',
    },
    gradient: {
        base:
            'bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent',
        accent:
            'bg-gradient-to-r from-blue-500 via-purple-400 to-indigo-400 bg-clip-text text-transparent',
        glow: 'shadow-blue-400/40',
        iconTone: 'text-blue-500',
    },
};

const STYLE_TAG_ID = 'akm-logo-animations';

const ANIMATIONS = `
@keyframes akmLogoFadeIn {
  from { opacity: 0; transform: translateY(-14px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes akmLogoHover {
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}

@keyframes akmLogoGlow {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(234, 179, 8, 0.45)); }
  50% { filter: drop-shadow(0 0 18px rgba(234, 179, 8, 0.8)); }
}

@keyframes akmLogoParticle {
  0% { opacity: 0; transform: scale(0.6) translate3d(0, 8px, 0); }
  30% { opacity: 0.65; transform: scale(1) translate3d(4px, -4px, 0); }
  70% { opacity: 0.45; transform: scale(0.85) translate3d(-6px, -14px, 0); }
  100% { opacity: 0; transform: scale(0.6) translate3d(-8px, -20px, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .akm-logo--animated,
  .akm-logo__particle {
    animation: none !important;
    transition: none !important;
  }
}
`;

const usePrefersReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleChange = () => setPrefersReducedMotion(media.matches);

        handleChange();
        media.addEventListener('change', handleChange);
        return () => media.removeEventListener('change', handleChange);
    }, []);

    return prefersReducedMotion;
};

const ensureAnimationsInjected = () => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(STYLE_TAG_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_TAG_ID;
    style.textContent = ANIMATIONS;
    document.head.appendChild(style);
};

const generateParticles = (count: number, scale: number) => {
    // Use a deterministic approach to ensure server and client generate the same values
    const particles = [];

    for (let i = 0; i < count; i++) {
        // Use a simple deterministic pseudo-random function based on index
        // This ensures the same values are generated on both server and client
        const seed = (i * 17 + 13) % 1000; // Simple deterministic seed
        const random = (s: number) => (s * 9301 + 49297) % 233280 / 233280;

        const r1 = random(seed);
        const r2 = random(seed + 1);
        const r3 = random(seed + 2);
        const r4 = random(seed + 3);

        particles.push({
            id: i,
            size: (r1 * 4 + 3) * scale,
            left: r2 * 100,
            top: r3 * 100,
            delay: r4 * 1.8,
            duration: random(seed + 4) * 1.8 + 1.8,
        });
    }

    return particles;
};

export const Logo: React.FC<LogoProps> = ({
    className,
    variant = 'default',
    size = 'md',
    withIcon = true,
    withText = true,
    animateOnHover = true,
    glowEffect = true,
    withParticles = true,
    pulseOnIdle = false,
    label = 'AKMLEVA',
    imageSrc = '/images/logo.svg',
    ...props
}) => {
    const [isHovering, setIsHovering] = useState(false);
    const prefersReducedMotion = usePrefersReducedMotion();
    const uniqueId = useId();

    // eslint-disable-next-line security/detect-object-injection
    const sizeStyles = SIZES[size];
    // eslint-disable-next-line security/detect-object-injection
    const variantStyles = VARIANTS[variant];

    useEffect(() => {
        ensureAnimationsInjected();
    }, []);

    const wrapperClass = useMemo(
        () =>
            cx(
                'akm-logo relative inline-flex select-none items-center font-extrabold tracking-tight transition-transform duration-300 ease-out',
                sizeStyles.container,
                sizeStyles.font,
                sizeStyles.gap,
                withParticles && 'overflow-visible',
                animateOnHover && 'cursor-pointer',
                'akm-logo--animated animate-[akmLogoFadeIn_0.6s_ease-out]',
                animateOnHover &&
                isHovering &&
                !prefersReducedMotion &&
                'animate-[akmLogoHover_0.35s_ease-out_forwards]',
                pulseOnIdle &&
                !isHovering &&
                !prefersReducedMotion &&
                'animate-[akmLogoGlow_2.8s_ease-in-out_infinite]',
                className
            ),
        [
            animateOnHover,
            className,
            isHovering,
            prefersReducedMotion,
            pulseOnIdle,
            sizeStyles.container,
            sizeStyles.font,
            sizeStyles.gap,
            withParticles,
        ]
    );

    const particles = useMemo(
        () => (withParticles ? generateParticles(Math.round(6 * sizeStyles.particleBase), sizeStyles.particleBase) : []),
        [withParticles, sizeStyles.particleBase]
    );

    return (
        <div
            {...props}
            className={wrapperClass}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            aria-label={label}
        >
            {withIcon && (
                <div
                    className={cn(
                        'relative flex items-center justify-center rounded-md overflow-hidden',
                        sizeStyles.icon,
                        glowEffect && !prefersReducedMotion && 'drop-shadow-md'
                    )}
                >
                    <img
                        src={imageSrc}
                        alt={label}
                        className='h-full w-full object-contain'
                        loading='eager'
                        decoding='async'
                    />

                    {withParticles && !prefersReducedMotion && (
                        <div className='pointer-events-none absolute inset-0'>
                            {particles.map((p) => (
                                <span
                                    key={`${uniqueId}-p-${p.id}`}
                                    className='akm-logo__particle absolute rounded-full bg-yellow-400/60'
                                    style={{
                                        left: `${p.left}%`,
                                        top: `${p.top}%`,
                                        width: `${p.size}px`,
                                        height: `${p.size}px`,
                                        animation: `akmLogoParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {withText && (
                <span className={cx('ml-2 font-extrabold leading-none', variantStyles.base)}>{label}</span>
            )}
        </div>
    );
};
