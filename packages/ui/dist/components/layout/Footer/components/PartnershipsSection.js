import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Building2, Globe, Star, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
export function PartnershipsSection() {
    const t = useTranslations('footer');
    const partnershipsList = [
        {
            name: 'Grupo GEA',
            icon: Building2,
            description: t('partners.gea')
        },
        {
            name: 'Sanjotec',
            icon: Star,
            description: t('partners.sanjotec')
        },
        {
            name: 'DG Consulting',
            icon: Users,
            description: t('partners.dgConsulting')
        },
        {
            name: 'Turismo de Portugal',
            icon: Globe,
            description: t('partners.turismoDePortugal')
        },
    ];
    return (_jsxs(motion.div, { children: [_jsxs("h3", { className: 'font-bold mb-6 text-foreground relative inline-block', children: [t('partnersTitle'), _jsx("span", { className: "absolute -bottom-2 left-0 w-1/2 h-1 bg-accent rounded-full" })] }), _jsx("div", { className: 'space-y-4', children: partnershipsList.map((partner) => {
                    const Icon = partner.icon;
                    return (_jsxs(motion.div, { whileHover: { x: 5, backgroundColor: "hsla(var(--accent-hsl), 0.05)" }, className: 'flex items-center space-x-3 p-2 rounded-lg transition-colors', children: [_jsx("div", { className: 'p-2 rounded-lg bg-accent/10 text-accent', children: _jsx(Icon, { className: 'h-4 w-4' }) }), _jsxs("div", { children: [_jsx("p", { className: 'text-sm font-medium text-foreground', children: partner.name }), _jsx("p", { className: 'text-xs text-muted-foreground', children: partner.description })] })] }, partner.name));
                }) })] }));
}
//# sourceMappingURL=PartnershipsSection.js.map