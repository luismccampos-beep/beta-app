import {
  cn
} from "./chunk-CDRKFMWH.js";

// src/components/auth/DemoButtons.tsx
import React from "react";
import { Button } from "@akmleva/ui";
import { Shield } from "lucide-react";
var DemoButton = ({
  label,
  sublabel,
  icon,
  variant = "full",
  isLoading = false,
  className,
  onClick,
  credentials,
  appUrl,
  emailSelector = 'input[type="email"], input[name="email"], input[id="email"]',
  passwordSelector = 'input[type="password"], input[name="password"], input[id="password"]',
  submitSelector = 'button[type="submit"]',
  ...props
}) => {
  const cleanProps = Object.fromEntries(
    Object.entries(props).filter(([k, v]) => k !== "className" && v !== void 0)
  );
  const { id, ...cleanPropsWithoutId } = cleanProps;
  const handleClick = (e) => {
    if (appUrl && credentials) {
      const url = new URL(appUrl);
      url.searchParams.set("demo_email", credentials.email);
      url.searchParams.set("demo_password", credentials.password);
      window.open(url.toString(), "_blank");
      return;
    }
    if (credentials) {
      const emailInput = document.querySelector(emailSelector);
      const passwordInput = document.querySelector(passwordSelector);
      if (emailInput && passwordInput) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set;
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(emailInput, credentials.email);
          emailInput.dispatchEvent(new Event("input", { bubbles: true }));
          emailInput.dispatchEvent(new Event("change", { bubbles: true }));
          nativeInputValueSetter.call(passwordInput, credentials.password);
          passwordInput.dispatchEvent(new Event("input", { bubbles: true }));
          passwordInput.dispatchEvent(new Event("change", { bubbles: true }));
        }
        setTimeout(() => {
          const submitButton = document.querySelector(submitSelector);
          submitButton?.click();
        }, 100);
        return;
      }
    }
    onClick?.(e);
  };
  if (variant === "compact") {
    return /* @__PURE__ */ React.createElement(
      Button,
      {
        variant: "outline",
        size: "sm",
        onClick: handleClick,
        disabled: isLoading,
        ...cleanPropsWithoutId,
        ...id ? { id } : {},
        className: cn("flex items-center gap-2", className) ?? ""
      },
      icon || /* @__PURE__ */ React.createElement(Shield, { className: "h-4 w-4" }),
      label
    );
  }
  return /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "outline",
      onClick: handleClick,
      disabled: isLoading,
      ...cleanPropsWithoutId,
      ...id ? { id } : {},
      className: cn("flex items-center justify-center gap-2 w-full h-auto py-2", className) ?? ""
    },
    icon || /* @__PURE__ */ React.createElement(Shield, { className: "h-4 w-4" }),
    /* @__PURE__ */ React.createElement("div", { className: "text-left flex flex-col" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium text-sm leading-none" }, label), sublabel && /* @__PURE__ */ React.createElement("span", { className: "text-xs opacity-75 mt-1" }, sublabel))
  );
};
var DemoButtons = ({ variant = "full", onDemoLogin, roles }) => {
  if (roles && roles.length > 0) {
    return /* @__PURE__ */ React.createElement("div", { className: cn("flex flex-col gap-2", variant === "compact" ? "flex-row" : "w-full") }, roles.map((role) => /* @__PURE__ */ React.createElement(
      DemoButton,
      {
        key: role.id,
        label: role.label,
        ...role.sublabel ? { sublabel: role.sublabel } : {},
        variant,
        onClick: () => onDemoLogin?.(role.id)
      }
    )));
  }
  return null;
};

export {
  DemoButton,
  DemoButtons
};
//# sourceMappingURL=chunk-EJSVGHKB.js.map