import type { Meta, StoryObj } from '@storybook/react';
import {
  AIllustration,
  GlobeIllustration,
  SecurityIllustration,
  TrendingIllustration,
  ZapIllustration,
  NatureIllustration,
} from '../app/components/ui/FeatureIllustrations';

/* ── Feature Illustrations ──
   Custom SVG geometric illustrations for the 6 feature cards. */

const IllustrationCard = ({ name, Component, gradient }: { name: string; Component: React.ComponentType<React.SVGProps<SVGSVGElement>>; gradient: string }) => (
  <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center p-2`}>
      <Component className="w-28 h-28" />
    </div>
    <span className="text-sm font-bold text-gray-900 dark:text-white">{name}</span>
  </div>
);

function IllustrationsPage() {
  return (
    <div className="p-12 max-w-5xl mx-auto space-y-8 bg-white dark:bg-gray-950 min-h-screen">
      <div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">🎨 Feature Illustrations</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Custom SVG illustrations for the 6 feature cards on the landing page.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <IllustrationCard name="AI / Brain" Component={AIllustration} gradient="from-primary to-cyan-600" />
        <IllustrationCard name="Globe / Coverage" Component={GlobeIllustration} gradient="from-blue-500 to-indigo-600" />
        <IllustrationCard name="Security / Lock" Component={SecurityIllustration} gradient="from-green-500 to-emerald-600" />
        <IllustrationCard name="Trending / Smart" Component={TrendingIllustration} gradient="from-accent to-red-600" />
        <IllustrationCard name="Zap / Booking" Component={ZapIllustration} gradient="from-yellow-500 to-amber-600" />
        <IllustrationCard name="Nature / Sustainable" Component={NatureIllustration} gradient="from-lime-500 to-green-600" />
      </div>

      <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Usage</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Import any illustration from <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">@/app/components/ui/FeatureIllustrations</code>.
          Each component accepts standard SVG props and renders a 200×200 viewBox geometric illustration.
        </p>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: '🎨 Design System / Feature Illustrations',
  component: IllustrationsPage,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const All: Story = { render: () => <IllustrationsPage /> };
