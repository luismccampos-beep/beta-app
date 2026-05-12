"use client";

import { motion } from 'framer-motion';
import {
    Award,
    Clock,
    CreditCard,
    Mail,
    MapPin,
    Phone,
    Shield
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import BaseLink from '../../../common/BaseLink';
import { Logo } from '../../../common/Logo';
import { cn } from '../../../../utils/index';

export function CompanyInfo() {
    const t = useTranslations();
    const tCommon = useTranslations('common');

    const features = [
        { 
            icon: Shield, 
            text: t('footer.features.security'), 
            color: 'text-emerald-500' 
        },
        { 
            icon: Award, 
            text: t('footer.features.certified'), 
            color: 'text-amber-500' 
        },
        { 
            icon: Clock, 
            text: t('footer.features.support'), 
            color: 'text-sky-500' 
        },
        { 
            icon: CreditCard, 
            text: t('footer.features.payments'), 
            color: 'text-indigo-500' 
        },
    ];

    // Variantes para animação em cascata
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className='lg:col-span-2 flex flex-col'
        >
            {/* Logo e Branding */}
            <motion.div variants={itemVariants} className='mb-6'>
                <BaseLink to='/' className='inline-block group'>
                    <div className="flex items-center space-x-2 transition-transform duration-300 group-hover:scale-105">
                        <Logo size='md' withIcon />
                        <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                            AKMLEVA
                        </span>
                    </div>
                </BaseLink>
            </motion.div>

            {/* Slogan */}
            <motion.p
                variants={itemVariants}
                className='text-muted-foreground mb-8 max-w-md text-sm leading-relaxed font-medium'
            >
                {t('company.slogan')}
            </motion.p>

            {/* Contact Info com design de Cartão Moderno */}
            <motion.div variants={itemVariants} className='space-y-3 mb-10'>
                {[
                    { 
                        icon: Mail, 
                        val: t('company.email'), 
                        bgClass: 'bg-primary/10', 
                        textClass: 'text-primary' 
                    },
                    { 
                        icon: Phone, 
                        val: t('company.phone'), 
                        bgClass: 'bg-secondary/10', 
                        textClass: 'text-secondary' 
                    },
                    { 
                        icon: MapPin, 
                        val: `${tCommon('address.city')}, ${tCommon('address.street')}`,
                        bgClass: 'bg-accent/10', 
                        textClass: 'text-accent' 
                    }
                ].map((contact, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ x: 8 }}
                        className='flex items-center group cursor-pointer w-fit'
                    >
                        <div className={cn(
                            "flex items-center justify-center p-2.5 rounded-xl transition-all duration-300",
                            contact.bgClass,
                            contact.textClass,
                            "group-hover:shadow-lg group-hover:shadow-current/10"
                        )}>
                            <contact.icon className='h-4 w-4' />
                        </div>
                        <span className="ml-4 text-sm font-semibold text-foreground/80 group-hover:text-primary transition-colors">
                            {contact.val}
                        </span>
                    </motion.div>
                ))}
            </motion.div>

            {/* Trust Features / Badges */}
            <motion.div
                variants={itemVariants}
                className='grid grid-cols-2 gap-3 sm:max-w-md'
            >
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -3, backgroundColor: 'hsla(var(--primary-hsl), 0.05)' }}
                        className='flex items-center space-x-3 p-3 rounded-2xl bg-accent/10 dark:bg-card/50 border border-border/50 transition-all'
                    >
                        <div className={cn("p-1.5 rounded-lg bg-card dark:bg-accent shadow-sm", feature.color)}>
                            <feature.icon className='h-3.5 w-3.5' />
                        </div>
                        <span className='text-[11px] font-bold uppercase tracking-tight text-muted-foreground'>
                            {feature.text}
                        </span>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}