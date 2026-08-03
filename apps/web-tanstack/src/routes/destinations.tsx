import { createFileRoute } from '@tanstack/react-router'
import { DestinationsBrowsePage } from '@/components/pages/DestinationsBrowsePage'
import { generatePageHead } from '@/lib/seo'

function DestinationsRoute() {
  return <DestinationsBrowsePage onBack={() => window.history.back()} />
}

export const Route = createFileRoute('/destinations')({
  head: () => generatePageHead({
    title: 'Destinos',
    description: 'Explore destinos de viagem em todo o mundo. Descubra novos lugares com recomendações personalizadas por IA.',
    path: '/destinations',
  }),
  component: DestinationsRoute,
})
