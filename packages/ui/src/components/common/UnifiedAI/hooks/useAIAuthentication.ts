export interface AIAuthenticationState {
  isAuthenticated: boolean;
  userId?: string;
}

export function useAIAuthentication(): AIAuthenticationState {
  return {
    isAuthenticated: false,
  };
}
