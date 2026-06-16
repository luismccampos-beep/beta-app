import {
  getEnv
} from "./chunk-QYGYBXGO.js";

// src/services/auth-service/index.ts
var AuthService = class {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || getEnv("NEXT_PUBLIC_API_URL") || "http://localhost:3001/api";
  }
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    };
    const token = this.getStoredToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        throw {
          message,
          code: errorData.code || "API_ERROR",
          status: response.status,
          ...errorData
        };
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw {
          message: "Network error. Please check your connection.",
          code: "NETWORK_ERROR",
          status: 0
        };
      }
      throw error;
    }
  }
  async login(credentials) {
    return this.makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });
  }
  async register(userData) {
    return this.makeRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData)
    });
  }
  async logout() {
    try {
      await this.makeRequest("/auth/logout", {
        method: "POST"
      });
    } catch (error) {
      console.warn("Server logout failed:", error);
    } finally {
      this.clearStoredAuthData();
    }
  }
  async refreshAccessToken(refreshToken) {
    const response = await this.makeRequest(
      "/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken })
      }
    );
    this.setStoredToken(response.accessToken);
    return response.accessToken;
  }
  async validateToken(token) {
    try {
      await this.makeRequest("/auth/validate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return true;
    } catch {
      return false;
    }
  }
  async getCurrentUser() {
    return this.makeRequest("/auth/me");
  }
  async updateProfile(updates) {
    return this.makeRequest("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(updates)
    });
  }
  async changePassword(data) {
    await this.makeRequest("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
  async resetPassword(data) {
    await this.makeRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
  async confirmResetPassword(data) {
    await this.makeRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
  async verifyEmail(token) {
    await this.makeRequest("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token })
    });
  }
  async deleteAccount(password) {
    await this.makeRequest("/auth/account", {
      method: "DELETE",
      body: password ? JSON.stringify({ password }) : null
    });
    this.clearStoredAuthData();
  }
  async checkSession() {
    try {
      await this.makeRequest("/auth/session");
      return true;
    } catch {
      return false;
    }
  }
  getStoredToken() {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem("auth_access_token");
    } catch {
      return null;
    }
  }
  setStoredToken(token) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("auth_access_token", token);
    } catch {
    }
  }
  clearStoredAuthData() {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem("auth_access_token");
      localStorage.removeItem("auth_refresh_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_expires_at");
    } catch {
    }
  }
  persistAuthData(response) {
    if (response.token) {
      this.setStoredToken(response.token);
    }
    if (response.refreshToken && typeof window !== "undefined") {
      try {
        localStorage.setItem("auth_refresh_token", response.refreshToken);
      } catch {
      }
    }
    if (response.user && typeof window !== "undefined") {
      try {
        localStorage.setItem("auth_user", JSON.stringify(response.user));
      } catch {
      }
    }
    if (response.expiresIn && typeof window !== "undefined") {
      try {
        const expiresAt = Date.now() + response.expiresIn * 1e3;
        localStorage.setItem("auth_expires_at", expiresAt.toString());
      } catch {
      }
    }
  }
  getStoredUser() {
    if (typeof window === "undefined") return null;
    try {
      const userStr = localStorage.getItem("auth_user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
  getStoredRefreshToken() {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem("auth_refresh_token");
    } catch {
      return null;
    }
  }
  isTokenExpired() {
    if (typeof window === "undefined") return true;
    try {
      const expiresAt = localStorage.getItem("auth_expires_at");
      return expiresAt ? Date.now() > parseInt(expiresAt, 10) : true;
    } catch {
      return true;
    }
  }
};
var authService = new AuthService();

export {
  AuthService,
  authService
};
//# sourceMappingURL=chunk-UEBHG4PZ.js.map