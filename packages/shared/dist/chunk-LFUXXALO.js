// src/components/LanguageSwitcher.tsx
import { motion } from "framer-motion";
import { Check, Globe, Languages } from "lucide-react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { jsx, jsxs } from "react/jsx-runtime";
var LanguageSwitcherSize = /* @__PURE__ */ ((LanguageSwitcherSize2) => {
  LanguageSwitcherSize2["SMALL"] = "small";
  LanguageSwitcherSize2["MEDIUM"] = "medium";
  LanguageSwitcherSize2["LARGE"] = "large";
  return LanguageSwitcherSize2;
})(LanguageSwitcherSize || {});
var LanguageSwitcherVariant = /* @__PURE__ */ ((LanguageSwitcherVariant2) => {
  LanguageSwitcherVariant2["GHOST"] = "ghost";
  return LanguageSwitcherVariant2;
})(LanguageSwitcherVariant || {});
var getSupportedLanguages = () => {
  return [
    { code: "pt", name: "Portugu\xEAs", flag: "\u{1F1F5}\u{1F1F9}" },
    { code: "en", name: "English", flag: "\u{1F1FA}\u{1F1F8}" },
    { code: "es", name: "Espa\xF1ol", flag: "\u{1F1EA}\u{1F1F8}" },
    { code: "fr", name: "Fran\xE7ais", flag: "\u{1F1EB}\u{1F1F7}" }
  ];
};
var getButtonSize = (size) => {
  switch (size) {
    case "small" /* SMALL */:
      return "sm";
    case "large" /* LARGE */:
      return "lg";
    default:
      return "default";
  }
};
var getIconSize = (size) => {
  switch (size) {
    case "small" /* SMALL */:
      return "h-4 w-4";
    case "large" /* LARGE */:
      return "h-6 w-6";
    default:
      return "h-5 w-5";
  }
};
var LanguageSwitcher = ({
  size = "medium" /* MEDIUM */,
  showLabel = true,
  variant = "ghost" /* GHOST */,
  className = "",
  useGlobeIcon = true,
  onLanguageChange,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
}) => {
  const t = useTranslations("language");
  const locale = useLocale();
  const [isChanging, setIsChanging] = useState(false);
  const supportedLanguages = getSupportedLanguages();
  const currentLanguage = supportedLanguages.find((lang) => lang.code === locale) || supportedLanguages[0];
  const handleLanguageChange = async (languageCode) => {
    if (languageCode === locale || isChanging) return;
    setIsChanging(true);
    try {
      document.cookie = `NEXT_LOCALE=${languageCode}; path=/; max-age=${60 * 60 * 24 * 365}`;
      const globalObj = globalThis;
      globalObj.localStorage?.setItem?.("preferred-language", languageCode);
      onLanguageChange?.(languageCode);
      globalThis.location?.reload?.();
    } catch (error) {
      console.error("Error changing language:", error);
    } finally {
      setIsChanging(false);
    }
  };
  const Icon = useGlobeIcon ? Globe : Languages;
  if (!Button || !DropdownMenu || !DropdownMenuContent || !DropdownMenuItem || !DropdownMenuTrigger) {
    return /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 ${className}`, children: [
      /* @__PURE__ */ jsx(Icon, { className: getIconSize(size) }),
      showLabel && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-sm font-medium", children: [
        /* @__PURE__ */ jsx("span", { children: currentLanguage.flag }),
        /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: currentLanguage.code.toUpperCase() })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant,
        size: getButtonSize(size),
        className: `flex items-center gap-2 transition-all hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-primary/40 rounded-lg bg-gradient-to-br from-white/30 via-white/10 to-white/5 backdrop-blur-sm ${className}`,
        disabled: isChanging,
        "aria-label": t("select") || "Select language",
        children: [
          /* @__PURE__ */ jsx(Icon, { className: getIconSize(size) }),
          showLabel && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-sm font-medium", children: [
            /* @__PURE__ */ jsx("span", { children: currentLanguage.flag }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: currentLanguage.code.toUpperCase() })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", sideOffset: 6, children: /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: -12, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -12, scale: 0.95 },
        transition: { duration: 0.25, ease: "easeOut" },
        className: "bg-gradient-to-tr from-white/30 via-white/10 to-white/5 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden",
        children: supportedLanguages.map((language) => {
          const isActive = currentLanguage.code === language.code;
          return /* @__PURE__ */ jsx(
            DropdownMenuItem,
            {
              onClick: () => handleLanguageChange(language.code),
              disabled: isChanging,
              "aria-checked": isActive,
              className: "p-0",
              children: /* @__PURE__ */ jsxs(
                motion.div,
                {
                  whileHover: { scale: 1.03, background: "rgba(255,255,255,0.05)" },
                  whileTap: { scale: 0.97 },
                  className: `flex items-center justify-between gap-3 px-4 py-2 cursor-pointer transition-all rounded-lg ${isActive ? "bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 shadow-md font-semibold text-primary" : "hover:bg-white/10 text-foreground/90"}`,
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-xl", children: language.flag }),
                      /* @__PURE__ */ jsx("span", { children: language.name })
                    ] }),
                    isActive && /* @__PURE__ */ jsx(Check, { className: "h-5 w-5 text-primary" })
                  ]
                }
              )
            },
            language.code
          );
        })
      }
    ) })
  ] });
};
var LanguageSwitcher_default = LanguageSwitcher;

export {
  LanguageSwitcherSize,
  LanguageSwitcherVariant,
  LanguageSwitcher_default
};
//# sourceMappingURL=chunk-LFUXXALO.js.map