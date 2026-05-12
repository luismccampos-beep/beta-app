export interface AIAuthenticationState {
    isAuthenticated: boolean;
    userId?: string;
}
export declare function useAIAuthentication(): AIAuthenticationState;
