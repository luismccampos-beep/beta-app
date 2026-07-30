import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '@/components/pages/LegalPage'

type PageType = 'terms' | 'privacy' | 'gdpr' | 'cancellations' | 'cookies'
const VALID_PAGES: PageType[] = ['terms', 'privacy', 'gdpr', 'cancellations', 'cookies']

function LegalRoute() {
  const { pageType } = Route.useParams()
  const validPage = VALID_PAGES.includes(pageType as PageType) ? (pageType as PageType) : 'terms'
  return <LegalPage pageType={validPage} onBack={() => window.history.back()} />
}

export const Route = createFileRoute('/legal/$pageType')({
  head: () => ({
    meta: [
      { title: 'Legal — AKMLEVA' },
    ],
  }),
  component: LegalRoute,
})
