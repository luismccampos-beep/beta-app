export declare const SUCCESS_METRICS: {
    readonly codebase: {
        readonly duplicatedCode: {
            readonly target: 0;
            readonly baseline: 60;
            readonly unit: "%";
        };
        readonly bundleSize: {
            readonly target: 30;
            readonly baseline: 45;
            readonly unit: "KB";
        };
        readonly testCoverage: {
            readonly target: 85;
            readonly baseline: 45;
            readonly unit: "%";
        };
        readonly buildTime: {
            readonly target: 30;
            readonly baseline: 45;
            readonly unit: "seconds";
        };
    };
    readonly performance: {
        readonly ttfb: {
            readonly target: 100;
            readonly baseline: 180;
            readonly unit: "ms";
        };
        readonly tti: {
            readonly target: 200;
            readonly baseline: 350;
            readonly unit: "ms";
        };
        readonly fcp: {
            readonly target: 150;
            readonly baseline: 250;
            readonly unit: "ms";
        };
        readonly cls: {
            readonly target: 0.1;
            readonly baseline: 0.25;
            readonly unit: "score";
        };
    };
    readonly quality: {
        readonly errorRate: {
            readonly target: 0.1;
            readonly baseline: 0.5;
            readonly unit: "%";
        };
        readonly crashFreeRate: {
            readonly target: 99.9;
            readonly baseline: 98.5;
            readonly unit: "%";
        };
        readonly apiLatency: {
            readonly target: 100;
            readonly baseline: 150;
            readonly unit: "ms";
        };
    };
};
