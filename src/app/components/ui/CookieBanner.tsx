'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Shield, Settings2, BarChart3, Megaphone, Cookie } from 'lucide-react';
import { cn } from './utils';
import { Button } from './button';
import { Switch } from './switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './dialog';

const STORAGE_KEY = 'cookie-consent';

interface ConsentState {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';

interface CategoryInfo {
  key: CookieCategory;
  icon: typeof Shield;
  alwaysOn?: boolean;
}

const CATEGORIES: CategoryInfo[] = [
  { key: 'necessary', icon: Shield, alwaysOn: true },
  { key: 'functional', icon: Settings2 },
  { key: 'analytics', icon: BarChart3 },
  { key: 'marketing', icon: Megaphone },
];

const translations: Record<string, {
  banner: { title: string; description: string; acceptAll: string; rejectAll: string; customize: string; necessaryLabel: string };
  categories: Record<CookieCategory, { name: string; description: string }>;
  modal: { title: string; description: string; acceptAll: string; rejectAll: string; save: string; cancel: string };
  legal: { learnMore: string; privacyPolicy: string; cookiePolicy: string };
}> = {
  en: {
    banner: {
      title: 'Cookie Management',
      description: 'We use cookies to improve your experience on our site. You can choose which types of cookies to accept.',
      acceptAll: 'Accept All',
      rejectAll: 'Reject All',
      customize: 'Customize',
      necessaryLabel: 'Necessary Only',
    },
    categories: {
      necessary: { name: 'Necessary Cookies', description: 'Essential for basic site functionality' },
      functional: { name: 'Functional Cookies', description: 'Improve user experience' },
      analytics: { name: 'Analytics Cookies', description: 'Help us improve our services' },
      marketing: { name: 'Marketing Cookies', description: 'Personalize ads and content' },
    },
    modal: {
      title: 'Cookie Settings',
      description: 'Choose which types of cookies you want to accept. Your preferences will be saved and applied across all pages of the site.',
      acceptAll: 'Accept All',
      rejectAll: 'Reject All',
      save: 'Save Preferences',
      cancel: 'Cancel',
    },
    legal: {
      learnMore: 'Learn more',
      privacyPolicy: 'Privacy Policy',
      cookiePolicy: 'Cookie Policy',
    },
  },
  pt: {
    banner: {
      title: 'Gestão de Cookies',
      description: 'Utilizamos cookies para melhorar a sua experiência no nosso site. Pode escolher quais tipos de cookies aceitar.',
      acceptAll: 'Aceitar Todos',
      rejectAll: 'Rejeitar Todos',
      customize: 'Personalizar',
      necessaryLabel: 'Apenas Necessários',
    },
    categories: {
      necessary: { name: 'Cookies Necessários', description: 'Essenciais para o funcionamento básico do site' },
      functional: { name: 'Cookies Funcionais', description: 'Melhoram a experiência do usuário' },
      analytics: { name: 'Cookies de Análise', description: 'Ajudam a melhorar nossos serviços' },
      marketing: { name: 'Cookies de Marketing', description: 'Personalizam anúncios e conteúdo' },
    },
    modal: {
      title: 'Configurações de Cookies',
      description: 'Escolha quais tipos de cookies pretende aceitar. As suas preferências serão guardadas e aplicadas em todas as páginas do site.',
      acceptAll: 'Aceitar Todos',
      rejectAll: 'Rejeitar Todos',
      save: 'Guardar Preferências',
      cancel: 'Cancelar',
    },
    legal: {
      learnMore: 'Saber mais',
      privacyPolicy: 'Política de Privacidade',
      cookiePolicy: 'Política de Cookies',
    },
  },
  es: {
    banner: {
      title: 'Gestión de Cookies',
      description: 'Utilizamos cookies para mejorar su experiencia en nuestro sitio. Puede elegir qué tipos de cookies aceptar.',
      acceptAll: 'Aceptar Todas',
      rejectAll: 'Rechazar Todas',
      customize: 'Personalizar',
      necessaryLabel: 'Solo Necesarias',
    },
    categories: {
      necessary: { name: 'Cookies Necesarias', description: 'Esenciales para el funcionamiento básico del sitio' },
      functional: { name: 'Cookies Funcionales', description: 'Mejoran la experiencia del usuario' },
      analytics: { name: 'Cookies de Análisis', description: 'Nos ayudan a mejorar nuestros servicios' },
      marketing: { name: 'Cookies de Marketing', description: 'Personalizan anuncios y contenido' },
    },
    modal: {
      title: 'Configuración de Cookies',
      description: 'Elija qué tipos de cookies desea aceptar. Sus preferencias se guardarán y aplicarán en todas las páginas del sitio.',
      acceptAll: 'Aceptar Todas',
      rejectAll: 'Rechazar Todas',
      save: 'Guardar Preferencias',
      cancel: 'Cancelar',
    },
    legal: {
      learnMore: 'Saber más',
      privacyPolicy: 'Política de Privacidad',
      cookiePolicy: 'Política de Cookies',
    },
  },
  fr: {
    banner: {
      title: 'Gestion des Cookies',
      description: 'Nous utilisons des cookies pour améliorer votre expérience sur notre site. Vous pouvez choisir quels types de cookies accepter.',
      acceptAll: 'Accepter Tout',
      rejectAll: 'Rejeter Tout',
      customize: 'Personnaliser',
      necessaryLabel: 'Nécessaires Seulement',
    },
    categories: {
      necessary: { name: 'Cookies Nécessaires', description: 'Essentiels pour le fonctionnement de base du site' },
      functional: { name: 'Cookies Fonctionnels', description: 'Améliorent l\'expérience utilisateur' },
      analytics: { name: 'Cookies d\'Analyse', description: 'Nous aident à améliorer nos services' },
      marketing: { name: 'Cookies Marketing', description: 'Personnalisent les publicités et le contenu' },
    },
    modal: {
      title: 'Paramètres des Cookies',
      description: 'Choisissez quels types de cookies vous souhaitez accepter. Vos préférences seront sauvegardées et appliquées sur toutes les pages du site.',
      acceptAll: 'Accepter Tout',
      rejectAll: 'Rejeter Tout',
      save: 'Sauvegarder les Préférences',
      cancel: 'Annuler',
    },
    legal: {
      learnMore: 'En savoir plus',
      privacyPolicy: 'Politique de Confidentialité',
      cookiePolicy: 'Politique des Cookies',
    },
  },
};

const defaultLocale = 'en';

function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

function saveConsent(state: Omit<ConsentState, 'timestamp'>): void {
  const full: ConsentState = {
    ...state,
    necessary: true,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
}

export function CookieBanner() {
  const locale = useLocale();
  const lang = (locale in translations ? locale : defaultLocale) as keyof typeof translations;
  const t = translations[lang];

  const [visible, setVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prefs, setPrefs] = useState<Omit<ConsentState, 'timestamp'>>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const existing = getConsent();
    if (!existing) {
      setVisible(true);
    } else {
      setPrefs({
        necessary: existing.necessary,
        functional: existing.functional,
        analytics: existing.analytics,
        marketing: existing.marketing,
      });
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    const all = { necessary: true, functional: true, analytics: true, marketing: true };
    saveConsent(all);
    setPrefs(all);
    setVisible(false);
    setDialogOpen(false);
  }, []);

  const handleRejectAll = useCallback(() => {
    const none = { necessary: true, functional: false, analytics: false, marketing: false };
    saveConsent(none);
    setPrefs(none);
    setVisible(false);
    setDialogOpen(false);
  }, []);

  const handleSave = useCallback(() => {
    saveConsent(prefs);
    setVisible(false);
    setDialogOpen(false);
  }, [prefs]);

  const openDialog = useCallback(() => {
    const existing = getConsent();
    if (existing) {
      setPrefs({
        necessary: existing.necessary,
        functional: existing.functional,
        analytics: existing.analytics,
        marketing: existing.marketing,
      });
    }
    setDialogOpen(true);
  }, []);

  const togglePref = useCallback((key: CookieCategory) => {
    if (key === 'necessary') return;
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, type: 'spring', damping: 25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl glass dark:bg-gray-900/90 rounded-2xl shadow-2xl p-1"
            role="dialog"
            aria-label={t.banner.title}
          >
            <div className="flex flex-col items-start gap-4 px-6 py-5 sm:flex-row sm:items-center sm:gap-8 sm:py-4">
              <div className="flex shrink-0 items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg" aria-hidden="true">
                  <Cookie className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-base font-black text-gray-950 dark:text-white uppercase tracking-tight">{t.banner.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t.banner.description}</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-3 sm:ml-auto">
                <Button variant="ghost" size="sm" onClick={handleRejectAll} className="font-bold">
                  {t.banner.rejectAll}
                </Button>
                <Button variant="outline" size="sm" onClick={openDialog} className="font-bold glass">
                  {t.banner.customize}
                </Button>
                <Button variant="brand" size="sm" onClick={handleAcceptAll} className="font-bold px-6 shadow-glow-primary">
                  {t.banner.acceptAll}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.modal.title}</DialogTitle>
            <DialogDescription>{t.modal.description}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2">
            {CATEGORIES.map(({ key, icon: Icon, alwaysOn }) => (
              <div
                key={key}
                className={cn(
                  'flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3 transition-colors',
                  prefs[key] ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-700' : 'bg-gray-50 dark:bg-gray-800/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full',
                    prefs[key] ? 'bg-primary-100 dark:bg-primary-900/50 text-primary dark:text-primary-300' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  )}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {t.categories[key].name}
                      {alwaysOn && (
                        <span className="ml-1.5 text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-normal">
                          ({t.banner.necessaryLabel})
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.categories[key].description}</p>
                  </div>
                </div>
                <Switch
                  checked={prefs[key]}
                  onCheckedChange={() => togglePref(key)}
                  disabled={alwaysOn}
                  aria-label={`Toggle ${t.categories[key].name}`}
                />
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <Button variant="ghost" size="sm" onClick={handleRejectAll}>
              {t.modal.rejectAll}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
                {t.modal.cancel}
              </Button>
              <Button variant="default" size="sm" onClick={handleSave}>
                {t.modal.save}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
