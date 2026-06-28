import type { Meta, StoryObj } from '@storybook/react';
import { RippleButton } from '../app/components/ui/ripple-button';
import { Sparkles, ArrowRight } from 'lucide-react';

const meta: Meta<typeof RippleButton> = {
  title: '🧩 Components / RippleButton',
  component: RippleButton,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'radio', options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'brand'] },
    size: { control: 'radio', options: ['default', 'sm', 'lg', 'icon'] },
    magnetic: { control: 'boolean' },
    magneticDistance: { control: 'number', min: 1, max: 10 },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RippleButton>;

export const Default: Story = { args: { children: 'Click Me', variant: 'default' } };

export const Brand: Story = {
  args: { children: 'Get Started', variant: 'brand', size: 'lg' },
  render: (args) => (
    <RippleButton {...args}>
      <Sparkles className="w-5 h-5" />
      {args.children}
      <ArrowRight className="w-5 h-5" />
    </RippleButton>
  ),
};

export const WithMagnetic: Story = {
  args: { children: 'Hover Me', variant: 'brand', size: 'lg', magnetic: true, magneticDistance: 6 },
};

export const NoMagnetic: Story = {
  args: { children: 'No Magnet', variant: 'outline', magnetic: false },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center p-8">
      <RippleButton variant="default" magnetic={false}>Default</RippleButton>
      <RippleButton variant="brand" magneticDistance={5}><Sparkles className="w-4 h-4" /> Brand</RippleButton>
      <RippleButton variant="outline" magnetic={false}>Outline</RippleButton>
      <RippleButton variant="secondary" magnetic={false}>Secondary</RippleButton>
      <RippleButton variant="ghost" magnetic={false}>Ghost</RippleButton>
      <RippleButton variant="destructive" magnetic={false}>Destructive</RippleButton>
    </div>
  ),
};
