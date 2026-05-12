import * as React from "react";
declare const Chart: () => null;
declare const Bar: () => null;
declare const BarChart: () => null;
declare const Line: () => null;
declare const LineChart: () => null;
declare const ResponsiveContainer: () => null;
declare const XAxis: () => null;
declare const YAxis: () => null;
declare const Legend: () => null;
export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    config?: unknown;
}
declare const ChartContainer: ({ children, className, config: _config, ...props }: ChartContainerProps) => import("react/jsx-runtime").JSX.Element;
declare const ChartLegend: ({ content, className }: {
    content?: React.ReactNode;
    className?: string;
}) => import("react/jsx-runtime").JSX.Element;
declare const ChartLegendContent: () => null;
declare const ChartTooltip: ({ content, cursor: _cursor, className }: {
    content?: React.ReactNode;
    cursor?: boolean;
    className?: string;
}) => import("react/jsx-runtime").JSX.Element;
declare const ChartTooltipContent: ({ indicator: _indicator, labelKey: _labelKey, nameKey: _nameKey, }: {
    indicator?: string;
    labelKey?: string;
    nameKey?: string;
}) => null;
export { Chart, Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Legend, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, };
