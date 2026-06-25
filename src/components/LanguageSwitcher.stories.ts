import type { Meta, StoryObj } from '@storybook/react';
import { LanguageSwitcher } from './LanguageSwitcher';

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'Components/LanguageSwitcher',
  component: LanguageSwitcher,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: { control: 'radio', options: ['default', 'overlay'] },
    showIcon: { control: 'boolean' },
    showLabels: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof LanguageSwitcher>;

export const Default: Story = {
  args: {
    variant: 'default',
    showIcon: true,
  },
};

export const Overlay: Story = {
  args: {
    variant: 'overlay',
  },
};

export const WithLabels: Story = {
  args: {
    showLabels: true,
  },
};

export const WithoutIcon: Story = {
  args: {
    showIcon: false,
  },
};
