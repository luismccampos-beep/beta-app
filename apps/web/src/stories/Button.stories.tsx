import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../app/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: '🧩 Components / Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'brand'],
    },
    size: { control: 'radio', options: ['default', 'sm', 'lg', 'icon'] },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: 'Default Button', variant: 'default' } };

export const Brand: Story = {
  args: { children: 'Get Started', variant: 'brand', size: 'lg' },
  render: (args) => (
    <Button {...args}>
      {args.children}
      <ArrowRight className="w-5 h-5" />
    </Button>
  ),
};

export const Outline: Story = { args: { children: 'Learn More', variant: 'outline', size: 'lg' } };
export const Secondary: Story = { args: { children: 'Secondary', variant: 'secondary' } };
export const Ghost: Story = { args: { children: 'Ghost', variant: 'ghost' } };
export const Destructive: Story = { args: { children: 'Delete', variant: 'destructive' } };
export const Small: Story = { args: { children: 'Small', size: 'sm' } };
export const Icon: Story = { args: { children: <Sparkles />, size: 'icon', variant: 'brand' } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center p-8">
      <Button variant="default">Default</Button>
      <Button variant="brand"><Sparkles className="w-4 h-4" /> Brand</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const GlassButton: Story = {
  render: () => (
    <div className="p-12 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-gray-900 dark:to-gray-800 rounded-xl">
      <div className="flex flex-wrap gap-4">
        <Button variant="outline" className="glass">Glass Default</Button>
        <Button variant="outline" className="glass-strong">Glass Strong</Button>
      </div>
    </div>
  ),
};
