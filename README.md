# 🌍 AKMLEVA - Enterprise AI Travel Ecosystem

![Status](https://img.shields.io/badge/Status-Enterprise-blue)
![Year](https://img.shields.io/badge/Year-2026-gold)
![License](https://img.shields.io/badge/License-MIT-green)
![Lines of Code](https://img.shields.io/badge/Code-3.5M%20SLOC-purple)

**AKMLEVA** is a comprehensive enterprise-grade AI-powered travel ecosystem designed for global scale. Built with modern web technologies and powered by advanced artificial intelligence, the platform delivers intelligent travel solutions through logistical optimization, high-volume CRM management, and multi-currency financial processing.

**Owned and operated by AKMLEVA Viagens Lda.**

---

## 🏗️ Project Scale & Metrics (2026)

As of 2026, AKMLEVA has reached significant technical maturity:


---

## 🚀 Core Features

### 🔐 Authentication & Security

- **Zero-Trust Architecture**: Advanced JWT-based authentication
- **RBAC**: Granular Role-Based Access Control
- **Multi-factor Auth**: Enhanced security layers
- **Session Management**: Redis-backed secure sessions

### 🤖 AI-Powered Intelligence

- **Smart Recommendations**: Predictive user behavior analysis
- **Dynamic Itineraries**: Real-time travel planning optimization
- **Neural Search**: Elasticsearch-powered instant results
- **AI Concierge**: Automated customer assistance

### 💳 Payment Processing

- **Global Coverage**: Multi-currency support (EUR, USD, BRL, etc.)
- **Multiple Methods**: Stripe, Pix, Credit Card, Bank Transfers
- **Secure Transactions**: PCI-DSS compliant processing
- **Real-time Validation**: Instant payment verification

### 🏨 Travel Services Integration

- **Amadeus API**: Real-time flight and hotel booking
- **Inventory Management**: Live availability tracking
- **Price Optimization**: Dynamic pricing algorithms
- **Multi-provider Support**: Flexible service integration

### 📊 CRM & Analytics

- **Large-scale Customer Management**: Handle millions of records
- **Lifecycle Tracking**: Complete customer journey mapping
- **Behavioral Analytics**: Deep engagement insights
- **Marketing Automation**: Targeted campaign management

### 🌐 User Experience

- **Responsive Design**: Mobile-first, adaptive interfaces
- **Dark/Light Mode**: User preference support
- **Multi-language**: i18n ready for global markets
- **Real-time Updates**: WebSocket-based live data
- **PWA Support**: Offline-capable progressive web app

---

## 📦 Ecosystem Architecture

AKMLEVA utilizes a **Turbo-optimized Monorepo** for maximum code reuse and consistency:


---

## 🛠️ Technology Stack

### Frontend Layer

| Technology     | Purpose          | Version              |
| -------------- | ---------------- | -------------------- |
| React          | UI Framework     | 18+ (19 recommended) |
| Next.js        | SSR & App Router | 15+                  |
| TypeScript     | Type Safety      | 5.0+                 |
| Tailwind CSS   | Styling          | 3.0+                 |


### Backend Layer

| Technology | Purpose          | Version               |
| ---------- | ---------------- | --------------------- |
| Node.js    | Runtime          | 18+ (22+ recommended) |
| TypeScript | Type Safety      | 5.0+                  |
| Prisma     | ORM              | Latest                |
| MySQL      | Primary Database | 8.0+                 |



## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

```bash
# Check Node.js version (18+ required, 22+ recommended)
node --version

# Check npm version (11.6.2+ required)
npm --version

```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd AKMLEVA

# Install all dependencies (uses workspace configuration)
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Required: DATABASE_URL, REDIS_URL, JWT_SECRET, STRIPE_KEY, etc.
```

### Development Mode

```bash

npm run dev:        # Next.js web app (http://localhost:3001)

# Database operations
npm run db:migrate      # Run Prisma migrations
npm run db:seed         # Seed test data
npm run db:studio       # Open Prisma Studio
```

### Production Build

```bash
# Build the app (requires database to be running)
npm run build

# Start production server
npm run start
```

---

## 🏷️ Travel Catalog - Tagging de Categorias

Scripts para aplicar tags de categorias aos destinos do catálogo de viagens.

### Comandos Disponíveis

```bash
# Ver estatísticas (sem alterar nada)
npm run travel:catalog:tag-categorias:stats

# Aplicar tags ao bundle
npm run travel:catalog:tag-categorias

# Aplicar tags ao bundle + sincronizar DB
npm run travel:catalog:tag-categorias:db

# Testar com 100 destinos
node scripts/tag-destinos-categorias.mjs --limit=100
```

### ⚠️ Próximos passos manuais (antes de correr com --db)

Antes de executar o script com `--db`, precisas de:

1. Adicionar campo ao schema Prisma:
```bash
node scripts/_add-categorias-schema.mjs
```

2. Gerar migração:
```bash
npx prisma migrate dev --name add_destino_categorias
```

3. Executar o auto-tagging:
```bash
npm run travel:catalog:tag-categorias
```

4. Sincronizar com a DB (depois da migração):
```bash
npm run travel:catalog:tag-categorias:db
```

---

## 🗺️ Geocoding de Hotéis Wikivoyage

Scripts para geocodificar hotéis do Wikivoyage em paralelo com retoma automática.

### Comandos Disponíveis

```bash
# Ver estado do processamento
node scripts/geocode-wv-hotels-parallel.mjs --status

# Testar (dry-run) com 100 hotéis
node scripts/geocode-wv-hotels-parallel.mjs --dry-run --limit=100

# Processar 5000 hotéis com 10 workers
node scripts/geocode-wv-hotels-parallel.mjs --limit=5000 --workers=10

# Processar todos os hotéis de Portugal
node scripts/geocode-wv-hotels-parallel.mjs --country=PT --workers=8

# Correr em background (retoma automaticamente)
node scripts/geocode-wv-hotels-parallel.mjs --workers=10 --delay=0.1
```

### Funcionalidades

- **Processamento paralelo**: Multi-threading com workers configuráveis
- **Retoma automática**: Continua do ponto onde parou em caso de interrupção
- **Filtros**: Por país, limite de registos, dry-run para testes
- **Delay configurável**: Controlo de rate limiting entre requests

---

## 🧪 Quality Assurance Strategy

Given the scale of 3.5M+ SLOC, AKMLEVA follows a rigorous multi-layer testing approach:

### Testing Layers

```
┌─────────────────────────────────────┐
│   E2E Tests (Playwright)            │  ← Complete user workflows
├─────────────────────────────────────┤
│   Unit & Integration Tests (Vitest) │  ← Components & services
└─────────────────────────────────────┘
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests on changed files only (fast!)
npm run test:changed

# E2E Tests
npm run e2e               # Headless mode
npm run e2e:ui            # Interactive UI mode
```


---

## 🔧 Development Workflow

### Code Quality Tools

```bash
# Linting
npm run lint              # Lint all workspaces

# Type Checking
npm run type-check        # TypeScript validation

### Database Management

```bash
npm run db:migrate        # Create and run migrations
npm run db:push           # Push schema changes (dev)
npm run db:seed           # Seed database
npm run db:reset          # Reset database (careful!)
npm run db:studio         # Open Prisma Studio UI
```

### Monitoring & Debugging

```bash
# Monitoring via Sentry (configured in code)
```

---

## 🌐 Deployment Environments

### Development

```bash
# Local development with hot reload
npm run dev

# Uses:
# - Local PostgreSQL/Redis
# - Mock payment providers
# - Debug logging enabled
```

### Staging

```bash
# Pre-production environment
npm run deploy:staging

# Uses:
# - Staging database
# - Test payment providers
# - Sentry monitoring
```

### Production

```bash
# Production deployment
npm run deploy:production

# Uses:
# - Production PostgreSQL clusters
# - Live payment processors
# - Full monitoring stack
# - CDN integration
```

---

## 📊 Project Statistics



---

## 🤝 Contributing


### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Write tests for new features
- Document API changes
- Maintain > 80% test coverage
- Follow conventional commits

---

## 📄 License

**MIT License**

Copyright (c) 2025-2026 AKMLEVA Viagens Lda.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## 🙏 Acknowledgments

- **Development Team**: AKMLEVA Engineering Team
- **UI/UX Design**: AKMLEVA Design Studio
- **Infrastructure**: Railway, Vercel
- **Open Source**: Built on amazing open-source technologies

---

## 📞 Contact & Support

- **Website**: [akmleva.com](https://akmleva.com)
- **Email**: luismccampos@gmail.com
- **Documentation**: [docs.akmleva.com](https://docs.akmleva.com)
- **Status Page**: [status.akmleva.com](https://status.akmleva.com)

---

**Built with ❤️ by AKMLEVA Viagens Lda.**

_Transforming travel logistics through cutting-edge technology and artificial intelligence._
