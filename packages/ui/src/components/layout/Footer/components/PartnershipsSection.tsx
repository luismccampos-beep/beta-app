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

    return (
        <motion.div>
            <h3 className='font-bold mb-6 text-foreground relative inline-block'>
                {t('partnersTitle')}
                <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-accent rounded-full"></span>
            </h3>
            <div className='space-y-4'>
                {partnershipsList.map((partner) => {
                    const Icon = partner.icon;
                    return (
                        <motion.div
                            whileHover={{ x: 5, backgroundColor: "hsla(var(--accent-hsl), 0.05)" }}
                            key={partner.name}
                            className='flex items-center space-x-3 p-2 rounded-lg transition-colors'
                        >
                            <div className='p-2 rounded-lg bg-accent/10 text-accent'>
                                <Icon className='h-4 w-4' />
                            </div>
                            <div>
                                <p className='text-sm font-medium text-foreground'>{partner.name}</p>
                                <p className='text-xs text-muted-foreground'>{partner.description}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}