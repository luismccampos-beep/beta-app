export declare const APP_NAME = "AKMLEVA";
export declare const API_BASE_URL: string;
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly INTERNAL_SERVER_ERROR: 500;
};
export declare const USER_ROLES: {
    readonly ADMIN: "ADMIN";
    readonly USER: "USER";
    readonly GUEST: "GUEST";
};
export declare const SUPPORTED_LANGUAGES: readonly ["pt-PT", "en-US", "es-ES"];
export declare const LOCALE_KEYS: {
    readonly WELCOME: "welcome";
    readonly LOGIN: "login";
    readonly LOGOUT: "logout";
    readonly DASHBOARD: "dashboard";
};
export declare const APP_ROUTES: {
    readonly HOME: "/";
    readonly LOGIN: "/login";
    readonly DASHBOARD: "/dashboard";
};
