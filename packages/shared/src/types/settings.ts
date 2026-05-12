import { THEME_TYPES } from '../themes/themeTypes';

export interface AppSettings {
  theme: typeof THEME_TYPES.light | typeof THEME_TYPES.dark | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    shareData: boolean;
    cookieConsent: boolean;
  };
}

export interface AppUserPreferences extends AppSettings {
  userId: string;
}

// Admin settings types
export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  defaultLanguage: string;
  timezone: string;
  currency: string;
  maintenanceMode: boolean;
  dateFormat?: string;
  timeFormat?: string;
  paginationSize?: number;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword?: string;
  fromEmail: string;
  fromName: string;
  smtpSecure: boolean;
  replyToEmail?: string;
  signature?: string;
}

export interface AdminSecuritySettings {
  sessionTimeout: number;
  maxLoginAttempts: number;
  requireTwoFactor: boolean;
  passwordMinLength: number;
  enableAuditLog: boolean;
  allowedOrigins: string;
  enableRateLimiting: boolean;
}

export interface NotificationsSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  adminNotifications: boolean;
  bookingNotifications: boolean;
  systemAlerts: boolean;
  weeklyReports: boolean;
}

export interface IntegrationsSettings {
  paymentGateway: string;
  analyticsEnabled: boolean;
  socialLoginEnabled: boolean;
  aiEnabled: boolean;
  stripePublicKey?: string;
  stripeSecretKey?: string;
  googleAnalyticsId?: string;
}

export interface BackupSettings {
  autoBackupEnabled: boolean;
  backupFrequency: string;
  retentionDays: number;
  lastBackup?: string;
}

export interface SettingsData {
  general: GeneralSettings;
  email: EmailSettings;
  security: AdminSecuritySettings;
  notifications: NotificationsSettings;
  integrations: IntegrationsSettings;
  backup: BackupSettings;
}

// Type alias for backwards compatibility
export type UserSettings = SettingsData;
