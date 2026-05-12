export interface SystemPaymentMethod {
  id: string;
  name: string;
  nameLocalized?: Record<string, string>;
  description?: string;
  descriptionLocalized?: Record<string, string>;
  type: string;
  provider: string;
  iconName?: string;
  logoUrl?: string;
  status: string;
  fees: {
    percentage: number;
    fixed: number;
  };
  countriesAvailable: string[];
  currenciesAccepted: string[];
  isOnline: boolean;
  isInstant: boolean;
  requiresSetup: boolean;
  setupUrl?: string;
  documentationUrl?: string;
  config?: Record<string, unknown>;
  limits?: Record<string, unknown>;
  processingTime?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  priority: number;
  isDefault: boolean;
  isTestMode: boolean;
  createdAt: string;
  updatedAt: string;
  lastUpdated: string;
}
