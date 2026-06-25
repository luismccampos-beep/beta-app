# Formulário de Preferências de Viagem – Auditoria UX / Conversão

**Ficheiro:** `src/app/components/pages/EnhancedTravelPreferencesForm.tsx`  
**Data:** 2026-06-24  
**Stack:** React Hook Form + Zod + next-intl + shadcn/ui

---

## Sumário executivo

| Métrica atual | Valor estimado |
|---|---|
| Nº de steps | 6 |
| Campos totais | 35+ |
| Campos obrigatórios | 9 |
| Tempo para completar | ~4 min |
| Nº de cliques até resultados | ~60+ |
| Taxa de abandono estimada | Alta (step 1) |

| Métrica alvo | Valor |
|---|---|
| Nº de steps | 3 |
| Campos obrigatórios | 3 |
| Tempo até primeiros resultados | ~45 s |
| Nº de cliques até resultados | 8–12 |
| Abandono step 1 | -60% |

---

## Diagnóstico por área

### F1 — Zod schema com 35+ campos obrigatórios logo no step 1
**Severidade:** 🔴 P0 – Bloqueador de conversão

**Local:** `EnhancedTravelPreferencesForm.tsx` linhas 27–70

```ts
// ATUAL – 9 campos required só para passar do step 0
travelStyles: z.array(z.string()).min(1),
travelFrequency: z.string().min(1),
nationality: z.string().min(1),
currency: z.string().min(1),
cabinClass: z.string().min(1),
seatPreference: z.string().min(1),
mealPreference: z.string().min(1),
activityTypes: z.array(z.string()).min(1),
sustainabilityLevel: z.string().min(1),
```

O utilizador entra, clica "Seguinte", leva com toast vermelho em 4 campos. Frustrante. Abandono aqui.

**Correção:**

Só 3 campos obrigatórios para gerar a primeira recomendação. Todo o resto = opcional com defaults inteligentes.

```ts
// src/lib/travel/schemas/preferences.schema.ts

// --- Quick start: o mínimo para ver resultados ---
export const quickStartSchema = z.object({
  travelStyles: z.array(z.string()).min(1, 'Escolhe pelo menos 1 estilo'),
  budgetRange: z.array(z.number()).length(2),
  preferredDestinations: z.array(z.string()).min(1, 'Escolhe pelo menos 1 destino'),
});

// --- Schema completo: tudo opcional com defaults ---
export const travelPreferencesSchema = quickStartSchema.extend({
  // Travel Style
  travelFrequency: z.string().optional().default('occasional'),
  travelPurpose: z.array(z.string()).optional().default([]),
  nationality: z.string().optional(),
  preferredCountries: z.array(z.string()).optional().default([]),
  preferredContinents: z.array(z.string()).optional().default([]),

  // Budget
  currency: z.string().optional().default('EUR'),
  budgetPriority: z.string().optional().default('balanced'),
  dailyBudgetProfile: z.enum(['mochileiro', 'conforto', 'luxo'])
    .optional().default('conforto'),

  // Flight & Accommodation
  cabinClass: z.string().optional().default('economy'),
  seatPreference: z.string().optional().default('any'),
  mealPreference: z.string().optional().default('any'),
  accommodationType: z.array(z.string()).optional().default([]),
  loyaltyPrograms: z.array(z.string()).optional().default([]),
  hotelChain: z.array(z.string()).optional().default([]),
  roomType: z.string().optional().default(''),
  amenities: z.array(z.string()).optional().default([]),

  // Cruise
  cruiseEnabled: z.boolean().optional().default(false),
  cruiseDestinations: z.array(z.string()).optional().default([]),
  cruiseBrandNames: z.array(z.string()).optional().default([]),
  cruiseTier: z.string().optional().default(''),
  cruiseShipType: z.string().optional().default(''),
  cruiseDuration: z.string().optional().default(''),

  // Activities
  activityTypes: z.array(z.string()).optional().default([]),
  pacePreference: z.string().optional().default('moderate'),
  experienceTypes: z.array(z.string()).optional().default([]),
  languages: z.array(z.object({
    language: z.string(),
    proficiency: z.string(),
  })).optional().default([]),

  // Special Requirements
  sustainabilityLevel: z.string().optional().default('medium'),
  ecoPreferences: z.array(z.string()).optional().default([]),
  carbonOffset: z.boolean().optional().default(false),
  dietaryRestrictions: z.array(z.string()).optional().default([]),
  accessibility: z.array(z.string()).optional().default([]),
  medicalConditions: z.string().optional().default(''),

  // Advanced
  aiRecommendations: z.boolean().optional().default(true),
  dataSharing: z.boolean().optional().default(false),
  notifications: z.array(z.string()).optional().default(['email']),
  privacyLevel: z.string().optional().default('standard'),
});

export type TravelPreferences = z.infer<typeof travelPreferencesSchema>;
export type QuickStartPreferences = z.infer<typeof quickStartSchema>;
```

**Tarefas:**
- [ ] Criar `src/lib/travel/schemas/preferences.schema.ts` com `quickStartSchema` + `travelPreferencesSchema`
- [ ] Mover schema do componente para o ficheiro partilhado
- [ ] Atualizar `DEFAULT_TRAVEL_PREFERENCES` com defaults sensatos em TODOS os campos
- [ ] Validação por step só verifica os 3 campos do quick start no step 0–2
- [ ] Resto dos campos = opcional, com hint "Podes preencher depois"
- [ ] Testar: utilizador consegue submeter com apenas 3 campos preenchidos?

---

### F2 — 6 steps é demasiado. Ordem errada.
**Severidade:** 🔴 P0

**Atual:**
```
0. Style          → nationality, travelStyles, países, continentes, destinos, purpose
1. Budget         → moeda, budget range, budget profile, CABIN CLASS (!)
2. Flight/Hotel   → seat, meal, hotel chain, room, amenities, cruise...
3. Activities     → activityTypes, pace, languages...
4. Special Needs  → sustentabilidade, dieta, acessibilidade...
5. Settings       → aiRecommendations, dataSharing, notifications, privacyLevel
```

O utilizador quer **ver destinos**, não configurar `privacyLevel` e `dataSharing`.

**Correção – 3 steps, resultados imediatos:**

```
┌─────────────────────────────────────────┐
│  QUICK START – 45 segundos              │
├─────────────────────────────────────────┤
│  Passo 1/3  📍 Para onde?               │
│  • Estilo de viagem (8 cards visuais)   │
│  • Destinos preferidos (autocomplete)   │
│  ─ 2 perguntas, ~15s                    │
│                                         │
│  Passo 2/3  💰 Quanto?                  │
│  • Perfil de orçamento (3 cards)        │
│    Mochileiro / Conforto / Luxo         │
│  • Orçamento por viagem (4 chips)       │
│    < €2k | €2-5k | €5-15k | €15k+       │
│  ─ 2 cliques, ~10s                      │
│                                         │
│  Passo 3/3  ✨ Ver resultados           │
│  → [Ver as minhas viagens →]            │
│  ─ 1 clique                             │
└─────────────────────────────────────────┘
           ↓
  /results  ← PÁGINA DE RESULTADOS
           ↓
  Banner discreto: "Quer refinar? +15 filtros"
  → abre drawer/sidebar com o resto:
    Voos · Alojamento · Atividades · 
    Dieta/Acessibilidade · Privacidade
```

**Tarefas:**
- [ ] Redesenhar wizard para 3 steps: `Destino → Budget → Resultados`
- [ ] Mover os outros 32 campos para um painel "Refinar preferências" na página `/results`
- [ ] Ou: criar 2 modos
  - `QuickPreferencesForm` – 3 steps, 3 campos obrigatórios
  - `EnhancedTravelPreferencesForm` – completo, acessível via `/preferences/edit`
- [ ] Step indicator: "Passo 1 de 3" em vez de "1 de 6"
- [ ] Progress bar vai de 0 → 100% em 3 passos (sensação de velocidade)
- [ ] Após submit do quick form → redirect imediato para `/results?from=quickstart`

---

### F3 — TravelStyleSection: 4 pickers aninhados em Popover
**Severidade:** 🟠 P1

**Local:** `TravelStyleSection.tsx` linhas 120–270

Países → Continentes → Destinos (aeroportos) → Travel Purpose. 4 Popover + Command aninhados. Em mobile: abre, scroll, fecha, abre outro. Horrível.

**Problemas específicos:**

| Campo | Problema |
|---|---|
| Países + Continentes | São redundantes. Se escolho "Portugal, Espanha" já sei que é Europa |
| Destinos | Popover com 800 aeroportos. Não permite escrever livre "Tokyo" |
| Travel Purpose | 4 botões grandes, ocupa muito espaço vertical |

**Correção:**

```tsx
// --- Países + Continentes FUNDIDOS ---
// Um único multi-select com grupos
<Popover>
  <PopoverTrigger>
    {selected.length ? `${selected.length} locais` : 'Onde queres ir?'}
  </PopoverTrigger>
  <Command>
    <CommandInput placeholder="Pesquisar país, continente ou cidade…" />
    <CommandGroup heading="Continentes">
      <CommandItem onSelect={() => toggleContinent('Europa')}>
        🌍 Europa · 247 destinos
      </CommandItem>
      {/* ... */}
    </CommandGroup>
    <CommandGroup heading="Países populares">
      <CommandItem onSelect={() => toggleCountry('Portugal')}>
        🇵🇹 Portugal · 12 destinos
      </CommandItem>
      {/* ... */}
    </CommandGroup>
  </Command>
</Popover>

// Derivar continentes automaticamente:
useEffect(() => {
  const continents = deriveContinentsFromCountries(preferredCountries);
  setValue('preferredContinents', continents);
}, [preferredCountries]);

// --- Destinos: autocomplete livre + chips ---
<Combobox
  freeSolo  // ← permite escrever "Tokyo" mesmo sem estar na lista
  multiple
  options={airports}
  value={preferredDestinations}
  onChange={setDestinations}
  placeholder="Escreve uma cidade ou escolhe da lista…"
  renderTags={(tags) => tags.map(t => 
    <Chip key={t} onDelete={() => remove(t)}>{t}</Chip>
  )}
/>

// --- Travel Purpose: chips compactos ---
<div className="flex flex-wrap gap-2">
  {purposes.map(p => (
    <button
      key={p.id}
      onClick={() => toggle('travelPurpose', p.id)}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm border transition-all",
        selected ? "bg-teal-600 text-white border-teal-600" 
                 : "bg-white border-gray-300 hover:border-teal-400"
      )}
    >
      {p.emoji} {p.label}
    </button>
  ))}
</div>
```

**Tarefas:**
- [ ] Fundir `preferredCountries` + `preferredContinents` num único picker com grupos
- [ ] Derivar continentes automaticamente a partir dos países escolhidos
- [ ] Destinos: trocar Popover+Command por Combobox com `freeSolo=true`
- [ ] Permitir escrever destinos livres (não só aeroportos da lista)
- [ ] Travel Purpose: trocar grid de cards grandes → chips compactos inline
- [ ] Testar em iPhone SE: todos os pickers cabem sem scroll horizontal?
- [ ] Adicionar "Sugestões populares" no topo do picker de destinos (Lisboa, Porto, Madrid, Paris…)

---

### F4 — BudgetSection mistura Budget + Cabin Class
**Severidade:** 🟠 P1

**Local:** `BudgetSection.tsx`

Tens no mesmo step:
- Moeda
- Perfil diário (mochileiro/conforto/luxo) ← ótimo
- Budget range slider €1.000–€50.000
- **Cabin class do voo** ← não pertence aqui!

E o slider de €1k–€50k num telemóvel é impossível acertar com precisão.

**Correção:**

```tsx
// Budget por viagem → 4 chips rápidos
const BUDGET_CHIPS = [
  { id: 'budget',    label: 'Económico',  range: [500, 2000],   emoji: '🎒' },
  { id: 'standard',  label: 'Conforto',   range: [2000, 5000],  emoji: '✈️' },
  { id: 'premium',   label: 'Premium',    range: [5000, 15000], emoji: '🌟' },
  { id: 'luxury',    label: 'Luxo',       range: [15000, 50000],emoji: '👑' },
];

<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  {BUDGET_CHIPS.map(b => (
    <button
      key={b.id}
      onClick={() => setValue('budgetRange', b.range)}
      className={cn(
        "p-4 rounded-xl border-2 text-center transition-all",
        isSelected ? "border-teal-600 bg-teal-50" : "border-gray-200"
      )}
    >
      <div className="text-2xl mb-1">{b.emoji}</div>
      <div className="font-semibold text-sm">{b.label}</div>
      <div className="text-xs text-gray-500">
        €{b.range[0].toLocaleString()} – €{b.range[1].toLocaleString()}
      </div>
    </button>
  ))}
</div>

// Afinação opcional (collapsible)
<details className="mt-3">
  <summary className="text-sm text-gray-600 cursor-pointer">
    Afinar orçamento exato
  </summary>
  <div className="pt-3">
    <Slider min={1000} max={50000} step={500} ... />
  </div>
</details>
```

**Tarefas:**
- [ ] Substituir budget slider por 4 chips rápidos (Económico / Conforto / Premium / Luxo)
- [ ] Manter slider como "afinação" opcional dentro de `<details>`
- [ ] Mover `cabinClass` do `BudgetSection` → `FlightAccommodationSection`
- [ ] Sincronizar: se `dailyBudgetProfile === 'luxo'` → sugerir `cabinClass = 'business'` (não forçar, só sugerir)
- [ ] Moeda: detetar automaticamente via `navigator.language` / IP → pré-selecionar EUR para PT
- [ ] Testar: consegue-se escolher orçamento com 1 clique em mobile?

---

### F5 — Validação bloqueia navegação
**Severidade:** 🟠 P1

**Local:** `EnhancedTravelPreferencesForm.tsx` linhas 150–210, 660–690

```ts
onClick={async () => { 
  if (await validateStep(currentStep)) 
    setCurrentStep(prev + 1) 
}}
```

Se faltar 1 campo, o utilizador fica preso. Toast vermelho, sem scroll para o campo com erro.

**Correção A – Deixar sempre avançar (recomendado):**

```ts
// Navegação livre, valida só no submit final
const goNext = () => setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1));

// No submit final:
const onSubmit = async (data) => {
  const result = await travelPreferencesSchema.safeParseAsync(data);
  if (!result.success) {
    // scroll para primeiro erro
    const firstError = Object.keys(result.error.flatten().fieldErrors)[0];
    document.querySelector(`[name="${firstError}"]`)?.scrollIntoView({ 
      behavior: 'smooth', block: 'center' 
    });
    toast.error('Preenche os campos em falta');
    return;
  }
  // ...
};
```

**Correção B – Validar mas com UX exemplar:**

```ts
const validateStep = async (step: number) => {
  const isValid = await trigger(fieldsForStep[step]);
  if (!isValid) {
    // 1. Scroll suave para primeiro erro
    const firstErrorField = Object.keys(errors)[0];
    document.querySelector(`[name="${firstErrorField}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // 2. Focus + shake animation
    const el = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
    el?.focus();
    el?.classList.add('animate-shake');
    setTimeout(() => el?.classList.remove('animate-shake'), 500);
    
    // 3. Toast específico
    toast.error(`Falta preencher: ${fieldLabels[firstErrorField]}`);
    return false;
  }
  return true;
};
```

**Tarefas:**
- [ ] Opção recomendada: remover validação bloqueante entre steps – validar só no submit
- [ ] OU: manter validação mas adicionar auto-scroll + focus + shake no campo com erro
- [ ] Substituir toast genérico "validationError" por mensagem específica do campo
- [ ] Adicionar contador discreto no step header: "2/3 campos" em vez de bloquear
- [ ] Campos com erro: `aria-invalid="true"` + `ring-red-500` bem visível
- [ ] Testar navegação com teclado: Tab → Enter no "Seguinte" funciona?

---

### F6 — AI Insights dispara a cada keystroke
**Severidade:** 🟡 P2

**Local:** `EnhancedTravelPreferencesForm.tsx` linhas 245–290

```ts
useEffect(() => {
  // ...
  fetch('/api/ai/preferences-insights', { 
    body: JSON.stringify({ preferences }) 
  })
}, [aiInsightsEnabled, locale, preferences]); // ← preferences = objeto inteiro do watch()
```

Cada clique num checkbox dispara debounce 1.5s → request. 10 cliques rápidos = 10 requests enfileirados.

**Correção:**

```ts
// Opção A – só on-demand com botão
const [aiInsights, setAiInsights] = useState<string | null>(null);

<button onClick={generateInsights} disabled={aiScore < 50}>
  <Sparkles className="w-4 h-4" />
  Gerar insights com IA ✨
</button>

// Opção B – só quando muda de step
useEffect(() => {
  if (aiInsightsEnabled && currentStep > 0) {
    generateInsights();
  }
}, [currentStep]); // não [preferences]

// Opção C – debounce mais agressivo + deep compare
const debouncedPrefs = useDebounce(preferences, 3000);
const prefsHash = useMemo(() => 
  JSON.stringify(pick(debouncedPrefs, ['travelStyles', 'budgetRange', 'preferredDestinations'])),
  [debouncedPrefs]
);
useEffect(() => { generateInsights(); }, [prefsHash]);
```

**Tarefas:**
- [ ] Trocar AI insights automático → botão "Gerar insights ✨" on-demand
- [ ] OU: disparar só quando muda de step, não a cada campo
- [ ] Se manter automático: aumentar debounce para 3000ms + fazer hash só dos 3 campos chave
- [ ] Adicionar loading skeleton no painel de insights (já existe – bom)
- [ ] Cache de insights no servidor: mesmo input → mesma resposta (usar `LlmCache` que já existe no schema)
- [ ] Monitorar: quantos requests/min ao `/api/ai/preferences-insights`? Target: < 1 por sessão

---

### F7 — Sem "saltar" / progresso só em localStorage
**Severidade:** 🟢 P3

Draft fica em localStorage. Troca de dispositivo = perde tudo. Não há "Guardar e continuar depois".

**Correção:**

```ts
// Auto-save no servidor a cada step completo
const saveDraftToServer = useDebouncedCallback(async (data) => {
  await fetch('/api/user/preferences/draft', {
    method: 'PUT',
    body: JSON.stringify({ preferences: data, step: currentStep }),
  });
}, 2000);

useEffect(() => {
  saveDraftToServer(preferences);
}, [preferences, currentStep]);
```

UI:
```tsx
<div className="flex justify-between items-center text-sm text-gray-500 mb-4">
  <span>Passo {currentStep + 1} de {totalSteps} · Falta ~{remainingMinutes} min</span>
  <button type="button" onClick={goNext} className="text-teal-600 hover:underline">
    Saltar este passo →
  </button>
</div>
```

**Tarefas:**
- [ ] Criar endpoint `PUT /api/user/preferences/draft` – guarda JSON parcial
- [ ] Auto-save no servidor (debounced 2s) além do localStorage
- [ ] Ao abrir o form: tentar carregar draft do servidor primeiro, fallback localStorage
- [ ] Botão "Saltar este passo →" em todos os steps exceto o 1º
- [ ] Indicador "Falta ~2 min" – `remainingSteps * 0.5 min`
- [ ] Botão "Guardar e continuar depois" → salva draft + redirect para dashboard
- [ ] Email de recuperação: se draft existe há >24h sem completar → "Continua de onde ficaste"

---

### F8 — Step indicators cortados em mobile
**Severidade:** 🟡 P2

**Local:** `EnhancedTravelPreferencesForm.tsx` linhas 430–490

```tsx
<div className="flex justify-between ... min-w-[min(100%,22rem)] overflow-x-auto">
  {steps.map(step => <button>...</button>)} {/* 6 círculos */}
</div>
```

Em iPhone SE (375px) os 6 círculos não cabem, scroll horizontal escondido.

**Correção:**

```tsx
{/* Mobile: só texto + barra */}
<div className="md:hidden text-center space-y-2">
  <p className="text-sm text-gray-600">
    Passo {currentStep + 1} de {totalSteps}
  </p>
  <p className="font-semibold">{steps[currentStep].label}</p>
  <Progress value={progress} className="h-2" />
</div>

{/* Desktop: círculos completos */}
<div className="hidden md:flex justify-between ...">
  {steps.map(step => (
    <button>...</button>
  ))}
</div>
```

**Tarefas:**
- [ ] Mobile (< md): esconder círculos, mostrar só "Passo 2 de 3: Orçamento" + progress bar
- [ ] Desktop (≥ md): manter círculos clicáveis
- [ ] Testar em: iPhone SE 375px, iPhone 14 390px, Pixel 412px
- [ ] Verificar que o step indicator não faz layout shift ao mudar de step
- [ ] Adicionar `aria-current="step"` + `aria-label` (já existe – bom, manter)

---

### F9 — Sem atalhos / smart defaults
**Severidade:** 🟡 P2

Cada campo vazio = 1 clique a mais. Com 35 campos = muito atrito.

**Smart defaults a implementar:**

| Campo | Default inteligente | Como obter |
|---|---|---|
| `nationality` | Detetar via IP / `navigator.language` | `Intl.Locale`, GeoIP |
| `currency` | Derivar da nacionalidade | PT → EUR, BR → BRL, US → USD |
| `preferredDestinations` | Sugerir populares do país do utilizador | `/api/travel/v1/destinations?trending=true&country=PT` |
| `languages` | `navigator.languages` | `[{ language: 'pt', proficiency: 'native' }]` |
| `cabinClass` | Se `travelStyles.includes('luxury')` → `'business'` | Lógica no `useEffect` |
| `dailyBudgetProfile` | Se `travelStyles.includes('luxury')` → `'luxo'` | idem |
| `seatPreference` | Default `'any'` em vez de obrigatório | Schema |
| `mealPreference` | Default `'any'` | Schema |

```ts
// src/lib/travel/smart-defaults.ts
export async function getSmartDefaults() {
  const locale = navigator.language; // "pt-PT"
  const country = new Intl.Locale(locale).region ?? 'PT'; // "PT"
  
  const CURRENCY_MAP: Record<string, string> = {
    PT: 'EUR', BR: 'BRL', US: 'USD', GB: 'GBP',
    // ...
  };

  // GeoIP fallback (opcional)
  const geoRes = await fetch('https://ipapi.co/json/').catch(() => null);
  const geoCountry = await geoRes?.json().catch(() => null);

  return {
    nationality: countryNameMap[country] ?? '',
    currency: CURRENCY_MAP[country] ?? 'EUR',
    languages: [{ 
      language: locale.split('-')[0], 
      proficiency: 'native' 
    }],
  };
}

// No form:
useEffect(() => {
  getSmartDefaults().then(defaults => {
    // só preenche se o campo ainda estiver vazio
    if (!getValues('nationality')) setValue('nationality', defaults.nationality);
    if (!getValues('currency')) setValue('currency', defaults.currency);
    // ...
  });
}, []);
```

**Tarefas:**
- [ ] Criar `src/lib/travel/smart-defaults.ts`
- [ ] Nacionalidade: detetar via `navigator.language` + GeoIP fallback
- [ ] Moeda: mapear país → moeda automaticamente
- [ ] Línguas: pré-preencher com `navigator.languages`
- [ ] Destinos: mostrar "Populares em Portugal" no topo do picker
- [ ] Cabin class / budget profile: inferir de `travelStyles`
  - `luxury` → cabin `business`, budget `luxo`
  - `backpacking` → cabin `economy`, budget `mochileiro`
- [ ] Aeroporto de origem: geolocalização → "Voar de Lisboa (LIS)?" [Sim] [Escolher outro]
- [ ] Contar cliques poupados: target ≥ 10 cliques evitados
- [ ] Permitir sempre override manual – defaults são sugestões, não bloqueios

---

### F10 — CTA final assustador
**Severidade:** 🟢 P3

**Atual:**
```tsx
<Button>
  {isProcessing ? (
    <>
      <Brain className="animate-pulse" />
      Processing with AI…
    </>
  ) : (
    <>
      <Check />
      Complete Profile
    </>
  )}
</Button>
```

"Complete Profile" + spinner "Processing with AI…" – parece que vai demorar. Na verdade faz um PUT + `setTimeout(600ms)` fake.

**Correção:**

```tsx
<Button
  type="submit"
  size="lg"
  className="gap-2 bg-gradient-to-r from-teal-600 to-orange-500 min-h-12"
>
  {isProcessing ? (
    <>
      <span className="animate-spin">✨</span>
      A preparar as tuas viagens…
    </>
  ) : (
    <>
      Ver as minhas viagens
      <ArrowRight className="w-5 h-5" />
    </>
  )}
</Button>
<p className="text-xs text-center text-gray-500 mt-2">
  É rápido – menos de 2 segundos
</p>
```

Princípios:
- CTA orientado a **resultado**, não a tarefa ("Ver as minhas viagens" > "Complete Profile")
- Sem "AI" / "Processing" assustador – utilizador quer viagens, não IA
- Seta → indica avanço, não fim
- Microcopy de reassurance: "É rápido"

**Tarefas:**
- [ ] Trocar texto do botão: `"Complete Profile"` → `"Ver as minhas viagens →"`
- [ ] Loading state: `"Processing with AI…"` → `"A preparar as tuas viagens…"`
- [ ] Remover `setTimeout(600)` artificial – se o PUT for rápido, avança logo
- [ ] Adicionar microcopy: "É rápido – menos de 2 segundos"
- [ ] Após submit bem-sucedido: redirect imediato para `/results`, sem delay de 900ms
- [ ] Toast de sucesso: mostrar **depois** do redirect, na página de resultados
  - `"As tuas preferências foram guardadas! Aqui estão as tuas viagens personalizadas ✨"`
- [ ] A/B test (futuro): "Ver viagens" vs "Descobrir destinos" vs "Começar"

---

## Resumo priorizado

### Impacto na conversão

| ID | Mudança | Impacto estimado | Esforço |
|---|---|---|---|
| F1 | Só 3 campos obrigatórios, resto com defaults | -60% abandono step 1 | M |
| F2 | 6 steps → 3 steps: Destino → Budget → Resultados | -40% tempo total | L |
| F5 | Validação não bloqueia navegação | -25% frustração | S |
| F4 | Budget slider → 4 chips rápidos | Mobile 3x mais rápido | S |
| F3 | Fundir Países+Continentes, autocomplete livre destinos | -50% cliques step 1 | M |
| F9 | Smart defaults (IP → país/moeda/aeroporto) | -10 cliques | S |
| F6 | AI insights on-demand, não auto | -90% requests API | S |
| F8 | Step indicator mobile simplificado | UX | S |
| F7 | Save draft no servidor + "saltar passo" | Retenção | M |
| F10 | CTA "Ver as minhas viagens" | +conversão | XS |

### Roadmap do formulário

**Sprint Form 1 – Conversão imediata (2–3 dias)**
- [x] F1 – Schema com 3 campos obrigatórios + defaults
- [x] F5 – Validação não bloqueia (ou com scroll+focus exemplar)
- [x] F10 – CTA orientado a resultado
- [x] F4 – Budget chips em vez de slider

**Sprint Form 2 – Fluidez (3–5 dias)**
- [x] F2 – Reduzir para 3 steps, resto em "Refinar"
- [x] F3 – Picker unificado Países/Continentes + autocomplete livre
- [x] F8 – Step indicator mobile simplificado
- [x] F9 – Smart defaults (país, moeda, línguas)

**Sprint Form 3 – Polimento (2–3 dias)**
- [x] F6 – AI insights on-demand
- [x] F7 – Draft no servidor + "saltar passo"
- [x] Testes E2E do fluxo completo com Playwright
- [x] Analytics: step drop-off, tempo por step, campos mais saltados

### Métricas a acompanhar

Adicionar no `PreferenceEvent` (já existe no schema):

```ts
// Track form funnel
preferenceEvent.create({
  preferenceType: 'form_step',
  action: 'step_completed',
  newValue: { step: 1, duration_ms: 42000, fields_filled: 3 },
  context: { sessionId, userAgent }
})

// Depois analisar:
// - Drop-off por step:  step0: 100% → step1: 68% → step2: 45% → submit: 31%
// - Tempo mediano por step
// - Campos mais vezes saltados
// - Taxa de conversão quick_form vs enhanced_form
```

**KPIs alvo:**

| Métrica | Atual (est.) | Alvo |
|---|---|---|
| Tempo até resultados | ~4 min | < 45 s |
| Cliques até resultados | 60+ | 8–12 |
| Abandono step 1 | ~50% | < 20% |
| Taxa conclusão | ~30% | > 65% |
| Campos médios preenchidos | 35 | 8 (quick) / 20 (completo) |
| Requests IA por sessão | ~8 | < 1 |

---

## Componentes propostos

### QuickPreferencesForm (novo)

```tsx
// src/app/components/pages/QuickPreferencesForm.tsx
// 3 steps, ~120 linhas, sem dependências pesadas

export function QuickPreferencesForm({ onComplete }: Props) {
  const [step, setStep] = useState<0|1|2>(0);
  const { register, handleSubmit, watch, setValue } = useForm<QuickStartPreferences>({
    defaultValues: useSmartDefaults(), // F9
  });

  return (
    <form onSubmit={handleSubmit(onComplete)}>
      {step === 0 && (
        <DestinationStep
          travelStyles={watch('travelStyles')}
          destinations={watch('preferredDestinations')}
          onNext={() => setStep(1)}
        />
      )}
      {step === 1 && (
        <BudgetStep
          profile={watch('dailyBudgetProfile')}
          range={watch('budgetRange')}
          onBack={() => setStep(0)}
          onSubmit={handleSubmit(onComplete)}
        />
      )}
    </form>
  );
}
```

Usar este como **formulário principal** em `/preferences/edit`.  
O `EnhancedTravelPreferencesForm` passa a ser `/preferences/advanced` – "Refinar preferências".

---

## Checklist de implementação completa

### Schema & Validação
- [ ] Criar `src/lib/travel/schemas/preferences.schema.ts`
- [ ] `quickStartSchema` com 3 campos obrigatórios
- [ ] `travelPreferencesSchema` com defaults em tudo
- [ ] Testes Zod: quick schema aceita mínimo, full schema preenche defaults

### UX / Flow
- [ ] Reduzir wizard para 3 steps
- [ ] Mover 32 campos avançados para painel "Refinar" em `/results`
- [ ] Validação não bloqueia navegação (ou scroll+focus exemplar)
- [ ] Botão "Saltar este passo →" em todos os steps
- [ ] Indicador "Falta ~X min"
- [ ] Step indicator mobile: só "Passo N de 3" + barra

### Componentes de input
- [ ] Países + Continentes → picker unificado com grupos
- [ ] Destinos → Combobox com `freeSolo=true`
- [ ] Budget range → 4 chips + slider opcional em `<details>`
- [ ] Travel Purpose → chips compactos em vez de cards grandes
- [ ] Cabin class → mover de BudgetSection para FlightAccommodationSection

### Smart defaults
- [ ] `nationality` ← `navigator.language` + GeoIP
- [ ] `currency` ← mapear país → moeda
- [ ] `languages` ← `navigator.languages`
- [ ] `cabinClass` / `dailyBudgetProfile` ← inferir de `travelStyles`
- [ ] Destinos populares do país do utilizador no topo do picker
- [ ] Aeroporto de origem via geolocalização

### Performance
- [ ] AI insights on-demand (botão) em vez de automático
- [ ] Debounce 3000ms + hash só dos campos chave (se manter auto)
- [ ] Cache de insights no servidor via `LlmCache`
- [ ] Draft auto-save no servidor (debounced 2s)

### CTA & Conversão
- [ ] Botão: `"Complete Profile"` → `"Ver as minhas viagens →"`
- [ ] Loading: `"Processing with AI…"` → `"A preparar as tuas viagens…"`
- [ ] Remover `setTimeout` artificial de 600ms + 900ms
- [ ] Toast de sucesso na página de resultados, não no form
- [ ] Microcopy: "É rápido – menos de 2 segundos"

### Acessibilidade & Mobile
- [ ] Step indicator simplificado em mobile
- [ ] Touch targets ≥ 44×44px
- [ ] `aria-invalid`, `aria-describedby` nos campos com erro
- [ ] Navegação por teclado completa
- [ ] Testar em iPhone SE, Pixel, iPad

### Analytics
- [ ] `PreferenceEvent` para cada `step_completed`
- [ ] Track: drop-off por step, tempo por step, campos saltados
- [ ] Dashboard: taxa conversão quick vs enhanced
- [ ] Meta: tempo até resultados < 45s, conclusão > 65%

---

*Documento gerado em 2026-06-24 – Auditoria UX Formulário AKMLEVA*  
*Ver também: `AUDIT-AKMLEVA.md` – auditoria técnica completa (backend, DB, APIs, UI)*
