"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { cn } from '../../../../utils/index';

interface NewsletterSectionProps {
    showNewsletter?: boolean;
    showSocialLinks?: boolean;
}

export function NewsletterSection({ showNewsletter = true }: NewsletterSectionProps) {
    const t = useTranslations('footer');
    
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    if (!showNewsletter) return null;

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        // Simulação de subscrição em 2026
        setTimeout(() => setStatus('success'), 1500);
    };

    return (
        <div className='relative flex flex-col gap-6'>
            {/* Header com Ícone Animado */}
            <div className='flex items-center gap-3'>
                <div className='relative'>
                    <Sparkles className="h-5 w-5 text-accent absolute -top-2 -right-2 animate-pulse" />
                    <h3 className='text-foreground font-bold text-xl tracking-tight'>
                        {t('newsletterTitle')}
                    </h3>
                </div>
            </div>

            <p className='text-muted-foreground text-sm leading-relaxed max-w-[280px]'>
                {t('newsletterDescription')}
            </p>

            {/* Subscription Form Container */}
            <div className="relative group">
                {/* Efeito de Glow no Hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

                <form
                    onSubmit={handleSubscribe}
                    className="relative flex flex-col gap-3 p-1"
                >
                    <div className="relative flex items-center">
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('newsletterPlaceholder')}
                            className={cn(
                                "h-12 pl-4 pr-14 bg-background/80 border-border",
                                "rounded-xl focus:ring-2 focus:ring-primary/50 transition-all duration-300",
                                "placeholder:text-muted-foreground text-foreground"
                            )}
                            disabled={status === 'success'}
                        />

                        <div className="absolute right-1">
                            <Button
                                type="submit"
                                disabled={status !== 'idle'}
                                className={cn(
                                    "h-10 w-10 p-0 rounded-lg transition-all duration-500 shadow-lg",
                                    status === 'success'
                                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105"
                                )}
                            >
                                <AnimatePresence mode="wait">
                                    {status === 'idle' && (
                                        <motion.div
                                            key="idle"
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 5 }}
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </motion.div>
                                    )}
                                    {status === 'loading' && (
                                        <motion.div
                                            key="loading"
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        >
                                            <Sparkles className="h-4 w-4" />
                                        </motion.div>
                                    )}
                                    {status === 'success' && (
                                        <motion.div
                                            key="success"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="text-white"
                                        >
                                            <Check className="h-5 w-5" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </div>
                    </div>

                    {/* Feedback Dinâmico */}
                    <motion.p
                        initial={false}
                        animate={{ opacity: status === 'success' ? 1 : 0.7 }}
                        className={cn(
                            "text-[11px] px-1 transition-colors",
                            status === 'success' ? "text-emerald-500 font-bold" : "text-muted-foreground"
                        )}
                    >
                        {status === 'success'
                            ? t('newsletterSuccess')
                            : t('newsletterPrivacy')}
                    </motion.p>
                </form>
            </div>
        </div>
    );
}