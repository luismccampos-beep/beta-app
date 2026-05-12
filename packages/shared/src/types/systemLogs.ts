export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success' | 'debug';
  category: 'auth' | 'booking' | 'payment' | 'system' | 'security' | 'api';
  message: string;
  userId?: string;
  userName?: string;
  ipAddress?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  details?: Record<string, unknown>;
  userAgent?: string;
}

export interface LogStats {
  total: number;
  error: number;
  warning: number;
  info: number;
  success: number;
  debug: number;
}
