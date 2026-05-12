// ==========================================================================
// Multi-Tenancy Agency Types
// ==========================================================================
export const DEFAULT_FEATURES = {
    // Core CRM features
    'crm.clients': {
        name: 'Client Management',
        enabled: true,
        plans: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
    },
    'crm.leads': {
        name: 'Lead Management',
        enabled: true,
        plans: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
    },
    'crm.bookings': {
        name: 'Booking Management',
        enabled: true,
        plans: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
    },
    // Advanced features
    'crm.ai_assistant': {
        name: 'AI Assistant',
        enabled: false,
        plans: ['PROFESSIONAL', 'ENTERPRISE'],
    },
    'crm.advanced_analytics': {
        name: 'Advanced Analytics',
        enabled: false,
        plans: ['PROFESSIONAL', 'ENTERPRISE'],
    },
    'crm.custom_integrations': {
        name: 'Custom Integrations',
        enabled: false,
        plans: ['ENTERPRISE'],
    },
    'crm.white_label': {
        name: 'White Label (Custom Domain)',
        enabled: false,
        plans: ['ENTERPRISE'],
    },
    'crm.api_access': {
        name: 'API Access',
        enabled: false,
        plans: ['PROFESSIONAL', 'ENTERPRISE'],
    },
    'crm.priority_support': {
        name: 'Priority Support',
        enabled: false,
        plans: ['ENTERPRISE'],
    },
    // Content management
    'crm.custom_packages': {
        name: 'Custom Package Creation',
        enabled: false,
        plans: ['PROFESSIONAL', 'ENTERPRISE'],
    },
    'crm.flight_management': {
        name: 'Flight Management',
        enabled: true,
        plans: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
    },
    'crm.hotel_management': {
        name: 'Hotel Management',
        enabled: true,
        plans: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
    },
    'crm.cruise_management': {
        name: 'Cruise Management',
        enabled: true,
        plans: ['PROFESSIONAL', 'ENTERPRISE'],
    },
};
//# sourceMappingURL=agency.js.map