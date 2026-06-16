// src/components/LanguageSwitcherNextIntl.tsx
import { Check, Globe, Languages } from "lucide-react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var LanguageSwitcherSize = /* @__PURE__ */ ((LanguageSwitcherSize2) => {
  LanguageSwitcherSize2["SMALL"] = "small";
  LanguageSwitcherSize2["MEDIUM"] = "medium";
  LanguageSwitcherSize2["LARGE"] = "large";
  return LanguageSwitcherSize2;
})(LanguageSwitcherSize || {});
var LanguageSwitcherVariant = /* @__PURE__ */ ((LanguageSwitcherVariant2) => {
  LanguageSwitcherVariant2["DEFAULT"] = "default";
  LanguageSwitcherVariant2["GHOST"] = "ghost";
  LanguageSwitcherVariant2["OUTLINE"] = "outline";
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
  pathname: pathnameProp,
  navigate,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
}) => {
  const [isChanging, setIsChanging] = useState(false);
  const safePathname = pathnameProp ?? (typeof window !== "undefined" ? window.location.pathname : "");
  const supportedLanguages = getSupportedLanguages();
  const getCurrentLanguage = () => {
    const segments = safePathname.split("/").filter(Boolean);
    const langCode = segments[0];
    const currentLang = supportedLanguages.find((lang) => lang.code === langCode);
    return currentLang || supportedLanguages[0];
  };
  const currentLanguage = getCurrentLanguage();
  const handleLanguageChange = async (languageCode) => {
    if (languageCode === currentLanguage.code || isChanging) return;
    setIsChanging(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("preferred-language", languageCode);
      }
      const segments = safePathname.split("/").filter(Boolean);
      if (supportedLanguages.find((lang) => lang.code === segments[0])) {
        segments[0] = languageCode;
      } else {
        segments.unshift(languageCode);
      }
      const newPath = "/" + segments.join("/");
      if (navigate) {
        navigate(newPath);
      } else if (typeof window !== "undefined") {
        window.location.assign(newPath);
      }
      onLanguageChange?.(languageCode);
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
      showLabel && /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: currentLanguage.name })
    ] });
  }
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant,
        size: getButtonSize(size),
        className: `flex items-center gap-2 ${className}`,
        disabled: isChanging,
        children: [
          /* @__PURE__ */ jsx(Icon, { className: getIconSize(size) }),
          showLabel && /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: currentLanguage.name }),
          currentLanguage.flag && /* @__PURE__ */ jsx("span", { children: currentLanguage.flag })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", className: "w-48", children: supportedLanguages.map((language) => /* @__PURE__ */ jsxs(
      DropdownMenuItem,
      {
        onClick: () => handleLanguageChange(language.code),
        className: "flex items-center gap-3 cursor-pointer",
        disabled: isChanging,
        children: [
          /* @__PURE__ */ jsx("span", { children: language.flag }),
          /* @__PURE__ */ jsx("span", { className: "flex-1", children: language.name }),
          language.code === currentLanguage.code && /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-primary" })
        ]
      },
      language.code
    )) })
  ] });
};
var LanguageSwitcherNextIntl_default = LanguageSwitcher;

export {
  LanguageSwitcherSize,
  LanguageSwitcherVariant,
  LanguageSwitcherNextIntl_default
};
//# sourceMappingURL=chunk-ZSGK4AK2.js.map