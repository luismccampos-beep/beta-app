import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '@/components/pages/LegalPage'
import { generatePageHead } from '@/lib/seo'

type PageType = 'terms' | 'privacy' | 'gdpr' | 'cancellations' | 'cookies'
const VALID_PAGES: PageType[] = ['terms', 'privacy', 'gdpr', 'cancellations', 'cookies']

const LEGAL_PAGE_META: Record<PageType, { title: string; description: string }> = {
  terms: { title: 'Termos e Condições', description: 'Termos e condições de utilização da plataforma AKMLEVA.' },
  privacy: { title: 'Política de Privacidade', description: 'Política de privacidade e proteção de dados da AKMLEVA.' },
  gdpr: { title: 'RGPD', description: 'Informações sobre conformidade com o Regulamento Geral de Proteção de Dados.' },
  cancellations: { title: 'Política de Cancelamento', description: 'Política de cancelamento de reservas e reembolsos.' },
  cookies: { title: 'Política de Cookies', description: 'Política de utilização de cookies na plataforma AKMLEVA.' },
}

function LegalRoute() {
  const { pageType } = Route.useParams()
  const validPage = VALID_PAGES.includes(pageType as PageType) ? (pageType as PageType) : 'terms'
  return <LegalPage pageType={validPage} onBack={() => window.history.back()} />
}

export const Route = createFileRoute('/legal/$pageType')({
  head: ({ params }) => {
    const pageType = VALID_PAGES.includes(params.pageType as PageType) ? (params.pageType as PageType) : 'terms'
    const meta = LEGAL_PAGE_META[pageType]
    return generatePageHead({
      title: meta.title,
      description: meta.description,
      path: `/legal/${pageType}`,
    })
  },
  component: LegalRoute,
})
