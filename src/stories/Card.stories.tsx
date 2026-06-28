import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../app/components/ui/card';
import { Button } from '../app/components/ui/button';

const meta: Meta<typeof Card> = {
  title: '🧩 Components / Card',
  component: Card,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <div className="p-8">
      <Card className="max-w-sm p-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Default Card</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>This is a standard card with default styling.</CardDescription>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">Action</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const Premium: Story = {
  render: () => (
    <div className="p-8">
      <Card className="card-premium max-w-sm p-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Premium Card</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>Premium card with glass effect and shine on hover. Hover to see the effect.</CardDescription>
        </CardContent>
        <CardFooter>
          <Button variant="brand" size="sm">Premium</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const Glass: Story = {
  render: () => (
    <div className="p-8">
      <div className="p-1 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-gray-800 dark:to-gray-700">
        <Card className="glass border-0 max-w-sm p-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Glass Card</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Transparent glass effect with backdrop blur. Best over gradients.</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const GlassStrong: Story = {
  render: () => (
    <div className="p-8">
      <div className="p-1 rounded-xl bg-gradient-to-br from-primary-200 to-accent-200 dark:from-gray-900 dark:to-gray-800">
        <Card className="glass-strong border-0 max-w-sm p-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Glass Strong</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Stronger glass effect. More opaque with heavier blur.</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const AllCards: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Card Variants</h3>
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Default Card</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Standard card with default styling.</CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">Action</Button>
          </CardFooter>
        </Card>

        <Card className="card-premium p-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Premium Card</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Glass effect + shine on hover.</CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="brand" size="sm">Premium</Button>
          </CardFooter>
        </Card>

        <div className="p-1 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-gray-800 dark:to-gray-700">
          <Card className="glass border-0 p-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Glass Card</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Transparent glass effect.</CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="p-1 rounded-xl bg-gradient-to-br from-primary-200 to-accent-200 dark:from-gray-900 dark:to-gray-800">
          <Card className="glass-strong border-0 p-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Glass Strong</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Heavier glass effect.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
};
