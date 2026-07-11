import type { CompactTravelPreferences } from './preference-match';

export type DestinationTipsMap = Partial<
  Record<
    | 'seguranca'
    | 'respeite'
    | 'comunique'
    | 'beba'
    | 'dinheiro'
    | 'saude'
    | 'transporte'
    | 'horarios'
    | 'compre'
    | 'clima',
    string[]
  >
>;

export type TipSectionKey = keyof NonNullable<DestinationTipsMap>;

export const TIP_SECTION_ORDER_DEFAULT: TipSectionKey[] = [
  'seguranca',
  'respeite',
  'transporte',
  'comunique',
  'beba',
  'dinheiro',
  'saude',
  'horarios',
  'compre',
  'clima',
];

/** Ordem das secções conforme perfil (mochileiro, família, …). */
export function orderTipSectionsForProfile(
  dicas: DestinationTipsMap | undefined,
  prefs?: CompactTravelPreferences | null,
): TipSectionKey[] {
  if (!dicas) return [];
  const available = TIP_SECTION_ORDER_DEFAULT.filter((k) => dicas[k]?.length);

  const styles = prefs?.travelStyles ?? [];
  const purposes = prefs?.travelPurpose ?? [];
  const profile = prefs?.dailyBudgetProfile;
  const blob = [...styles, ...purposes].join(' ').toLowerCase();

  let priority: TipSectionKey[];
  if (profile === 'mochileiro') {
    priority = ['transporte', 'dinheiro', 'beba', 'seguranca', 'comunique', 'saude', 'respeite', 'horarios', 'compre', 'clima'];
  } else if (profile === 'luxo') {
    priority = ['respeite', 'dinheiro', 'transporte', 'beba', 'seguranca', 'comunique', 'saude', 'horarios', 'compre', 'clima'];
  } else if (/famil|family|crian|child/i.test(blob)) {
    priority = ['seguranca', 'saude', 'transporte', 'respeite', 'beba', 'dinheiro', 'horarios', 'comunique', 'compre', 'clima'];
  } else if (/aventur|adventure|mochil|backpack|budget/i.test(blob)) {
    priority = ['transporte', 'dinheiro', 'beba', 'seguranca', 'comunique', 'saude', 'respeite', 'horarios', 'compre', 'clima'];
  } else if (/luxo|luxury|romantic|honeymoon/i.test(blob)) {
    priority = ['respeite', 'dinheiro', 'transporte', 'beba', 'seguranca', 'comunique', 'saude', 'horarios', 'compre', 'clima'];
  } else {
    priority = TIP_SECTION_ORDER_DEFAULT;
  }

  const ordered = priority.filter((k) => dicas[k]?.length);
  for (const k of available) {
    if (!ordered.includes(k)) ordered.push(k);
  }
  return ordered;
}

export function countTips(dicas: DestinationTipsMap | undefined): number {
  if (!dicas) return 0;
  return Object.values(dicas).reduce((n, arr) => n + (arr?.length ?? 0), 0);
}
