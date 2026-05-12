export declare const locales: {
    readonly 'pt-BR': {
        readonly greeting: "Olá";
        readonly farewell: "Adeus";
        readonly welcome: "Bem-vindo ao nosso aplicativo";
    };
    readonly 'en-US': {
        readonly greeting: "Hello";
        readonly farewell: "Goodbye";
        readonly welcome: "Welcome to our application";
    };
    readonly 'es-ES': {
        readonly greeting: "Hola";
        readonly farewell: "Adiós";
        readonly welcome: "Bienvenido a nuestra aplicación";
    };
};
export declare const t: (locale: keyof typeof locales, key: keyof (typeof locales)["pt-BR"]) => "Olá" | "Adeus" | "Bem-vindo ao nosso aplicativo" | "Hello" | "Goodbye" | "Welcome to our application" | "Hola" | "Adiós" | "Bienvenido a nuestra aplicación";
export type Locale = keyof typeof locales;
export type LocaleKey = keyof (typeof locales)['pt-BR'];
