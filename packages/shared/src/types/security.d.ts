export interface SecurityLog {
    id: string;
    timestamp: string;
    event: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    user?: string;
    ipAddress?: string;
}
export interface SecurityEvent {
    id: string;
    type: 'login_failed' | 'login_success' | 'suspicious_activity' | 'data_access' | 'system_change';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: string;
    ipAddress: string;
    userAgent?: string;
    userId?: string;
    details?: Record<string, unknown>;
}
export interface SecurityMetrics {
    failedLogins: number;
    successfulLogins: number;
    blockedIPs: number;
    activeSessions: number;
    twoFactorEnabled: number;
    passwordExpired: number;
}
export interface SecuritySettings {
    passwordPolicy: {
        minLength: number;
        requireUppercase: boolean;
        requireLowercase: boolean;
        requireNumbers: boolean;
        requireSymbols: boolean;
        maxAge: number;
    };
    sessionSettings: {
        timeout: number;
        maxConcurrent: number;
        requireReauth: boolean;
    };
    twoFactor: {
        enabled: boolean;
        required: boolean;
        backupCodes: boolean;
    };
    ipWhitelist: {
        enabled: boolean;
        addresses: string[];
    };
    rateLimiting: {
        enabled: boolean;
        maxAttempts: number;
        windowMinutes: number;
    };
}
export interface SecurityStats {
    totalIncidents: number;
    resolvedIncidents: number;
    activeThreats: number;
}
