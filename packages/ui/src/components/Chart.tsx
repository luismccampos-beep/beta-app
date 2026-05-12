import * as React from "react"

import { cn } from "../utils/cn"

const Chart = () => null

const Bar = () => null

const BarChart = () => null

const Line = () => null

const LineChart = () => null

const ResponsiveContainer = () => null

const XAxis = () => null

const YAxis = () => null

const _ChartTooltipInternal = () => null

const Legend = () => null


export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: unknown
}

const ChartContainer = ({ children, className, config: _config, ...props }: ChartContainerProps) => (
  <div className={cn("chart-container", className)} {...props}>
    {children}
  </div>
)

const ChartLegend = ({ content, className }: { content?: React.ReactNode, className?: string }) => (
  <div className={cn("chart-legend", className)}>{content}</div>
)

const ChartLegendContent = () => null

const ChartTooltip = ({ content, cursor: _cursor, className }: { content?: React.ReactNode, cursor?: boolean, className?: string }) => (
  <div className={cn("chart-tooltip", className)}>{content}</div>
)

const ChartTooltipContent = ({
  indicator: _indicator,
  labelKey: _labelKey,
  nameKey: _nameKey,
}: {
  indicator?: string
  labelKey?: string
  nameKey?: string
}) => null

export {
  Chart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
}
