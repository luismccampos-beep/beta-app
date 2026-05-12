'use client';
import { useCallback } from 'react';
import { useAgency } from '../contexts/AgencyContext';
export function useAgencyApi() {
    const { agency, domain, isSubdomain, isCustomDomain } = useAgency();
    /**
     * Injects agency context into API calls
     * Automatically adds agency_id to requests and handles multi-tenancy
     */
    const createAgencyRequest = useCallback((options = {}, apiOptions = {}) => {
        const { includeAgencyId = true } = apiOptions;
        const headers = new Headers(options.headers);
        // Add agency context to headers
        if (agency && includeAgencyId) {
            headers.set('X-Agency-ID', agency.id);
            headers.set('X-Agency-Slug', agency.slug);
        }
        // Add domain context for white-label detection
        if (domain) {
            headers.set('X-Domain', domain);
            headers.set('X-Is-Subdomain', isSubdomain.toString());
            headers.set('X-Is-Custom-Domain', isCustomDomain.toString());
        }
        // Set content type if not already set
        if (!headers.has('Content-Type') && (options.body || options.method !== 'GET')) {
            headers.set('Content-Type', 'application/json');
        }
        return {
            ...options,
            headers,
        };
    }, [agency, domain, isSubdomain, isCustomDomain]);
    /**
     * Enhanced fetch with agency context
     */
    const fetchWithAgency = useCallback(async (url, options = {}, apiOptions = {}) => {
        const enhancedOptions = createAgencyRequest(options, apiOptions);
        // Add agency_id to URL for GET requests if needed
        let enhancedUrl = url;
        if (agency && apiOptions.includeAgencyId && !url.includes('?')) {
            const separator = url.includes('?') ? '&' : '?';
            enhancedUrl = `${url}${separator}agency_id=${agency.id}`;
        }
        return fetch(enhancedUrl, enhancedOptions);
    }, [createAgencyRequest, agency]);
    /**
     * API methods with automatic agency context injection
     */
    const api = {
        get: useCallback((url, options = {}) => fetchWithAgency(url, { method: 'GET' }, options), [fetchWithAgency]),
        post: useCallback((url, data, options = {}) => fetchWithAgency(url, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }, options), [fetchWithAgency]),
        put: useCallback((url, data, options = {}) => fetchWithAgency(url, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        }, options), [fetchWithAgency]),
        patch: useCallback((url, data, options = {}) => fetchWithAgency(url, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        }, options), [fetchWithAgency]),
        delete: useCallback((url, options = {}) => fetchWithAgency(url, { method: 'DELETE' }, options), [fetchWithAgency]),
    };
    /**
     * Check if current user can perform action based on agency limits
     */
    const canPerformAction = useCallback((action) => {
        if (!agency)
            return false;
        switch (action) {
            case 'create_user':
                // This would check current user count vs agency.maxUsers
                return true; // Placeholder - would need actual user count
            case 'create_client':
                // This would check current client count vs agency.maxClients
                return true; // Placeholder - would need actual client count
            case 'access_feature':
                return true; // This would check specific feature access
            default:
                return false;
        }
    }, [agency]);
    /**
     * Get agency-specific API base URL
     */
    const getApiBaseUrl = useCallback(() => {
        if (isCustomDomain && agency?.domain) {
            // For custom domains, use the same domain
            return `https://${agency.domain}/api`;
        }
        if (isSubdomain && agency?.slug) {
            // For subdomains, use the subdomain
            return `https://${agency.slug}.akmleva.com/api`;
        }
        // Default API URL
        return '/api';
    }, [agency, isCustomDomain, isSubdomain]);
    return {
        agency,
        domain,
        isSubdomain,
        isCustomDomain,
        createAgencyRequest,
        fetchWithAgency,
        api,
        canPerformAction,
        getApiBaseUrl,
    };
}
// ==========================================================================
// Utility Functions
// ==========================================================================
/**
 * Create agency-aware query key for React Query/TanStack Query
 */
export function createAgencyQueryKey(baseKey, agencyId) {
    if (agencyId) {
        return [...baseKey, 'agency', agencyId];
    }
    return baseKey;
}
/**
 * Create agency-aware mutation function
 */
export function createAgencyMutation(mutationFn, agencyId) {
    return async (variables) => {
        return mutationFn(variables, agencyId);
    };
}
//# sourceMappingURL=useAgencyApi.js.map