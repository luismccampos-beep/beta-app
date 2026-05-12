import type { AgencyContextType, AgencyProviderProps, AgencyTheme, AgencyPlan } from '../types/agency';
export declare function AgencyProvider({ children, domain, autoDetect, onAgencyChange }: AgencyProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useAgency(): AgencyContextType;
export declare function useAgencyFeature(feature: string): boolean;
export declare function useAgencyTheme(): AgencyTheme;
export declare function useAgencyLimits(): {
    canAddUsers: (currentCount: number) => boolean;
    canAddClients: (currentCount: number) => boolean;
    maxUsers: number;
    maxClients: number;
    plan: AgencyPlan;
};
//# sourceMappingURL=AgencyContext.d.ts.map