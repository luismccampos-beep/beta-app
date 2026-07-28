# E2E Tests Documentation

## 📁 Estrutura de Diretórios

```
e2e/
├── pages/                      # Page Object Models
│   ├── BasePage.ts            # Classe base com métodos comuns
│   ├── AuthPage.ts            # Página de autenticação
│   ├── HomePage.ts            # Página inicial
│   └── PreferencesPage.ts     # Página de preferências de viagem
│
├── fixtures/                  # Fixtures e helpers compartilhados
│   └── test-helpers.ts        # Fixtures customizados + utilitários
│
├── api.spec.ts                # Testes de API endpoints
├── auth.spec.ts               # Testes de autenticação
├── preferences-form.spec.ts   # Testes do formulário de preferências
├── full-flows.spec.ts         # Testes de fluxos completos
├── i18n.spec.ts               # Testes de internacionalização
├── error-handling.spec.ts     # Testes de tratamento de erros
├── performance.spec.ts        # Testes de performance e métricas
├── accessibility.spec.ts      # Testes de acessibilidade
└── production-health.spec.ts  # Testes de saúde da aplicação
```

## 🚀 Como Executar os Testes

### Pré-requisitos

1. **Variáveis de ambiente** - Copie `.env.example` para `.env` e configure:
   ```bash
   cp .env.example .env
   ```

2. **Banco de dados** - Certifique-se que o PostgreSQL está rodando:
   ```bash
   docker compose up postgres -d
   ```

3. **Dependências** - Instale as dependências:
   ```bash
   npm install
   ```

### Comandos

```bash
# Executar todos os testes e2e
npm run e2e

# Executar com UI interativa (útil para debug)
npm run e2e:ui

# Executar apenas testes de acessibilidade
npm run e2e:a11y

# Executar em modo headed (ver o browser abrir)
npx playwright test --headed

# Executar teste específico
npx playwright test e2e/auth.spec.ts

# Executar teste com filtro
npx playwright test --grep "login"

# Executar em produção (requer BASE_URL)
BASE_URL=https://www.akmleva.pt npm run e2e
```

### Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `BASE_URL` | URL da aplicação (para testes em produção) | Não |
| `E2E_AUTH_TEST_EMAIL` | Email para testes de autenticação | Não* |
| `E2E_AUTH_TEST_PASSWORD` | Senha para testes de autenticação | Não* |
| `DATABASE_URL` | URL do banco de dados | Não |
| `AUTH_SECRET` | Secret para autenticação | Não |

*Obrigatória para executar testes de fluxos autenticados.

## 🏗️ Arquitetura

### Page Object Model (POM)

Cada página da aplicação tem uma classe correspondente que encapsula:
- **Seletores** - Localizadores de elementos
- **Ações** - Métodos para interagir com a página
- **Assertions** - Métodos para verificar estado

```typescript
// Exemplo: AuthPage.ts
export class AuthPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Fixtures Customizadas

Fixtures são injetadas automaticamente nos testes:

```typescript
test('faz login', async ({ authPage }) => {
  await authPage.goto();
  await authPage.login('user@example.com', 'password');
});
```

**Fixtures disponíveis:**
- `authPage` - Instância de AuthPage
- `homePage` - Instância de HomePage
- `preferencesPage` - Instância de PreferencesPage

### Helpers e Utilitários

```typescript
import { 
  TEST_USERS,        // Dados de teste
  TIMEOUTS,          // Timeouts padronizados
  PAGES,             // URLs das páginas
  waitForAPIResponse, // Aguardar resposta de API
  setupConsoleErrorTracking, // Rastrear erros de console
} from './fixtures/test-helpers';
```

## 📝 Padrões e Convenções

### Nomenclatura de Testes

```typescript
test.describe('Feature Name', () => {
  test.describe('Sub-feature', () => {
    test('should do something specific', async ({ page }) => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Estrutura de Teste (AAA)

```typescript
test('descriptive test name', async ({ page }) => {
  // Arrange - Preparar dados e estado
  await page.goto('/auth');
  
  // Act - Executar ação
  await page.fill('input[type="email"]', 'test@example.com');
  await page.click('button[type="submit"]');
  
  // Assert - Verificar resultado
  await expect(page).toHaveURL('/dashboard');
});
```

### Seletores

**Preferir (em ordem):**
1. **Roles** - `getByRole('button')`, `getByRole('link')`
2. **Text** - `getByText('Login')`, `getByLabel('Email')`
3. **Test IDs** - `getByTestId('submit-button')`
4. **CSS/XPath** - Último recurso

```typescript
// ✅ Bom
page.getByRole('button', { name: 'Login' })
page.getByLabel('Email')
page.getByText('Welcome')

// ❌ Evitar
page.locator('.btn-primary')
page.locator('#submit-btn')
```

### Timeouts

```typescript
// Usar timeouts padronizados
import { TIMEOUTS } from './fixtures/test-helpers';

await expect(element).toBeVisible({ timeout: TIMEOUTS.medium });
```

## 🎯 Cobertura de Testes

### Por Categoria

| Categoria | Arquivo | Cobertura |
|-----------|---------|-----------|
| **Autenticação** | `auth.spec.ts` | Login, registro, proteção de rotas |
| **API** | `api.spec.ts` | Endpoints, CORS, autenticação, performance |
| **Fluxos Completos** | `full-flows.spec.ts` | Jornada do usuário, navegação |
| **Internacionalização** | `i18n.spec.ts` | Multi-idioma, switching |
| **Error Handling** | `error-handling.spec.ts` | 404, rede, validação, edge cases |
| **Performance** | `performance.spec.ts` | Core Web Vitals, recursos, mobile |
| **Acessibilidade** | `accessibility.spec.ts` | WCAG, teclado, landmarks |
| **Produção** | `production-health.spec.ts` | Health checks, assets, console errors |

### Execução Condicional

Alguns testes só executam quando condições são atendidas:

```typescript
// Testes que requerem autenticação
if (shouldRunAuthTests()) {
  test.describe('Authenticated Flows', () => {
    // ...
  });
}

// Testes que requerem banco de dados
const response = await page.goto('/destinations').catch(() => null);
if (!response || response.status() >= 500) {
  test.skip();
  return;
}
```

## 🔍 Debugging

### Screenshots e Traces

- **Screenshots**: Capturados automaticamente em falhas (`only-on-failure`)
- **Traces**: Capturados em retries (`on-first-retry`)
- **Vídeos**: Mantidos em falhas (`retain-on-failure`)

### Ver Relatório HTML

```bash
# Após execução dos testes
npx playwright show-report
```

O relatório inclui:
- Screenshots de falhas
- Vídeos de testes que falharam
- Trace viewer para análise detalhada
- Métricas de tempo

### Modo UI

```bash
npm run e2e:ui
```

Abre interface interativa para:
- Executar testes individualmente
- Ver execução em tempo real
- Debug com breakpoints
- Inspecionar elementos

## 📊 Métricas e Relatórios

### Formatos de Saída

Configurados em `playwright.config.ts`:

```typescript
reporter: [
  ['html', { outputFolder: 'playwright-report' }],    # Relatório visual
  ['json', { outputFile: 'test-results/results.json' }], # Dados brutos
  ['junit', { outputFile: 'test-results/junit.xml' }],   # CI/CD
]
```

### CI/CD Integration

Os testes são executados automaticamente no GitHub Actions:
- **Trigger**: Push/PR para `main`
- **Ambiente**: Ubuntu com Chrome
- **Workers**: 1 (para evitar race conditions)
- **Retries**: 2 (para testes flaky)

## 🛠️ Manutenção

### Atualizando Page Objects

Quando a UI mudar:

1. Atualize o seletor na classe Page Object
2. Todos os testes que usam esse seletor serão atualizados automaticamente

```typescript
// Antes
this.loginButton = page.locator('.btn-login');

// Depois
this.loginButton = page.locator('button[type="submit"]');
```

### Adicionando Novos Testes

1. **Escolha o arquivo apropriado** ou crie um novo
2. **Use fixtures** quando possível
3. **Siga o padrão AAA**
4. **Adicione timeouts apropriados**
5. **Use seletores robustos**

```typescript
test('novo teste', async ({ authPage }) => {
  // Arrange
  await authPage.goto();
  
  // Act
  await authPage.login('email', 'pass');
  
  // Assert
  await expect(authPage.getPage()).toHaveURL('/dashboard');
});
```

### Adicionando Novas Páginas

1. Crie a classe Page Object:

```typescript
// pages/NewPage.ts
export class NewPage extends BasePage {
  readonly someElement = this.page.locator('.element');
  
  async goto() {
    await super.goto('/new-page');
  }
  
  async doSomething() {
    await this.someElement.click();
  }
}
```

2. Adicione a fixture:

```typescript
// fixtures/test-helpers.ts
newPage: async ({ page }, setupFixture) => {
  const newPage = new NewPage(page);
  await setupFixture(newPage);
},
```

3. Use nos testes:

```typescript
test('test', async ({ newPage }) => {
  await newPage.goto();
  await newPage.doSomething();
});
```

## 🐛 Troubleshooting

### Testes Flaky

Se um teste falha intermitentemente:

1. **Aumente o timeout** para a operação específica
2. **Adicione esperas explícitas** antes de ações críticas
3. **Use `test.fixme()`** para marcar como conhecido
4. **Adicione retry** apenas para esse teste:

```typescript
test('flaky test', async ({ page }) => {
  // ...
}).retry(2);
```

### Timeouts

Se testes estão demorando muito:

1. Verifique se o banco de dados está respondendo
2. Verifique se o servidor está rodando
3. Aumente timeout no `playwright.config.ts`
4. Use `test.slow()` para testes específicos:

```typescript
test.slow(true), // 3x o timeout padrão
test('teste lento', async ({ page }) => {
  // ...
});
```

### Erros de Seletor

Se seletores não encontram elementos:

1. Use o **Playwright Inspector**:
   ```bash
   npm run e2e:ui
   ```

2. Verifique se o elemento está visível:
   ```typescript
   await expect(element).toBeVisible();
   ```

3. Use `force: true` para elementos ocultos:
   ```typescript
   await element.click({ force: true });
   ```

## 📚 Recursos

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Fixtures](https://playwright.dev/docs/test-fixtures)
- [Assertions](https://playwright.dev/docs/test-assertions)

## 🤝 Contribuindo

Ao adicionar novos testes:

1. ✅ Siga os padrões estabelecidos
2. ✅ Use Page Objects
3. ✅ Adicione timeouts apropriados
4. ✅ Documente testes complexos
5. ✅ Execute localmente antes de commitar
6. ✅ Verifique se não quebrou testes existentes

```bash
# Executar todos os testes antes de commitar
npm run e2e