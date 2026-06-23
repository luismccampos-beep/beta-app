import {getRequestConfig} from 'next-intl/server';

const SUPPORTED_LOCALES = ['pt', 'en', 'es', 'fr'] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function isSupportedLocale(value: unknown): value is SupportedLocale {
  return (
    typeof value === 'string' &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  );
}

export default getRequestConfig(async ({requestLocale}) => {
  const candidate = await requestLocale;
  const locale: SupportedLocale = isSupportedLocale(candidate) ? candidate : 'pt';

  return {
    locale,
    // One JSON file per locale.
    messages: (await import(`./messages/${locale}.json`)).default,
    onError: (error: any) => {
      if (error?.code === 'MISSING_MESSAGE') return;
      throw error;
    },
  };
});
