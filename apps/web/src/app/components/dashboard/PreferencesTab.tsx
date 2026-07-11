'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useLocale, useTranslations } from 'next-intl';
import { Briefcase, MapPin, TreePalm, Hotel, Heart, Edit } from 'lucide-react';

type SavedPreferences = {
  budgetRange?: number[];
  currency?: string;
  preferredDestinations?: string[];
  travelStyles?: string[];
  accommodationType?: string[];
  activityTypes?: string[];
  dietaryRestrictions?: string[];
};

export function PreferencesTab() {
  const locale = useLocale();
  const t = useTranslations('dashboard');
  const [savedPreferences, setSavedPreferences] = useState<SavedPreferences | null>(null);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [hbAccommodationLabels, setHbAccommodationLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/travel/catalog?locale=' + encodeURIComponent(locale))
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as { accommodations?: { code: string; label: string }[] };
        if (!res.ok) return;
        const map: Record<string, string> = {};
        for (const row of data.accommodations ?? []) {
          if (row.code && row.label) map[row.code] = row.label;
        }
        setHbAccommodationLabels(map);
      })
      .catch(() => setHbAccommodationLabels({}));
  }, [locale]);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingPreferences(true);
    fetch('/api/user/preferences', { credentials: 'include' })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as { authenticated?: boolean; preference?: { aiSettings?: unknown } };
        if (!res.ok || data.authenticated === false) return null;
        return data.preference?.aiSettings ?? null;
      })
      .then((aiSettings) => {
        if (!cancelled) {
          setSavedPreferences(aiSettings && typeof aiSettings === 'object' ? (aiSettings as SavedPreferences) : null);
        }
      })
      .catch(() => { if (!cancelled) setSavedPreferences(null); })
      .finally(() => { if (!cancelled) setIsLoadingPreferences(false); });
    return () => { cancelled = true; };
  }, []);

  const cards = [
    {
      icon: Briefcase,
      title: t('budgetRange'),
      content: isLoadingPreferences ? <Badge variant="outline">{t('loadingPrefs')}</Badge> : savedPreferences?.budgetRange ? (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {savedPreferences.currency ?? 'USD'} {savedPreferences.budgetRange[0]?.toLocaleString?.()} – {savedPreferences.currency ?? 'USD'} {savedPreferences.budgetRange[1]?.toLocaleString?.()}
        </span>
      ) : <span className="text-sm text-gray-400">{t('notSet')}</span>,
    },
    {
      icon: MapPin,
      title: t('preferredDestinations'),
      content: isLoadingPreferences ? <Badge variant="outline">{t('loadingPrefs')}</Badge> : (savedPreferences?.preferredDestinations?.length ?? 0) > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {savedPreferences!.preferredDestinations!.slice(0, 6).map((d) => (
            <Badge key={d} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">{d}</Badge>
          ))}
        </div>
      ) : <span className="text-sm text-gray-400">{t('notSet')}</span>,
    },
    {
      icon: TreePalm,
      title: t('travelStyle'),
      content: isLoadingPreferences ? <Badge variant="outline">{t('loadingPrefs')}</Badge> : (savedPreferences?.travelStyles?.length ?? 0) > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {savedPreferences!.travelStyles!.slice(0, 6).map((s) => (
            <Badge key={s} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">{s}</Badge>
          ))}
        </div>
      ) : <span className="text-sm text-gray-400">{t('notSet')}</span>,
    },
    {
      icon: Hotel,
      title: t('accommodation'),
      content: isLoadingPreferences ? <Badge variant="outline">{t('loadingPrefs')}</Badge> : (savedPreferences?.accommodationType?.length ?? 0) > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {savedPreferences!.accommodationType!.slice(0, 6).map((a) => (
            <Badge key={a} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">{hbAccommodationLabels[a] ?? a}</Badge>
          ))}
        </div>
      ) : <span className="text-sm text-gray-400">{t('notSet')}</span>,
    },
    {
      icon: Heart,
      title: t('activities'),
      content: isLoadingPreferences ? <Badge variant="outline">{t('loadingPrefs')}</Badge> : (savedPreferences?.activityTypes?.length ?? 0) > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {savedPreferences!.activityTypes!.slice(0, 6).map((a) => (
            <Badge key={a} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">{a}</Badge>
          ))}
        </div>
      ) : <span className="text-sm text-gray-400">{t('notSet')}</span>,
    },
    {
      icon: Briefcase,
      title: t('dietary'),
      content: isLoadingPreferences ? <Badge variant="outline">{t('loadingPrefs')}</Badge> : (savedPreferences?.dietaryRestrictions?.length ?? 0) > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {savedPreferences!.dietaryRestrictions!.slice(0, 6).map((d) => (
            <Badge key={d} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">{d}</Badge>
          ))}
        </div>
      ) : <span className="text-sm text-gray-400">{t('notSet')}</span>,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <h2 className="text-4xl font-black text-gray-950 dark:text-white tracking-tighter uppercase">{t('travelPreferences')}</h2>
        <Button
          onClick={() => (window.location.href = '/preferences/edit')}
          variant="brand"
          className="gap-2 font-bold shadow-glow-primary"
          size="sm"
        >
          <Edit className="w-4 h-4" />
          {t('editProfile')}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {cards.map(({ icon: Icon, title, content }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="card-premium dark:bg-gray-900 group h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary dark:text-primary-300 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-gray-950 dark:text-white uppercase tracking-tighter">{title}</h3>
                </div>
                <div className="pl-12">
                  {content}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
