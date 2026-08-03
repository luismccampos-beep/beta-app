export type ImageValidation = {
  valid: boolean;
  score: number; // 0-1
  reasons: string[];
};

export async function validateImage(
  dest: { nome: string; pais: string; latitude?: number; longitude?: number },
  image: { url: string; source: string; tags?: string[] }
): Promise<ImageValidation> {
  const reasons: string[] = [];
  let score = 0;

  // 1. Fontes confiáveis → auto-aprova
  if (['wikidata', 'wikipedia', 'wikivoyage'].includes(image.source)) {
    return { valid: true, score: 1.0, reasons: ['trusted_source'] };
  }

  // 2. Tags incluem nome da cidade + país?
  const tags = (image.tags ?? []).join(' ').toLowerCase();
  if (tags.includes(dest.nome.toLowerCase())) {
    score += 0.3;
    reasons.push('name_in_tags');
  }
  if (tags.includes(dest.pais.toLowerCase())) {
    score += 0.2;
    reasons.push('country_in_tags');
  }

  // 3. Heurística nome de ficheiro
  const filename = image.url.toLowerCase();
  const nomeSemEspacos = dest.nome.toLowerCase().replace(/\s+/g, '');
  if (filename.includes(nomeSemEspacos)) {
    score += 0.15;
    reasons.push('name_in_filename');
  }
  // rejeita genéricos óbvios
  if (/\b(pasta|food|pizza|burger|beach_generic)\b/.test(filename)) {
    score -= 0.4;
    reasons.push('generic_filename');
  }

  const valid = score >= 0.7;
  if (!valid) {
    reasons.push(`score_${score.toFixed(2)}_below_threshold`);
  }

  return { valid, score, reasons };
}