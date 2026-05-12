export const SUCCESS_METRICS = {
  codebase: {
    duplicatedCode: { target: 0, baseline: 60, unit: '%' },
    bundleSize: { target: 30, baseline: 45, unit: 'KB' },
    testCoverage: { target: 85, baseline: 45, unit: '%' },
    buildTime: { target: 30, baseline: 45, unit: 'seconds' },
  },
  
  performance: {
    ttfb: { target: 100, baseline: 180, unit: 'ms' },
    tti: { target: 200, baseline: 350, unit: 'ms' },
    fcp: { target: 150, baseline: 250, unit: 'ms' },
    cls: { target: 0.1, baseline: 0.25, unit: 'score' },
  },
  
  quality: {
    errorRate: { target: 0.1, baseline: 0.5, unit: '%' },
    crashFreeRate: { target: 99.9, baseline: 98.5, unit: '%' },
    apiLatency: { target: 100, baseline: 150, unit: 'ms' },
  },
} as const;
