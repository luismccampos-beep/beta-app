import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useTranslations } from 'next-intl';
import { LucideProps, MapPin, Phone, Mail, Clock } from 'lucide-react';
const iconMap = {
    MapPin,
    Phone,
    Mail,
    Clock,
};
const ContactInfoItemComponent = ({ item }) => {
    const Icon = iconMap[item.icon];
    const isExternalLink = item.link?.startsWith('http');
    return (_jsxs("div", { className: 'flex items-start space-x-4', children: [_jsx("div", { className: 'flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100', children: _jsx(Icon, { className: 'h-6 w-6 text-blue-600' }) }), _jsxs("div", { children: [_jsx("h3", { className: 'font-semibold text-gray-900', children: item.title }), item.link ? (_jsx("a", { href: item.link, className: 'text-gray-600 hover:text-blue-600 transition-colors', target: isExternalLink ? '_blank' : undefined, rel: isExternalLink ? 'noopener noreferrer' : undefined, children: item.content })) : (_jsx("p", { className: 'text-gray-600', children: item.content }))] })] }));
};
const ContactInfo = ({ contactInfo }) => {
    const t = useTranslations();
    return (_jsxs("div", { className: 'rounded-lg bg-white p-8 shadow-lg', children: [_jsxs("div", { className: 'mb-6', children: [_jsx("h2", { className: 'mb-2 text-2xl font-bold text-gray-900', children: t('contact.info.title') || 'Contact' }), _jsx("p", { className: 'text-gray-600', children: t('contact.info.subtitle') || '' })] }), _jsx("div", { className: 'space-y-6', children: contactInfo.map((item, index) => (_jsx(ContactInfoItemComponent, { item: item }, index))) })] }));
};
export { ContactInfo };
export default ContactInfo;
//# sourceMappingURL=ContactInfo.js.map