// src/components/ContactInfo.tsx
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var iconMap = {
  MapPin,
  Phone,
  Mail,
  Clock
};
var ContactInfoItemComponent = ({ item }) => {
  const Icon = iconMap[item.icon];
  const isExternalLink = item.link?.startsWith("http");
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100", children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6 text-blue-600" }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: item.title }),
      item.link ? /* @__PURE__ */ jsx(
        "a",
        {
          href: item.link,
          className: "text-gray-600 hover:text-blue-600 transition-colors",
          target: isExternalLink ? "_blank" : void 0,
          rel: isExternalLink ? "noopener noreferrer" : void 0,
          children: item.content
        }
      ) : /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: item.content })
    ] })
  ] });
};
var ContactInfo = ({ contactInfo }) => {
  const t = useTranslations();
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-white p-8 shadow-lg", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-2 text-2xl font-bold text-gray-900", children: t("contact.info.title") || "Contact" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: t("contact.info.subtitle") || "" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-6", children: contactInfo.map((item, index) => /* @__PURE__ */ jsx(ContactInfoItemComponent, { item }, index)) })
  ] });
};
var ContactInfo_default = ContactInfo;

export {
  ContactInfo,
  ContactInfo_default
};
//# sourceMappingURL=chunk-3KDYLPWR.js.map