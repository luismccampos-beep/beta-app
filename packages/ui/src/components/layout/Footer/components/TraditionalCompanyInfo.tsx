"use client";

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '../../../../utils';
import BaseLink from '../../../common/BaseLink';
import { socialLinks } from '../data/footerData';
import type { SocialLinkItem } from '../data/footerData';
import { Logo } from '../../../common/Logo';

export function TraditionalCompanyInfo() {
    const t = useTranslations('common');
    return (
        <div className='lg:col-span-2 flex flex-col space-y-8'>
            {/* Branding Section */}
            <div className='group inline-block'>
                <BaseLink to='/' className='flex flex-col items-start'>
                    <Logo
                        size='md'
                        withIcon
                        withText
                        className='h-10 w-auto transition-all duration-500 group-hover:brightness-125 filter drop-shadow-sm'
                    />
                    <div className="mt-2 h-0.5 w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />
                </BaseLink>
            </div>

            {/* Slogan com tipografia melhorada */}
            <p className='text-zinc-400 dark:text-zinc-400 text-sm leading-relaxed max-w-sm font-medium'>
                {t('slogan')}
            </p>

            {/* Contact Information Cards */}
            <address className='not-italic flex flex-col space-y-3'>
                {[
                    {
                        icon: MapPin,
                        label: t('address.city'),
                        sub: t('address.street'),
                        href: 'https://maps.google.com',
                        color: 'text-blue-500'
                    },
                    {
                        icon: Phone,
                        label: t('phone'),
                        href: `tel:${t('phone').replace(/\s/g, '')}`,
                        color: 'text-emerald-500'
                    },
                    {
                        icon: Mail,
                        label: t('email'),
                        href: `mailto:${t('email')}`,
                        color: 'text-purple-500'
                    }
                ].map((item, idx) => (
                    <motion.a
                        key={idx}
                        href={item.href}
                        target={item.icon === MapPin ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        whileHover={{ x: 5 }}
                        className='group flex items-start p-3 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-300'
                    >
                        <div className={cn("p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-950 transition-colors shadow-sm", item.color)}>
                            <item.icon className='h-4 w-4' />
                        </div>
                        <div className='ml-4 flex flex-col'>
                            <span className='text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                                {item.label}
                            </span>
                            {item.sub && <span className='text-xs text-zinc-500'>{item.sub}</span>}
                        </div>
                    </motion.a>
                ))}
            </address>

            {/* Social Ecosystem */}
            <div className='flex items-center gap-3 pt-2'>
                {socialLinks.map((social: SocialLinkItem, index: number) => {
                    const Icon = social.icon;
                    return (
                        <motion.a
                            key={social.name ?? index}
                            href={social.href}
                            target='_blank'
                            rel='noopener noreferrer'
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            className='relative p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-white transition-all duration-300'
                            aria-label={social.name}
                        >
                            <Icon className='h-5 w-5 relative z-10' />
                            <div
                                className='absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                                style={{ backgroundColor: social.color }}
                            />
                        </motion.a>
                    );
                })}
            </div>
        </div>
    );
}