"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
// Main Navbar component
const Navbar = ({ children, className = '', fixed = false, transparent = false, variant, size, sticky = false, links, // eslint-disable-line @typescript-eslint/no-unused-vars
shadow, blurAmount, // eslint-disable-line @typescript-eslint/no-unused-vars
...props }) => {
    const navProps = {
        ...props,
        className: `navbar ${className} ${fixed ? 'navbar-fixed' : ''} ${transparent ? 'navbar-transparent' : ''} ${sticky ? 'navbar-sticky' : ''} ${variant ? `navbar-${variant}` : ''} ${size ? `navbar-${size}` : ''} ${shadow ? `shadow-${shadow}` : ''}`.trim(),
    };
    return (_jsx("nav", { ...navProps, children: children }));
};
const NavbarBrand = ({ children, className = '', href, ...props }) => {
    if (href) {
        return (_jsx("a", { href: href, className: `navbar-brand ${className}`, ...props, children: children }));
    }
    return (_jsx("div", { className: `navbar-brand ${className}`, ...props, children: children }));
};
const NavbarContent = ({ children, className = '', position, ...props }) => {
    return (_jsx("div", { className: `navbar-content ${className}`, "data-position": position, ...props, children: children }));
};
const NavbarItem = ({ children, className = '', href, to, icon, rightIcon, badge, ...props }) => {
    const isLink = href || to;
    const content = (_jsxs(_Fragment, { children: [icon && _jsx("span", { className: "navbar-item-icon", children: icon }), children, rightIcon && _jsx("span", { className: "navbar-item-right-icon", children: rightIcon }), badge && _jsx("span", { className: "navbar-item-badge", children: badge })] }));
    if (isLink) {
        return (_jsx("a", { href: href || to, className: `navbar-item ${className}`, ...props, children: content }));
    }
    return (_jsx("div", { className: `navbar-item ${className}`, ...props, children: content }));
};
const NavbarMenu = ({ children, className = '', ...props }) => {
    return (_jsx("div", { className: `navbar-menu ${className}`, ...props, children: children }));
};
const NavLinkItem = ({ children, className = '', ...props }) => {
    return (_jsx("a", { className: `nav-link-item ${className}`, ...props, children: children }));
};
export { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavLinkItem, };
export default Navbar;
//# sourceMappingURL=Navbar.js.map