export interface MaintenanceTask {
  id: string;
  name: string;
  description: string;
  type: 'cleanup' | 'optimization' | 'backup' | 'security' | 'update';
  status: 'idle' | 'running' | 'completed' | 'failed' | 'scheduled';
  lastRun?: string;
  nextRun?: string;
  duration?: string;
  autoRun?: boolean;
  priority: 'low' | 'medium' | 'high';
  progress?: number;
}

export interface SystemStatus {
  database: {
    status: 'healthy' | 'warning' | 'critical';
    size: string;
    connections: number;
    responseTime: number;
    queries: number;
  };
  storage: {
    status: 'healthy' | 'warning' | 'critical';
    used: string;
    total: string;
    percentage: number;
    available: string;
  };
  memory: {
    status: 'healthy' | 'warning' | 'critical';
    used: string;
    total: string;
    percentage: number;
    swap: string;
  };
  cache: {
    status: 'healthy' | 'warning' | 'critical';
    hitRate: number;
    size: string;
    entries: number;
  };
  cpu: {
    status: 'healthy' | 'warning' | 'critical';
    usage: number;
    load: string;
    cores: number;
  };
  uptime: string;
  lastBackup: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'success' | 'error' | 'warning' | 'info';
  category: string;
  message: string;
}
