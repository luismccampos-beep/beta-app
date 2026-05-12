/**
 * Exemplo de uso do FooterLandscape com o Footer principal
 * 
 * O FooterLandscape é um componente decorativo que cria um paisagem SVG
 * animada e pode ser combinado com o Footer principal.
 */

import { Footer } from '../index';
import { FooterLandscape } from './components/FooterLandscape';

// Exemplo 1: Usando FooterLandscape sozinho (apenas decorativo)
export function DecorativeLandscapeExample() {
  return (
    <div>
      {/* Conteúdo da página */}
      <main>
        <h1>Página com Paisagem Decorativa</h1>
        <p>Conteúdo da página aqui...</p>
      </main>
      
      {/* Paisagem decorativa no final */}
      <FooterLandscape className="mt-8" />
    </div>
  );
}

// Exemplo 2: Combinando FooterLandscape com Footer principal
export function CombinedFooterExample() {
  return (
    <div>
      {/* Conteúdo da página */}
      <main>
        <h1>Página Completa</h1>
        <p>Conteúdo da página aqui...</p>
      </main>
      
      {/* Paisagem + Footer */}
      <div className="relative">
        <FooterLandscape />
        <div className="absolute bottom-0 left-0 right-0">
          <Footer 
            showNewsletter={true}
          />
        </div>
      </div>
    </div>
  );
}

// Exemplo 3: FooterLandscape como background para Footer
export function FooterWithBackgroundExample() {
  return (
    <div className="relative">
      {/* Background paisagem */}
      <div className="absolute inset-0 -z-10">
        <FooterLandscape />
      </div>
      
      {/* Footer sobreposto */}
      <Footer 
        compactMode={true}
        showNewsletter={false}
      />
    </div>
  );
}

// Exemplo 4: Uso em página de landing
export function LandingPageExample() {
  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center">
        <h1 className="text-6xl font-bold">Bem-vindo!</h1>
      </section>
      
      {/* Conteúdo */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">Nossos Serviços</h2>
          <p>Conteúdo sobre serviços...</p>
        </div>
      </section>
      
      {/* Footer com paisagem */}
      <footer>
        <FooterLandscape />
        <Footer />
      </footer>
    </div>
  );
}
