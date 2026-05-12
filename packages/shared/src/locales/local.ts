// Define as traduções por idioma
export const locales = {
  'pt-BR': {
    greeting: 'Olá',
    farewell: 'Adeus',
    welcome: 'Bem-vindo ao nosso aplicativo',
  },
  'en-US': {
    greeting: 'Hello',
    farewell: 'Goodbye',
    welcome: 'Welcome to our application',
  },
  'es-ES': {
    greeting: 'Hola',
    farewell: 'Adiós',
    welcome: 'Bienvenido a nuestra aplicación',
  },
} as const;

// Função helper para obter a tradução de uma chave
export const t = (locale: keyof typeof locales, key: keyof (typeof locales)['pt-BR']) => {
  // eslint-disable-next-line security/detect-object-injection
  return locales[locale][key] || locales['en-US'][key];
};

// Exportar tipos para uso em outros arquivos
export type Locale = keyof typeof locales;
export type LocaleKey = keyof (typeof locales)['pt-BR'];

// Exportar a função t para uso em outros arquivos
// t is already exported above, no need for additional export
