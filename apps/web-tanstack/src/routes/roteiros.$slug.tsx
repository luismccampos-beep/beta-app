import { createFileRoute } from '@tanstack/react-router'
import { ItineraryPage } from '@/components/pages/ItineraryPage'
import { generatePageHead } from '@/lib/seo'

export const Route = createFileRoute('/roteiros/$slug')({
  head: () => generatePageHead({
    title: 'Roteiro',
    description: 'Explore roteiros de viagem personalizados com recomendações inteligentes.',
    path: '/roteiros',
  }),
  component: ItineraryRoute,
})

function ItineraryRoute() {
  const { slug } = Route.useParams()
  return <ItineraryPage slug={slug} />
}
