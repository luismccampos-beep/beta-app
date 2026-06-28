import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../app/components/ui/badge';
import { Globe, Shield } from 'lucide-react';

const meta: Meta<typeof Badge> = {
  title: '🧩 Components / Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'radio', options: ['default', 'secondary', 'destructive', 'outline'] },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: 'Default Badge', variant: 'default' } };
export const Secondary: Story = { args: { children: 'Secondary', variant: 'secondary' } };
export const Destructive: Story = { args: { children: 'Error', variant: 'destructive' } };
export const Outline: Story = { args: { children: 'Outline', variant: 'outline' } };

export const GlassBadges: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-gray-900 dark:to-gray-800 rounded-xl flex flex-wrap gap-4">
      <Badge variant="outline" className="glass gap-2 py-2 px-4">
        <Globe className="w-4 h-4" /> 190+ Países
      </Badge>
      <Badge variant="outline" className="glass-strong gap-2 py-2 px-4">
        <Shield className="w-4 h-4" /> AES-256
      </Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center p-4">
      <Badge variant="default" className="text-xs px-2 py-0.5">XS</Badge>
      <Badge variant="default" className="text-sm px-3 py-1">SM</Badge>
      <Badge variant="default" className="text-base px-4 py-2">MD</Badge>
      <Badge variant="default" className="text-lg px-5 py-3">LG</Badge>
    </div>
  ),
};
