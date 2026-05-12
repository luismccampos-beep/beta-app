import * as React from 'react';
import { cn } from '@akmleva/shared';

import { Button } from './Button';

export interface HeroSectionProps {
  title: string | React.ReactNode;
  subtitle?: string;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  backgroundImage?: string;
  backgroundVideo?: string;
  backgroundGradient?: string;
  textColor?: string;
  subtitleColor?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
  badge?: {
    text: string;
    icon?: React.ReactNode;
  };
  className?: string;
  children?: React.ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  backgroundImage,
  backgroundVideo,
  backgroundGradient = 'from-blue-600 via-purple-600 to-pink-600',
  textColor = 'text-white',
  subtitleColor = 'text-blue-100',
  stats,
  badge,
  className,
  children,
}) => {
  const backgroundStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  return (
    <section
      className={cn(
        'relative py-20 md:py-32 overflow-hidden',
        backgroundImage ? 'bg-cover bg-center' : `bg-gradient-to-br ${backgroundGradient}`,
        className
      )}
      style={backgroundStyle}
    >
      {backgroundVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}

      <div className="absolute inset-0 bg-black/20" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {badge && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              {badge.icon}
              <span className="text-white font-medium">{badge.text}</span>
            </div>
          )}

          <h1 className={cn("display-1 mb-6", textColor)}>
            {typeof title === 'string' ? (
              title.split('\n').map((line: string, index: number) => (
                <React.Fragment key={index}>
                  {line}
                  {index < title.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))
            ) : (
              title
            )}
          </h1>

          {subtitle && (
            <p className={cn("text-xl mb-10 max-w-3xl mx-auto leading-relaxed opacity-80 font-medium", subtitleColor)}>
              {subtitle}
            </p>
          )}

          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {primaryAction && (
                <Button
                  size="lg"
                  className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  onClick={primaryAction.onClick}
                  asChild={!!primaryAction.href}
                >
                  {primaryAction.href ? (
                    <a href={primaryAction.href}>{primaryAction.label}</a>
                  ) : (
                    primaryAction.label
                  )}
                </Button>
              )}
              {secondaryAction && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 backdrop-blur-sm"
                  onClick={secondaryAction.onClick}
                  asChild={!!secondaryAction.href}
                >
                  {secondaryAction.href ? (
                    <a href={secondaryAction.href}>{secondaryAction.label}</a>
                  ) : (
                    secondaryAction.label
                  )}
                </Button>
              )}
            </div>
          )}

          {stats && stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-white/10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 tracking-tight group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-xs uppercase tracking-[0.2em] font-medium font-outfit">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {children}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
