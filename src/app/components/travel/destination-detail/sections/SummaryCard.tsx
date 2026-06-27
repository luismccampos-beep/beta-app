'use client';

import { BookOpen } from 'lucide-react';
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
      <Card className="card-premium dark:bg-gray-900 group">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-gray-950 dark:text-white uppercase tracking-tighter italic flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary dark:text-primary-300">
              <BookOpen className="h-5 w-5" />
            </div>
            {t('cardSummary')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium">{summary}</p>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
