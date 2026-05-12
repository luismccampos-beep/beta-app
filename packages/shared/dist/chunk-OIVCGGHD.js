import {
  resources
} from "./chunk-SFNFDB4Q.js";
import {
  getEnv
} from "./chunk-QYGYBXGO.js";

// src/lib/i18n/index.ts
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
var DEFAULT_LANGUAGE = "en";
var DEFAULT_NS = "common";
function getNamespaces() {
  const resourceMap = new Map(Object.entries(resources));
  const languageResource = resourceMap.get(DEFAULT_LANGUAGE);
  if (languageResource && typeof languageResource === "object") {
    return Object.keys(languageResource);
  }
  return [];
}
var namespaces = getNamespaces();
var defaultNS = namespaces.includes(DEFAULT_NS) ? DEFAULT_NS : namespaces[0] ?? false;
i18n.use(LanguageDetector).init({
  resources,
  fallbackLng: DEFAULT_LANGUAGE,
  debug: getEnv("NODE_ENV") === "development",
  interpolation: {
    escapeValue: false
    // React already escapes by default
  },
  ns: namespaces,
  defaultNS
});
var i18n_default = i18n;

export {
  i18n_default
};
//# sourceMappingURL=chunk-OIVCGGHD.js.map