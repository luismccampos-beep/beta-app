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
# Build all workspaces (requires database to be running)
npm run build

# Build without database (for CI/CD or when DB is unavailable)
npm run build:no-db
# Build specific workspace
npm run build:frontend
npm run build:backend
npm run build:web

# Start production server
npm run start
```

---

## 🧪 Quality Assurance Strategy

Given the scale of 3.5M+ SLOC, AKMLEVA follows a rigorous multi-layer testing approach:

### Testing Layers

```
┌─────────────────────────────────────┐
│   E2E Tests (Playwright)            │  ← Complete user workflows
├─────────────────────────────────────┤
│   Contract Tests (Pact)             │  ← API contract validation
├─────────────────────────────────────┤
│   Integration Tests (Vitest)        │  ← Service integration
├─────────────────────────────────────┤
│   Unit Tests (Vitest/Jest)          │  ← Individual components
└─────────────────────────────────────┘
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests by workspace
npm run test:backend      # Backend unit + integration
npm run test:frontend     # Frontend component tests
npm run test:shared       # Shared package tests

# Run specific test types
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:changed      # Only modified files (fast!)

# E2E Tests
npm run e2e               # Headless mode
npm run e2e:ui            # Interactive UI mode
npm run e2e:debug         # Debug mode

# Contract Tests
npm run test:contract     # Frontend-Backend contracts

# Coverage Reports
npm run test:coverage     # Generate coverage report
```


---

## 🔧 Development Workflow

### Code Quality Tools

```bash
# Linting
npm run lint              # Lint all workspaces
npm run lint:fix          # Auto-fix linting issues

# Formatting
npm run format            # Format with Prettier
npm run format:check      # Check formatting

# Type Checking
npm run typecheck         # TypeScript validation


### Database Management

```bash
# Prisma Commands
npm run db:migrate        # Create and run migrations
npm run db:push           # Push schema changes (dev)
npm run db:studio         # Open Prisma Studio UI
npm run db:seed           # Seed database
npm run db:reset          # Reset database (careful!)

# Backup & Restore
npm run db:backup         # Backup production DB
npm run db:restore        # Restore from backup
```

### Monitoring & Debugging

```bash
# Logs
npm run logs              # View application logs
npm run logs:error        # Error logs only
npm run logs:performance  # Performance metrics



```

---

## 🌐 Deployment Environments

### Development

```bash
# Local development with hot reload
npm run dev

# Uses:
# - Local MySQL/Redis
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
# - Production MySQL clusters
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
