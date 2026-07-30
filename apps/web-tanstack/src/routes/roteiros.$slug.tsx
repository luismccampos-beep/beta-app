import { createFileRoute } from '@tanstack/react-router'
import { ItineraryPage } from '@/components/pages/ItineraryPage'

export const Route = createFileRoute('/roteiros/$slug')({
  head: () => ({
    meta: [
      { title: 'Roteiro — AKMLEVA' },
    ],
  }),
  component: ItineraryRoute,
})

function ItineraryRoute() {
  const { slug } = Route.useParams()
  return <ItineraryPage slug={slug} />
}
