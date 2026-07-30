import { createFileRoute } from '@tanstack/react-router'
import { DestinationDetailPage } from '@/components/pages/DestinationDetailPage'
import { useLocale } from '@/lib/i18n-provider'

export const Route = createFileRoute('/destinations/$slug')({
  head: ({ params }: { params: { slug: string } }) => ({
    meta: [
      { title: `${params.slug} — AKMLEVA` },
      { name: 'description', content: 'Descubra tudo sobre este destino de viagem com recomendações personalizadas.' },
    ],
  }),
  component: DestinationDetailRoute,
})

function DestinationDetailRoute() {
  const { slug } = Route.useParams()
  const locale = useLocale()

  return (
    <DestinationDetailPage
      slug={slug}
      locale={locale}
      onBack={() => window.history.back()}
    />
  )
}
