export type ImageValidation = {
  valid: boolean;
  score: number;
  reasons: string[];
};

export async function validateImage(
  dest: { nome: string; pais: string; latitude?: number; longitude?: number },
  image: { url: string; source: string; tags?: string[] }
): Promise<ImageValidation> {
  const reasons: string[] = [];
  let score = 0;

  if (['wikidata', 'wikipedia', 'wikivoyage'].includes(image.source)) {
    return { valid: true, score: 1.0, reasons: ['trusted_source'] };
  }

  const tags = (image.tags ?? []).join(' ').toLowerCase();
  if (tags.includes(dest.nome.toLowerCase())) { score += 0.3; reasons.push('name_in_tags'); }
  if (tags.includes(dest.pais.toLowerCase())) { score += 0.2; reasons.push('country_in_tags'); }

  try {
    const clipRes = await fetch('http://ml-service:8000/validate-image', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        image_url: image.url,
        candidate_labels: [
          `${dest.nome}, ${dest.pais}`,
          'other place',
          'food',
          'generic travel',
        ]
      })
    }).then(r => r.json());

    const matchScore = clipRes.scores?.[0] ?? 0;
    score += matchScore * 0.5;
    reasons.push(`clip_score=${matchScore.toFixed(2)}`);
  } catch {}

  const filename = image.url.toLowerCase();
  if (filename.includes(dest.nome.toLowerCase().replace(/\s+/g, ''))) {
    score += 0.15; reasons.push('name_in_filename');
  }
  if (/\b(pasta|food|pizza|burger|beach_generic)\b/.test(filename)) {
    score -= 0.4; reasons.push('generic_filename');
  }

  return { valid: score >= 0.7, score, reasons };
}
