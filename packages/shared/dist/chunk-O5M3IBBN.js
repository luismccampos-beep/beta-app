// src/components/ContactInfo.tsx
import React from "react";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
var iconMap = {
  MapPin,
  Phone,
  Mail,
  Clock
};
var ContactInfoItemComponent = ({ item }) => {
  const Icon = iconMap[item.icon];
  const isExternalLink = item.link?.startsWith("http");
  return /* @__PURE__ */ React.createElement("div", { className: "flex items-start space-x-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100" }, /* @__PURE__ */ React.createElement(Icon, { className: "h-6 w-6 text-blue-600" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-gray-900" }, item.title), item.link ? /* @__PURE__ */ React.createElement(
    "a",
    {
      href: item.link,
      className: "text-gray-600 hover:text-blue-600 transition-colors",
      target: isExternalLink ? "_blank" : void 0,
      rel: isExternalLink ? "noopener noreferrer" : void 0
    },
    item.content
  ) : /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, item.content)));
};
var ContactInfo = ({ contactInfo }) => {
  const t = useTranslations();
  return /* @__PURE__ */ React.createElement("div", { className: "rounded-lg bg-white p-8 shadow-lg" }, /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement("h2", { className: "mb-2 text-2xl font-bold text-gray-900" }, t("contact.info.title") || "Contact"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, t("contact.info.subtitle") || "")), /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, contactInfo.map((item, index) => /* @__PURE__ */ React.createElement(ContactInfoItemComponent, { key: index, item }))));
};
var ContactInfo_default = ContactInfo;

export {
  ContactInfo,
  ContactInfo_default
};
//# sourceMappingURL=chunk-O5M3IBBN.js.map