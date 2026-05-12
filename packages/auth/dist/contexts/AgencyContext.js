'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { DEFAULT_FEATURES } from '../types/agency';
const DEFAULT_FEATURES_MAP = new Map(Object.entries(DEFAULT_FEATURES));
const initialState = {
    agency: null,
    isLoading: false,
    isInitialized: false,
    error: null,
    domain: null,
    isSubdomain: false,
    isCustomDomain: false,
};
function agencyReducer(state, action) {
    switch (action.type) {
        case 'SET_AGENCY':
            return {
                ...state,
                agency: action.payload,
                error: null,
                isLoading: false,
            };
        case 'CLEAR_AGENCY':
            return {
                ...state,
                agency: null,
                error: null,
                isLoading: false,
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };
        case 'SET_INITIALIZED':
            return {
                ...state,
                isInitialized: action.payload,
            };
        case 'UPDATE_SETTINGS':
            return {
                ...state,
                agency: state.agency
                    ? { ...state.agency, settings: { ...state.agency.settings, ...action.payload } }
                    : null,
            };
        case 'SET_DOMAIN_INFO':
            return {
                ...state,
                domain: action.payload.domain,
                isSubdomain: action.payload.isSubdomain,
                isCustomDomain: action.payload.isCustomDomain,
            };
        default:
            return state;
    }
}
// ==========================================================================
// Agency Context
// ==========================================================================
const AgencyContext = createContext(null);
// ==========================================================================
// Utility Functions
// ==========================================================================
function extractDomainFromHostname(hostname) {
    // Remove www. prefix if present
    const cleanHostname = hostname.replace(/^www\./, '');
    // Extract domain parts
    const parts = cleanHostname.split('.');
    if (parts.length < 2) {
        return { domain: null, isSubdomain: false, isCustomDomain: false };
    }
    // Get TLD and SLD
    const tld = parts[parts.length - 1];
    const sld = parts[parts.length - 2];
    const baseDomain = `${sld}.${tld}`;
    // Check if it's a subdomain (more than 2 parts)
    const isSubdomain = parts.length > 2;
    // Check if it's a custom domain (not our main domain)
    const mainDomains = ['akmleva.com', 'crm.akmleva.com', 'localhost'];
    const isCustomDomain = !mainDomains.includes(baseDomain) && !mainDomains.includes(cleanHostname);
    // For subdomains, extract the subdomain part
    const domain = isSubdomain ? parts[0] : cleanHostname;
    return { domain, isSubdomain, isCustomDomain };
}
function generateAgencyTheme(agency) {
    const cssVariables = {
        '--agency-primary': agency.primaryColor,
        '--agency-secondary': agency.secondaryColor,
        '--agency-accent': agency.accentColor,
        '--agency-primary-rgb': hexToRgb(agency.primaryColor),
        '--agency-secondary-rgb': hexToRgb(agency.secondaryColor),
        '--agency-accent-rgb': hexToRgb(agency.accentColor),
    };
    return {
        primaryColor: agency.primaryColor,
        secondaryColor: agency.secondaryColor,
        accentColor: agency.accentColor,
        logoUrl: agency.logoUrl,
        cssVariables,
    };
}
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '0, 0, 0';
}
function checkFeatureAvailability(feature, agency) {
    // Check if feature is in agency's feature list
    if (agency.features.includes(feature)) {
        return true;
    }
    // Check default features for the agency's plan
    const defaultFeature = DEFAULT_FEATURES_MAP.get(feature) ?? null;
    if (!defaultFeature) {
        return false;
    }
    if (!defaultFeature.plans) {
        return defaultFeature.enabled;
    }
    return defaultFeature.plans.includes(agency.plan);
}
// ==========================================================================
// Agency Provider
// ==========================================================================
export function AgencyProvider({ children, domain, autoDetect = true, onAgencyChange }) {
    const [state, dispatch] = useReducer(agencyReducer, initialState);
    // ==========================================================================
    // Actions
    // ==========================================================================
    const setAgency = useCallback((agency) => {
        dispatch({ type: 'SET_AGENCY', payload: agency });
        onAgencyChange?.(agency);
        // Apply theme to CSS variables
        const theme = generateAgencyTheme(agency);
        Object.entries(theme.cssVariables).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
    }, [onAgencyChange]);
    const clearAgency = useCallback(() => {
        dispatch({ type: 'CLEAR_AGENCY' });
        onAgencyChange?.(null);
        // Remove custom CSS variables
        Object.keys(getComputedStyle(document.documentElement)).forEach((key) => {
            if (key.startsWith('--agency-')) {
                document.documentElement.style.removeProperty(key);
            }
        });
    }, [onAgencyChange]);
    const updateAgencySettings = useCallback((settings) => {
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    }, []);
    const hasFeature = useCallback((feature) => {
        if (!state.agency)
            return false;
        return checkFeatureAvailability(feature, state.agency);
    }, [state.agency]);
    const canAddUsers = useCallback((currentCount) => {
        if (!state.agency)
            return false;
        return currentCount < state.agency.maxUsers;
    }, [state.agency]);
    const canAddClients = useCallback((currentCount) => {
        if (!state.agency)
            return false;
        return currentCount < state.agency.maxClients;
    }, [state.agency]);
    const getTheme = useCallback(() => {
        if (!state.agency) {
            return {
                primaryColor: '#3B82F6',
                secondaryColor: '#10B981',
                accentColor: '#F59E0B',
                cssVariables: {
                    '--agency-primary': '#3B82F6',
                    '--agency-secondary': '#10B981',
                    '--agency-accent': '#F59E0B',
                    '--agency-primary-rgb': '59, 130, 246',
                    '--agency-secondary-rgb': '16, 185, 129',
                    '--agency-accent-rgb': '245, 158, 11',
                },
            };
        }
        return generateAgencyTheme(state.agency);
    }, [state.agency]);
    const refreshAgency = useCallback(async () => {
        if (!state.agency)
            return;
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            // This would be an API call in a real implementation
            // const response = await fetch(`/api/agencies/${state.agency.id}`);
            // const updatedAgency = await response.json();
            // setAgency(updatedAgency);
        }
        catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to refresh agency' });
        }
    }, [state.agency, setAgency]);
    // ==========================================================================
    // Effects
    // ==========================================================================
    // Detect domain on mount
    useEffect(() => {
        if (autoDetect || domain) {
            const targetDomain = domain || (typeof window !== 'undefined' ? window.location.hostname : '');
            const domainInfo = extractDomainFromHostname(targetDomain);
            dispatch({ type: 'SET_DOMAIN_INFO', payload: domainInfo });
        }
        dispatch({ type: 'SET_INITIALIZED', payload: true });
    }, [autoDetect, domain]);
    // Load agency based on domain
    useEffect(() => {
        if (!state.isInitialized || !state.domain)
            return;
        const loadAgency = async () => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                // Try to load agency by slug (subdomain) or domain (custom domain)
                let agencyEndpoint = '';
                if (state.isSubdomain) {
                    agencyEndpoint = `/api/agencies/by-slug/${state.domain}`;
                }
                else if (state.isCustomDomain) {
                    agencyEndpoint = `/api/agencies/by-domain/${state.domain}`;
                }
                if (agencyEndpoint) {
                    // This would be an actual API call in a real implementation
                    // const response = await fetch(agencyEndpoint);
                    // if (response.ok) {
                    //   const agency = await response.json();
                    //   setAgency(agency);
                    //   return;
                    // }
                }
                // Fallback to default agency or no agency
                clearAgency();
            }
            catch (error) {
                dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load agency' });
            }
        };
        loadAgency();
    }, [state.isInitialized, state.domain, state.isSubdomain, state.isCustomDomain, setAgency, clearAgency]);
    // ==========================================================================
    // Context Value
    // ==========================================================================
    const contextValue = {
        // State
        agency: state.agency,
        isLoading: state.isLoading,
        isInitialized: state.isInitialized,
        error: state.error,
        domain: state.domain,
        isSubdomain: state.isSubdomain,
        isCustomDomain: state.isCustomDomain,
        // Operations
        setAgency,
        clearAgency,
        updateAgencySettings,
        hasFeature,
        canAddUsers,
        canAddClients,
        getTheme,
        refreshAgency,
    };
    return (_jsx(AgencyContext.Provider, { value: contextValue, children: children }));
}
// ==========================================================================
// Hook
// ==========================================================================
export function useAgency() {
    const context = useContext(AgencyContext);
    if (!context) {
        throw new Error('useAgency must be used within an AgencyProvider');
    }
    return context;
}
// ==========================================================================
// Utility Hooks
// ==========================================================================
export function useAgencyFeature(feature) {
    const { hasFeature } = useAgency();
    return hasFeature(feature);
}
export function useAgencyTheme() {
    const { getTheme } = useAgency();
    return getTheme();
}
export function useAgencyLimits() {
    const { canAddUsers, canAddClients, agency } = useAgency();
    return {
        canAddUsers,
        canAddClients,
        maxUsers: agency?.maxUsers || 5,
        maxClients: agency?.maxClients || 100,
        plan: agency?.plan || 'STARTER',
    };
}
//# sourceMappingURL=AgencyContext.js.map