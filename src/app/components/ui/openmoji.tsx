function emojiToHex(emoji: string): string {
  return [...emoji].map((c) => c.codePointAt(0)!.toString(16).toUpperCase()).join('-');
}

interface OpenMojiProps {
  emoji: string;
  size?: number;
  className?: string;
}

export function OpenMoji({ emoji, size = 24, className = '' }: OpenMojiProps) {
  const hex = emojiToHex(emoji);
  return (
    <img
      src={`https://cdn.jsdelivr.net/npm/@svgmoji/openmoji@2.0.0/svg/${hex}.svg`}
      alt=""
      width={size}
      height={size}
      className={className}
      loading="lazy"
    />
  );
}
