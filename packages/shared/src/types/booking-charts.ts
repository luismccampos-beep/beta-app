// Booking chart types shared across frontend and backend
// Based on frontend/src/types/booking-charts.ts

/**
 * Time range options for filtering booking data
 */
export type TimeRangeType = '7d' | '30d' | '90d' | '6m' | '1y' | 'custom';

export interface TimeRange {
  start: string;
  end: string;
  type?: TimeRangeType;
}

/**
 * Data point for time-series charts
 */
export interface BookingDataPoint {
  date: string; // ISO date string (YYYY-MM-DD)
  revenue: number;
  count: number;
  averageBookingValue?: number;
  cancellations?: number;
  refunds?: number;
}

/**
 * Category breakdown for bookings
 */
export interface BookingCategoryData {
  [category: string]: {
    count: number;
    revenue: number;
    percentage: number;
  };
}

/**
 * Top destination data
 */
export interface DestinationData {
  name: string;
  count: number;
  revenue: number;
  percentage: number;
  averageStay?: number; // days
  repeatCustomers?: number;
}

/**
 * Customer segment data
 */
export interface CustomerSegmentData {
  segment: 'new' | 'returning' | 'vip';
  count: number;
  revenue: number;
  percentage: number;
  averageBookingValue: number;
}

/**
 * Booking status breakdown
 */
export interface BookingStatusData {
  confirmed: number;
  pending: number;
  cancelled: number;
  completed: number;
  refunded: number;
}

/**
 * Revenue metrics
 */
export interface RevenueMetrics {
  total: number;
  average: number;
  median: number;
  growth: number; // percentage change from previous period
  projectedMonthly?: number;
}

/**
 * Booking performance metrics
 */
export interface BookingMetrics {
  totalBookings: number;
  conversionRate: number; // percentage
  averageBookingValue: number;
  customerLifetimeValue: number;
  bookingGrowth: number; // percentage change
  cancelationRate: number; // percentage
  refundRate: number; // percentage
}

/**
 * Comprehensive booking chart data structure
 */
export interface BookingChartData {
  // Summary metrics
  totalBookings: number;
  totalRevenue: number;
  metrics: BookingMetrics;
  revenueMetrics: RevenueMetrics;

  // Time series data
  byDate: BookingDataPoint[];

  // Category breakdown
  byCategory: BookingCategoryData;

  // Geographic data
  topDestinations: DestinationData[];

  // Customer insights
  customerSegments: CustomerSegmentData[];

  // Status breakdown
  bookingStatus: BookingStatusData;

  // Additional analytics
  hourlyDistribution?: Array<{
    hour: number; // 0-23
    count: number;
    revenue: number;
  }>;

  weeklyDistribution?: Array<{
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    dayName: string;
    count: number;
    revenue: number;
  }>;

  monthlyTrends?: Array<{
    month: string; // YYYY-MM
    count: number;
    revenue: number;
    growth: number;
  }>;
}

/**
 * Chart configuration options
 */
export interface ChartConfig {
  showRevenue?: boolean;
  showCount?: boolean;
  showTrends?: boolean;
  groupBy?: 'day' | 'week' | 'month' | 'quarter';
  currency?: string;
  locale?: string;
  colors?: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
  };
}

/**
 * Filter options for booking data
 */
export interface BookingFilters {
  timeRange: TimeRange;
  destinations?: string[];
  categories?: string[];
  customerSegments?: CustomerSegmentData['segment'][];
  minRevenue?: number;
  maxRevenue?: number;
  status?: (keyof BookingStatusData)[];
  userId?: number;
}

/**
 * Props for booking charts components
 */
export interface BookingChartsProps {
  timeRange: TimeRange;
  filters?: Partial<BookingFilters>;
  config?: ChartConfig;
  onTimeRangeChange?: (timeRange: TimeRange) => void;
  onFiltersChange?: (filters: BookingFilters) => void;
  loading?: boolean;
  error?: string | null;
}

/**
 * Individual chart component props
 */
export interface BookingLineChartProps extends Omit<BookingChartsProps, 'filters'> {
  data: BookingDataPoint[];
  showRevenue?: boolean;
  showCount?: boolean;
  height?: number;
}

export interface BookingBarChartProps extends Omit<BookingChartsProps, 'filters'> {
  data: BookingCategoryData;
  orientation?: 'horizontal' | 'vertical';
  height?: number;
}

export interface BookingPieChartProps extends Omit<BookingChartsProps, 'filters'> {
  data: BookingCategoryData | Record<string, number>;
  showLegend?: boolean;
  height?: number;
}

export interface DestinationChartProps extends Omit<BookingChartsProps, 'filters'> {
  data: DestinationData[];
  maxDestinations?: number;
  height?: number;
}

/**
 * Dashboard summary card props
 */
export interface BookingSummaryCardProps {
  title: string;
  value: number | string;
  change?: number; // percentage change
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ComponentType;
  loading?: boolean;
  formatter?: (value: number) => string;
}

/**
 * Booking analytics API response
 */
export interface BookingAnalyticsResponse {
  success: boolean;
  data: BookingChartData;
  metadata: {
    totalRecords: number;
    processedAt: string;
    cacheExpiry?: string;
    queryTime: number; // milliseconds
  };
  error?: string;
}

/**
 * Export options for booking data
 */
export interface BookingExportOptions {
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  timeRange: TimeRange;
  filters?: BookingFilters;
  includeCharts?: boolean;
  includeRawData?: boolean;
}

/**
 * Real-time booking update
 */
export interface BookingUpdate {
  type: 'new_booking' | 'booking_cancelled' | 'booking_completed' | 'payment_received';
  bookingId: string;
  timestamp: Date;
  data: Partial<BookingDataPoint>;
}

/**
 * Comparison data for A/B testing or period comparison
 */
export interface BookingComparison {
  current: BookingChartData;
  previous: BookingChartData;
  comparison: {
    bookings: {
      change: number;
      changeType: 'increase' | 'decrease' | 'neutral';
    };
    revenue: {
      change: number;
      changeType: 'increase' | 'decrease' | 'neutral';
    };
    conversionRate: {
      change: number;
      changeType: 'increase' | 'decrease' | 'neutral';
    };
  };
}

/**
 * Utility type for chart library compatibility
 */
export type ChartDataPoint = {
  x: string | number;
  y: number;
  label?: string;
  color?: string;
};

/**
 * Booking trend analysis
 */
export interface BookingTrendAnalysis {
  trend: 'upward' | 'downward' | 'stable' | 'volatile';
  confidence: number; // 0-1
  seasonality: boolean;
  anomalies: Array<{
    date: string;
    type: 'spike' | 'drop';
    severity: 'low' | 'medium' | 'high';
    possibleCause?: string;
  }>;
  forecast?: Array<{
    date: string;
    predictedBookings: number;
    predictedRevenue: number;
    confidence: number;
  }>;
}

// Re-export original interfaces for backward compatibility
;
;
