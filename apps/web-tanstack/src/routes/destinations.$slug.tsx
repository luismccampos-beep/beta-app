import { createFileRoute } from '@tanstack/react-router'
import { DestinationDetailPage } from '@/components/pages/DestinationDetailPage'
import { useLocale } from '@/lib/i18n-provider'
import { generatePageHead, generateDestinationJsonLd } from '@/lib/seo'

interface DestinationData {
  nome: string
  slug: string
  descricao?: string
  imageUrl?: string
  pais?: string
}

interface DestinationResponse {
  item?: DestinationData
}

export const Route = createFileRoute('/destinations/$slug')({
  loader: async ({ params }) => {
    try {
      const res = await fetch(`/api/travel/v1/destinations/${encodeURIComponent(params.slug)}`)
      if (!res.ok) return null
      const data = (await res.json()) as DestinationResponse
      return (data.item || data) as DestinationData
    } catch {
      return null
    }
  },
  head: ({ loaderData }) => {
    const dest = loaderData as DestinationData | null
    if (!dest) {
      return generatePageHead({
        title: 'Destino não encontrado',
        description: 'Este destino não foi encontrado.',
        path: '/destinations',
      })
    }

    return generatePageHead({
      title: dest.nome,
      description: dest.descricao || `Descubra ${dest.nome} com recomendações personalizadas.`,
      image: dest.imageUrl,
      path: `/destinos/${dest.slug}`,
      jsonLd: generateDestinationJsonLd({
        name: dest.nome,
        slug: dest.slug,
        description: dest.descricao,
        image: dest.imageUrl,
        country: dest.pais,
      }),
    })
  },
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
