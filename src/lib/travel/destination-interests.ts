import type { MockDestination } from './mock-travel/types';

/** Palavras-chave Wikivoyage por interesse do formulário. */
export const INTEREST_WIKIVOYAGE_KEYWORDS: Record<string, string[]> = {
  beach: ['praia', 'praias', 'beach', 'coast', 'litoral', 'surf'],
  food: ['comer', 'restaurante', 'gastronomia', 'culinária', 'mercado', 'seafood', 'vinho'],
  cultural: ['museu', 'história', 'historical', 'unesco', 'património', 'monumento', 'arte'],
  hiking: ['trilho', 'caminhada', 'hiking', 'trek', 'montanha', 'parque natural'],
  nightlife: ['noite', 'bares', 'nightlife', 'club'],
  shopping: ['compras', 'mercado', 'shopping'],
  wildlife: ['fauna', 'parque', 'natureza', 'wildlife'],
  photography: ['vista', 'panorâmica', 'viewpoint'],
  historical: ['histórico', 'castelo', 'fortaleza', 'igreja'],
  water: ['nautica', 'barco', 'kayak', 'mergulho', 'dive'],
};

function corpus(dest: MockDestination): string {
  const parts = [
    dest.resumo,
    dest.descricao,
    dest.descricaoCompleta,
    ...(dest.veja ?? []),
    ...(dest.faca ?? []),
    ...(dest.coma ?? []),
    ...(dest.tags ?? []),
  ];
  return parts.filter(Boolean).join(' ').toLowerCase();
}

/** 0–1: quanto o artigo Wikivoyage cobre os interesses selecionados. */
export function scoreWikivoyageInterests(
  dest: MockDestination,
  activityTypes: string[] | undefined,
): number {
  const activities = activityTypes ?? [];
  if (!activities.length) return 0.5;

  const text = corpus(dest);
  if (!text.trim()) return 0.4;

  let hits = 0;
  for (const activity of activities) {
    const keys = INTEREST_WIKIVOYAGE_KEYWORDS[activity] ?? [activity];
    if (keys.some((k) => text.includes(k.toLowerCase()))) hits += 1;
  }

  return hits / activities.length;
}
