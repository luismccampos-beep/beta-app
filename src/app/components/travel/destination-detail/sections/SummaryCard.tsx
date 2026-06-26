'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card';
import { AnimatedSection } from '../components/AnimatedSection';

export function SummaryCard({
  summary,
  t,
}: {
  summary: string;
  t: (key: string) => string;
}) {
  if (!summary) return null;
  return (
    <AnimatedSection>
      <Card className="border-teal-200/50 dark:border-teal-800/50 bg-white/70 dark:bg-gray-800/60 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl dark:text-white">{t('cardSummary')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">{summary}</p>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
