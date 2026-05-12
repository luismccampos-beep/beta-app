import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { resources } from '../../locales';
import { getEnv } from '../../utils/env';
const DEFAULT_LANGUAGE = 'en';
const DEFAULT_NS = 'common';
/**
 * Extract namespace keys safely from the default language resource.
 * Uses Map to avoid direct bracket-notation access and
 * the `security/detect-object-injection` ESLint warning.
 */
function getNamespaces() {
    const resourceMap = new Map(Object.entries(resources));
    const languageResource = resourceMap.get(DEFAULT_LANGUAGE);
    if (languageResource && typeof languageResource === 'object') {
        return Object.keys(languageResource);
    }
    return [];
}
const namespaces = getNamespaces();
const defaultNS = namespaces.includes(DEFAULT_NS)
    ? DEFAULT_NS
    : namespaces[0] ?? false;
i18n
    .use(LanguageDetector)
    .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    debug: getEnv('NODE_ENV') === 'development',
    interpolation: {
        escapeValue: false, // React already escapes by default
    },
    ns: namespaces,
    defaultNS,
});
export default i18n;
//# sourceMappingURL=index.js.map