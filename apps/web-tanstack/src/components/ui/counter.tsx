'use client';

import * as React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'framer-motion';

interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function Counter({
  end,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 2,
  className = '',
}: CounterProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <span ref={ref} className={className}>
      {isInView ? (
        <CountUp
          end={end}
          suffix={suffix}
          prefix={prefix}
          decimals={decimals}
          duration={duration}
          useEasing={true}
        />
      ) : (
        <span className="invisible" aria-hidden="true">{prefix}{end}{suffix}</span>
      )}
    </span>
  );
}
