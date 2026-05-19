import type { TravelResult } from '../../app/components/data/mockResults';
import type { MockDestination, MockHotel } from './mock-travel/types';

/** Subset of travel preferences used for rule-based matching (URL-safe). */
export type CompactTravelPreferences = {
  travelStyles?: string[];
  preferredDestinations?: string[];
  activityTypes?: string[];
  travelPurpose?: string[];
  pacePreference?: string;
  budgetRange?: [number, number];
  budgetPriority?: string;
  sustainabilityLevel?: string;
  ecoPreferences?: string[];
  accommodationType?: string[];
  experienceTypes?: string[];
  cabinClass?: string;
};

const ACTIVITY_TO_TIPO: Record<string, string[]> = {
  beach: ['praia', 'ilha'],
  city: ['cidade'],
  adventure: ['montanha', 'ilha', 'praia'],
  cultural: ['cidade', 'campo'],
  hiking: ['montanha', 'campo'],
  wildlife: ['campo', 'montanha', 'ilha'],
  food: ['cidade'],
  shopping: ['cidade'],
  historical: ['cidade', 'campo'],
  photography: ['cidade', 'montanha', 'praia', 'ilha', 'campo'],
  water: ['praia', 'ilha'],
  nightlife: ['cidade'],
};

const STYLE_TO_TIPO: Record<string, string[]> = {
  luxury: ['cidade', 'praia'],
  adventure: ['montanha', 'ilha', 'campo'],
  business: ['cidade'],
  family: ['cidade', 'praia', 'campo'],
  relaxation: ['praia', 'campo', 'ilha'],
};

const PACE_TO_TIPO: Record<string, string[]> = {
  relaxed: ['praia', 'campo', 'ilha'],
  moderate: ['cidade', 'praia'],
  active: ['montanha', 'cidade'],
  adventure: ['montanha', 'ilha'],
};

const CONTINENT_ALIASES: Record<string, string[]> = {
  europe: ['europa', 'europe'],
  asia: ['ásia', 'asia'],
  africa: ['áfrica', 'africa'],
  'north america': ['américa', 'america', 'north america'],
  'south america': ['américa', 'south america'],
  oceania: ['oceânia', 'oceania'],
};

function norm(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

function overlapScore(selected: string[], targets: string[]): number {
  if (!selected.length || !targets.length) return 0.5;
  const set = new Set(targets.map(norm));
  let hits = 0;
  for (const s of selected) {
    if (set.has(norm(s))) hits += 1;
  }
  return hits / selected.length;
}

function extractIatasFromLabels(labels: string[]): string[] {
  const out: string[] = [];
  for (const label of labels) {
    const m = label.match(/\(([A-Z]{3})\)/i);
    if (m) out.push(m[1].toUpperCase());
  }
  return out;
}

function budgetFit(
  nightly: number | undefined,
  nights: number,
  prefs: CompactTravelPreferences,
): number {
  const range = prefs.budgetRange;
  if (!range || range.length < 2 || nightly == null) return 0.55;
  const tripEst = nightly * Math.max(1, nights);
  const [minB, maxB] = range;
  const mid = (minB + maxB) / 2;
  if (tripEst >= minB && tripEst <= maxB) return 1;
  if (tripEst < minB) {
    const ratio = tripEst / Math.max(minB, 1);
    return 0.45 + ratio * 0.45;
  }
  const over = tripEst / Math.max(maxB, 1);
  return Math.max(0.15, 1 - (over - 1) * 0.5);
}

function sustainabilityBoost(
  dest: MockDestination,
  prefs: CompactTravelPreferences,
  sustainable: boolean,
): number {
  const level = prefs.sustainabilityLevel ?? '';
  const eco = prefs.ecoPreferences ?? [];
  if (!level && !eco.length) return 0.5;
  let score = sustainable ? 0.85 : 0.35;
  if (['high', 'essential'].includes(level)) score = sustainable ? 1 : 0.2;
  if (eco.includes('ecoCertifiedHotels') || eco.includes('sustainableTours')) {
    score = Math.max(score, sustainable ? 0.9 : 0.4);
  }
  if (dest.clima === 'tropical' && eco.includes('carbonOffsetting')) score += 0.05;
  return Math.min(1, score);
}

/**
 * Raw affinity score in ~[0, 1] before softmax across a result set.
 */
export function scoreDestinationMatch(
  dest: MockDestination,
  prefs: CompactTravelPreferences | null | undefined,
  opts?: { hotel?: MockHotel | null; nights?: number; sustainable?: boolean },
): number {
  if (!prefs) return 0.55;

  const weights: { w: number; s: number }[] = [];

  const preferredIatas = extractIatasFromLabels(prefs.preferredDestinations ?? []);
  if (preferredIatas.length && dest.iata) {
    weights.push({
      w: 0.22,
      s: preferredIatas.includes(dest.iata.toUpperCase()) ? 1 : 0.12,
    });
  } else if ((prefs.preferredDestinations?.length ?? 0) > 0) {
    const names = prefs.preferredDestinations!.map((l) => norm(l.split('(')[0] ?? l));
    const hit = names.some((n) => norm(dest.nome).includes(n) || n.includes(norm(dest.nome)));
    weights.push({ w: 0.18, s: hit ? 0.95 : 0.25 });
  }

  const tipoTargets = new Set<string>([dest.tipo]);
  for (const a of prefs.activityTypes ?? []) {
    for (const t of ACTIVITY_TO_TIPO[a] ?? []) tipoTargets.add(t);
  }
  for (const s of prefs.travelStyles ?? []) {
    for (const t of STYLE_TO_TIPO[s] ?? []) tipoTargets.add(t);
  }
  const pace = prefs.pacePreference;
  if (pace) {
    for (const t of PACE_TO_TIPO[pace] ?? []) tipoTargets.add(t);
  }
  weights.push({ w: 0.28, s: tipoTargets.has(dest.tipo) ? 1 : 0.28 });

  if ((prefs.activityTypes?.length ?? 0) > 0) {
    const activityTipos = prefs.activityTypes!.flatMap((a) => ACTIVITY_TO_TIPO[a] ?? []);
    weights.push({
      w: 0.2,
      s: activityTipos.includes(dest.tipo) ? 1 : activityTipos.length ? 0.22 : 0.5,
    });
  }

  const contNorm = norm(dest.continente);
  for (const [key, aliases] of Object.entries(CONTINENT_ALIASES)) {
    if (aliases.some((a) => contNorm.includes(norm(a)))) {
      const wanted = prefs.travelPurpose?.some((p) => norm(p).includes(key.replace(' ', '')));
      if (wanted) weights.push({ w: 0.08, s: 0.9 });
      break;
    }
  }

  weights.push({
    w: 0.14,
    s: budgetFit(opts?.hotel?.preco_por_noite, opts?.nights ?? 3, prefs),
  });

  weights.push({
    w: 0.1,
    s: sustainabilityBoost(dest, prefs, opts?.sustainable ?? false),
  });

  const priority = prefs.budgetPriority ?? 'balanced';
  if (priority === 'luxury' && (opts?.hotel?.estrelas ?? 0) >= 4) {
    weights.push({ w: 0.06, s: 1 });
  }
  if (priority === 'maximum-savings' && (opts?.hotel?.preco_por_noite ?? 999) < 100) {
    weights.push({ w: 0.06, s: 1 });
  }

  const totalW = weights.reduce((a, x) => a + x.w, 0) || 1;
  return weights.reduce((a, x) => a + x.w * x.s, 0) / totalW;
}

/** Softmax → integer percentages that sum to ~100 across the batch. */
export function softmaxToMatchPercents(scores: number[], temperature = 0.12): number[] {
  if (scores.length === 0) return [];
  if (scores.length === 1) return [Math.round(Math.min(99, Math.max(55, scores[0]! * 100)))];

  const t = Math.max(0.05, temperature);
  const max = Math.max(...scores);
  const exps = scores.map((s) => Math.exp((s - max) / t));
  const sum = exps.reduce((a, b) => a + b, 0) || 1;
  const probs = exps.map((e) => e / sum);

  let percents = probs.map((p) => Math.round(p * 100));
  const drift = 100 - percents.reduce((a, b) => a + b, 0);
  if (drift !== 0) {
    const idx = percents.indexOf(Math.max(...percents));
    percents[idx] = Math.max(1, (percents[idx] ?? 0) + drift);
  }
  return percents.map((p) => Math.min(99, Math.max(42, p)));
}

export type DestinationLookup = (
  result: TravelResult,
) => { dest: MockDestination; hotel?: MockHotel | null } | null;

/** Re-rank results: aiMatchScore = preference probability %; optional price blend. */
export function applyPreferenceMatchScores(
  results: TravelResult[],
  prefs: CompactTravelPreferences | null | undefined,
  lookup: DestinationLookup,
  options?: { priceWeight?: number },
): TravelResult[] {
  if (!results.length || !prefs) return results;

  const priceWeight = options?.priceWeight ?? 0.15;
  const raw: number[] = [];
  const meta: { dest: MockDestination; hotel?: MockHotel | null }[] = [];

  for (const r of results) {
    const info = lookup(r);
    if (!info) {
      raw.push(0.5);
      meta.push({ dest: { id: 0, nome: r.destination, pais: r.country, paisCode: '', iata: null, continente: r.continent, tipo: 'cidade', clima: 'continental', descricao: '', imagem_url: '' } });
      continue;
    }
    const prefScore = scoreDestinationMatch(info.dest, prefs, {
      hotel: info.hotel,
      nights: r.duration,
      sustainable: r.sustainable,
    });
    const priceScore = Math.min(1, Math.max(0, r.aiMatchScore / 100));
    raw.push((1 - priceWeight) * prefScore + priceWeight * priceScore);
    meta.push(info);
  }

  const percents = softmaxToMatchPercents(raw);
  return results.map((r, i) => ({
    ...r,
    aiMatchScore: percents[i] ?? r.aiMatchScore,
  }));
}
