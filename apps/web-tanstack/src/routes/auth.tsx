import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { generatePageHead } from '@/lib/seo'
import { AuthPage } from '@/components/pages/AuthPage'

export const Route = createFileRoute('/auth')({
  head: () => generatePageHead({
    title: 'Entrar',
    description: 'Inicie sessão na sua conta AKMLEVA.',
    path: '/auth',
    noindex: true,
  }),
  component: AuthRoute,
})

function AuthRoute() {
  const navigate = useNavigate()

  return (
    <AuthPage
      onLoginSuccess={() => void navigate({ to: '/dashboard' })}
      onBackToHome={() => void navigate({ to: '/' })}
      onNavigateToLegal={(pageType) => void navigate({ to: '/legal/$pageType', params: { pageType } })}
    />
  )
}
