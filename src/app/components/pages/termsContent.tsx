'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '../ui/badge';
import {
  FileText,
  Calendar,
  CheckCircle2,
  ScrollText,
  UserCheck,
  CreditCard,
  CalendarClock,
  ShieldAlert,
  Plane,
  Scale,
  Globe2,
  Ban,
  RefreshCw,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';

/**
 * Rich, fully-internationalized Terms of Service content.
 *
 * All copy lives in `src/messages/{locale}.json` under `legal.terms`.
 * Sections are driven by `legal.terms.sections` (an array), so adding,
 * removing or reordering clauses is a translation-only change — no code edits.
 *
 * Each section supports:
 *   - title   (string, required)
 *   - body    (string[] — paragraphs)
 *   - bullets (string[] — optional bullet list)
 */

type Section = {
  title: string;
  body?: string[];
  bullets?: string[];
};

// Icons cycle per section index (purely decorative, locale-independent).
const SECTION_ICONS: LucideIcon[] = [
  ScrollText,
  UserCheck,
  Plane,
  CreditCard,
  CalendarClock,
  Ban,
  ShieldAlert,
  RefreshCw,
  Scale,
  Globe2,
];

export function TermsContent() {
  const t = useTranslations('legal.terms');

  // `t.raw` returns the underlying JSON value (array of objects) — the
  // established pattern in this codebase for list-shaped translations.
  const sections = (t.raw('sections') as Section[] | undefined) ?? [];
  const definitions =
    (t.raw('definitions.items') as { term: string; meaning: string }[] | undefined) ?? [];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Intro / summary banner ───────────────────────────────────── */}
      <div className="rounded-2xl border-2 border-primary-200 dark:border-primary-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-accent h-1.5" />
        <div className="p-5 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary-700 dark:text-primary-300" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {t('title')}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 text-primary-700 dark:text-primary-300" />
              <span className="font-medium">{t('lastUpdated')}</span>
            </span>
            <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-0">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {t('badgeBinding')}
            </Badge>
            <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-0">
              <Scale className="w-3 h-3 mr-1" />
              {t('badgeJurisdiction')}
            </Badge>
          </div>

          <div className="p-4 sm:p-5 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-700 rounded-lg">
            <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
              {t('intro')}
            </p>
          </div>
        </div>
      </div>

      {/* ── Definitions ──────────────────────────────────────────────── */}
      {definitions.length > 0 && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg p-5 sm:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-accent-700 dark:text-accent-500" />
            {t('definitions.title')}
          </h3>
          <dl className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {definitions.map((d) => (
              <div
                key={d.term}
                className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg border border-gray-100 dark:border-gray-700"
              >
                <dt className="font-semibold text-gray-900 dark:text-white text-sm">{d.term}</dt>
                <dd className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  {d.meaning}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* ── Numbered sections ────────────────────────────────────────── */}
      <ol className="space-y-5 sm:space-y-6 list-none">
        {sections.map((section, index) => {
          const Icon = SECTION_ICONS[index % SECTION_ICONS.length];
          return (
            <li
              key={`${index}-${section.title}`}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
            >
              <div className="p-5 sm:p-7">
                <h3 className="flex items-start gap-3 text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 text-white flex items-center justify-center shadow-md">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  <span className="pt-1">
                  <span className="text-primary-700 dark:text-primary-300 mr-1.5">
                      {index + 1}.
                    </span>
                    {section.title}
                  </span>
                </h3>

                <div className="pl-0 sm:pl-12 space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {section.body?.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}

                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="space-y-2 mt-2">
                      {section.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-accent dark:text-accent-500 flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* ── Liability / important notice ─────────────────────────────── */}
      <div className="rounded-2xl border-2 border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-900/20 shadow-lg p-5 sm:p-7">
        <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-amber-900 dark:text-amber-200 mb-3">
          <AlertTriangle className="w-5 h-5" />
          {t('noticeTitle')}
        </h3>
        <p className="text-sm sm:text-base text-amber-900/90 dark:text-amber-100/90 leading-relaxed">
          {t('notice')}
        </p>
      </div>

      {/* ── Governing law strip ──────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-accent text-white shadow-xl p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-1.5">{t('governingTitle')}</h3>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              {t('governing')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
