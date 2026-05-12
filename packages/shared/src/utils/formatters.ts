/**
 * Utility functions for formatting data in admin interfaces
 */

// Currency formatting
export const formatCurrency = (
  amount: number,
  currency = 'EUR',
  locale = 'pt-PT'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Number formatting with thousands separator
export const formatNumber = (
  value: number,
  locale = 'pt-PT'
): string => {
  return new Intl.NumberFormat(locale).format(value);
};

// Percentage formatting
export const formatPercentage = (
  value: number,
  decimals = 1,
  locale = 'pt-PT'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

// Date formatting
export const formatDate = (
  date: string | Date,
  locale = 'pt-PT',
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(dateObj);
};

// Time formatting
export const formatTime = (
  date: string | Date,
  locale = 'pt-PT'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

// DateTime formatting
export const formatDateTime = (
  date: string | Date,
  locale = 'pt-PT'
): string => {
  return formatDate(date, locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Duration formatting (in milliseconds to human readable)
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  
  // Ensure array index is within bounds to prevent object injection
  if (i < 0 || i >= sizes.length) {
    return `${size.toFixed(1)} ?`;
  }
  
  // eslint-disable-next-line security/detect-object-injection
  return `${size.toFixed(1)} ${sizes[i]}`;
};

// Truncate text
export const truncateText = (
  text: string,
  maxLength: number,
  suffix = '...'
): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Capitalize first letter
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Convert camelCase to Title Case
export const camelToTitle = (text: string): string => {
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{3})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
  }
  
  return phone;
};

// Format status badges
export const formatStatusBadge = (
  status: string,
  _type: 'default' | 'success' | 'warning' | 'error' | 'info' = 'default'
): { text: string; className: string } => {
  const statusMap: Record<string, { text: string; className: string }> = {
    // Newsletter statuses
    draft: { text: 'Rascunho', className: 'bg-gray-100 text-gray-800' },
    scheduled: { text: 'Agendado', className: 'bg-blue-100 text-blue-800' },
    sending: { text: 'Enviando', className: 'bg-yellow-100 text-yellow-800' },
    sent: { text: 'Enviado', className: 'bg-green-100 text-green-800' },
    failed: { text: 'Falhou', className: 'bg-red-100 text-red-800' },
    archived: { text: 'Arquivado', className: 'bg-gray-100 text-gray-800' },
    cancelled: { text: 'Cancelado', className: 'bg-red-100 text-red-800' },
    
    // Subscriber statuses
    active: { text: 'Ativo', className: 'bg-green-100 text-green-800' },
    pending: { text: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
    unsubscribed: { text: 'Cancelado', className: 'bg-red-100 text-red-800' },
    bounced: { text: 'Rejeitado', className: 'bg-red-100 text-red-800' },
    
    // Generic statuses
    enabled: { text: 'Ativado', className: 'bg-green-100 text-green-800' },
    disabled: { text: 'Desativado', className: 'bg-gray-100 text-gray-800' },
    online: { text: 'Online', className: 'bg-green-100 text-green-800' },
    offline: { text: 'Offline', className: 'bg-gray-100 text-gray-800' },
  };

   
  return statusMap[status.toLowerCase()] || {
    text: capitalize(status),
    className: 'bg-gray-100 text-gray-800'
  };
};

// Format statistical numbers with proper abbreviations
export const formatStatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

// Export all formatters as an object for convenient importing
export const formatters = {
  currency: formatCurrency,
  number: formatNumber,
  percentage: formatPercentage,
  date: formatDate,
  time: formatTime,
  dateTime: formatDateTime,
  duration: formatDuration,
  fileSize: formatFileSize,
  truncateText,
  capitalize,
  camelToTitle,
  phoneNumber: formatPhoneNumber,
  statusBadge: formatStatusBadge,
  statNumber: formatStatNumber,
};
