import { createFileRoute } from '@tanstack/react-router'
import { DestinationsBrowsePage } from '@/components/pages/DestinationsBrowsePage'

function DestinationsRoute() {
  return <DestinationsBrowsePage onBack={() => window.history.back()} />
}

export const Route = createFileRoute('/destinations')({
  head: () => ({
    meta: [
      { title: 'Destinos — AKMLEVA' },
      { name: 'description', content: 'Explore destinos de viagem em todo o mundo.' },
    ],
  }),
  component: DestinationsRoute,
})
