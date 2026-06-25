'use client';

import { useState, useMemo } from 'react';

const OPENMOJI_VERSION = '3.2.0';

// Code points a remover – não fazem parte do nome do ficheiro OpenMoji
const STRIP_CP = new Set([
  0xFE0E, // VS15 text
  0xFE0F, // VS16 emoji  ← este é o que te está a partir tudo
]);

/**
 * Converte um emoji para o hex code usado pelo OpenMoji / Twemoji.
 * "👨‍💻" → "1F468-200D-1F4BB"
 * "✈️"   → "2708"           (remove FE0F)
 * "🇵🇹"  → "1F1F5-1F1F9"
 */
function emojiToHex(emoji: string): string {
  return Array.from(emoji)
    .map(ch => ch.codePointAt(0)!)
    .filter(cp => !STRIP_CP.has(cp))
    .map(cp => cp.toString(16).toUpperCase())
    .join('-');
}

// Alguns emojis que o OpenMoji nomeia de forma diferente / não tem
// keycap sequences e afins
const ALIASES: Record<string, string> = {
  // adiciona aqui conforme fores encontrando falhas nos logs
  // '❤️': '2764',  // já resolvido pelo STRIP_CP, exemplo
};

interface OpenMojiProps {
  emoji: string;
  size?: number;
  className?: string;
  label?: string;        // acessibilidade
  fallback?: 'native' | 'twemoji' | 'none';
}

export function OpenMoji({
  emoji,
  size = 24,
  className = '',
  label,
  fallback = 'native',
}: OpenMojiProps) {
  const [failedSources, setFailedSources] = useState(0);

  const hex = useMemo(() => {
    const cleanEmoji = emoji.trim();
    return ALIASES[cleanEmoji] ?? emojiToHex(cleanEmoji);
  }, [emoji]);

  // Cadeia de CDNs – se um falhar, tenta o seguinte
  const sources = useMemo(() => [
    `https://cdn.jsdelivr.net/npm/@svgmoji/openmoji@${OPENMOJI_VERSION}/svg/${hex}.svg`,
    `https://unpkg.com/@svgmoji/openmoji@${OPENMOJI_VERSION}/svg/${hex}.svg`,
    // último recurso: Twemoji (cobertura quase 100%)
    `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${hex.toLowerCase()}.svg`,
  ], [hex]);

  const accessibleLabel = label ?? emoji;

  // Esgotou todas as fontes → fallback nativo
  if (failedSources >= sources.length) {
    if (fallback === 'native') {
      return (
        <span
          role="img"
          aria-label={accessibleLabel}
          className={className}
          style={{
            fontSize: size,
            lineHeight: 1,
            display: 'inline-block',
            width: size,
            height: size,
            textAlign: 'center',
          }}
        >
          {emoji}
        </span>
      );
    }
    return null; // fallback = 'none'
  }

  const src = sources[failedSources];

  return (
    <img
      src={src}
      alt=""
      role="img"
      aria-label={accessibleLabel}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={className}
      style={{ width: size, height: size }}
      onError={() => setFailedSources(n => n + 1)}
    />
  );
}

// Export também o helper, dá jeito noutros sítios
export { emojiToHex };
