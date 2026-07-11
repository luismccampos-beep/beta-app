import type { Meta, StoryObj } from '@storybook/react';

/* ── Design Tokens Documentation ──
   Visual reference for the project's design tokens:
   colors, typography, spacing, shadows, and radii. */

const ColorSwatch = ({ name, value, cssVar }: { name: string; value: string; cssVar: string }) => (
  <div className="flex flex-col gap-2">
    <div
      className="w-24 h-24 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
      style={{ backgroundColor: value }}
    />
    <span className="text-xs font-mono font-bold text-gray-900 dark:text-white">{name}</span>
    <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">{cssVar}</span>
    <span className="text-[10px] font-mono text-gray-400">{value}</span>
  </div>
);

const ColorRow = ({ title, colors }: { title: string; colors: { name: string; value: string; cssVar: string }[] }) => (
  <div className="mb-10">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
    <div className="flex flex-wrap gap-6">{colors.map(c => <ColorSwatch key={c.name} {...c} />)}</div>
  </div>
);

const ShadowCard = ({ name, value, cssVar }: { name: string; value: string; cssVar: string }) => (
  <div className="flex flex-col gap-2 items-center">
    <div
      className="w-32 h-32 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      style={{ boxShadow: value }}
    />
    <span className="text-xs font-mono font-bold text-gray-900 dark:text-white">{name}</span>
    <span className="text-[10px] font-mono text-gray-400">{cssVar}</span>
  </div>
);

const SpacingBar = ({ name, value }: { name: string; value: string }) => (
  <div className="flex items-center gap-3 mb-2">
    <span className="text-xs font-mono font-bold w-20 text-gray-900 dark:text-white">{name}</span>
    <div className="h-6 bg-primary/40 rounded" style={{ width: value }} />
    <span className="text-[10px] font-mono text-gray-400">{value}</span>
  </div>
);

const TypographySample = ({ name, className, sample }: { name: string; className: string; sample: string }) => (
  <div className="mb-6">
    <p className={className}>{sample}</p>
    <span className="text-[10px] font-mono text-gray-400">{name} — {className}</span>
  </div>
);

function TokensPage() {
  return (
    <div className="p-12 max-w-5xl mx-auto space-y-16 bg-white dark:bg-gray-950 min-h-screen">
      <div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">🎨 Design Tokens</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Visual reference for all design tokens used in the project.</p>
      </div>

      {/* ── Colors: Primary ── */}
      <ColorRow
        title="Primary"
        colors={[
          { name: 'primary-50', value: 'oklch(0.97 0.02 175)', cssVar: '--primary-50' },
          { name: 'primary-100', value: 'oklch(0.94 0.05 175)', cssVar: '--primary-100' },
          { name: 'primary-200', value: 'oklch(0.90 0.10 175)', cssVar: '--primary-200' },
          { name: 'primary-300', value: 'oklch(0.85 0.13 175)', cssVar: '--primary-300' },
          { name: 'primary', value: 'oklch(0.50 0.18 175)', cssVar: '--primary' },
          { name: 'primary-600', value: 'oklch(0.55 0.15 175)', cssVar: '--primary-600' },
          { name: 'primary-700', value: 'oklch(0.47 0.13 180)', cssVar: '--primary-700' },
          { name: 'primary-900', value: 'oklch(0.33 0.07 180)', cssVar: '--primary-900' },
        ]}
      />

      {/* ── Colors: Accent ── */}
      <ColorRow
        title="Accent"
        colors={[
          { name: 'accent-50', value: 'oklch(0.97 0.02 38)', cssVar: '--accent-50' },
          { name: 'accent-100', value: 'oklch(0.94 0.04 38)', cssVar: '--accent-100' },
          { name: 'accent-200', value: 'oklch(0.90 0.08 38)', cssVar: '--accent-200' },
          { name: 'accent', value: 'oklch(0.68 0.18 38)', cssVar: '--accent' },
          { name: 'accent-600', value: 'oklch(0.60 0.20 40)', cssVar: '--accent-600' },
          { name: 'accent-700', value: 'oklch(0.51 0.18 40)', cssVar: '--accent-700' },
        ]}
      />

      {/* ── Colors: Semantic ── */}
      <ColorRow
        title="Semantic"
        colors={[
          { name: 'background', value: '#ffffff', cssVar: '--background' },
          { name: 'foreground', value: 'oklch(0.145 0 0)', cssVar: '--foreground' },
          { name: 'muted', value: '#ececf0', cssVar: '--muted' },
          { name: 'muted-foreground', value: '#717182', cssVar: '--muted-foreground' },
          { name: 'border', value: 'rgba(0,0,0,0.1)', cssVar: '--border' },
          { name: 'destructive', value: '#d4183d', cssVar: '--destructive' },
          { name: 'orange', value: 'oklch(0.70 0.20 45)', cssVar: '--orange' },
          { name: 'green', value: 'oklch(0.72 0.18 145)', cssVar: '--green' },
        ]}
      />

      {/* ── Shadows ── */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Shadows</h3>
        <div className="flex flex-wrap gap-8">
          <ShadowCard name="glow-primary" value="0 0 20px oklch(0.50 0.18 175 / 0.3)" cssVar="--glow-primary" />
          <ShadowCard name="glow-accent" value="0 0 20px oklch(0.68 0.18 38 / 0.3)" cssVar="--glow-accent" />
          <ShadowCard name="glow-card" value="0 0 15px oklch(0.50 0.18 175 / 0.15)" cssVar="--glow-card" />
        </div>
      </div>

      {/* ── Typography ── */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Typography</h3>
        <TypographySample name="Heading 1" className="text-9xl font-black tracking-tighter" sample="Destinos" />
        <TypographySample name="Heading 2" className="text-6xl font-black tracking-tighter" sample="Explore o mundo" />
        <TypographySample name="Heading 3" className="text-4xl font-black uppercase italic" sample="Features" />
        <TypographySample name="Body Large" className="text-2xl font-medium" sample="Descubra destinos incríveis ao redor do mundo com recomendações personalizadas." />
        <TypographySample name="Body" className="text-base" sample="Viaje com confiança. Nós cuidamos de todos os detalhes para que você aproveite cada momento." />
        <TypographySample name="Caption" className="text-sm font-bold uppercase tracking-widest" sample="Inteligência artificial" />
      </div>

      {/* ── Spacing ── */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Spacing Scale</h3>
        <SpacingBar name="xs (1)" value="4px" />
        <SpacingBar name="sm (2)" value="8px" />
        <SpacingBar name="md (3)" value="12px" />
        <SpacingBar name="base (4)" value="16px" />
        <SpacingBar name="lg (6)" value="24px" />
        <SpacingBar name="xl (8)" value="32px" />
        <SpacingBar name="2xl (12)" value="48px" />
        <SpacingBar name="3xl (16)" value="64px" />
      </div>

      {/* ── Radii ── */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Border Radius</h3>
        <div className="flex flex-wrap gap-8 items-end">
          {[
            { name: 'sm', size: 40, className: 'rounded-sm' },
            { name: 'md', size: 48, className: 'rounded-md' },
            { name: 'lg', size: 56, className: 'rounded-lg' },
            { name: 'xl', size: 72, className: 'rounded-xl' },
            { name: '2xl', size: 88, className: 'rounded-2xl' },
            { name: '3xl', size: 104, className: 'rounded-3xl' },
          ].map(r => (
            <div key={r.name} className="flex flex-col gap-2 items-center">
              <div
                className={`${r.className} bg-primary/20 border border-primary/40`}
                style={{ width: r.size, height: r.size }}
              />
              <span className="text-xs font-mono font-bold text-gray-900 dark:text-white">{r.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: '🎨 Design System / Tokens',
  component: TokensPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const AllTokens: Story = {
  render: () => <TokensPage />,
};
