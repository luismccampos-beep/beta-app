# Vídeos nos Cards de Destino – Plano de Implementação AKMLEVA

**Repositório:** `luismccampos-beep/beta-app`  
**Componente alvo:** `src/app/components/pages/DestinationDetailPage.tsx`  
**Data:** 2026-06-24  
**Stack:** Next.js 15 / Prisma / PostgreSQL Neon / Tailwind v4

> Documento complementar a:
> - `AUDIT-AKMLEVA.md` – auditoria técnica geral
> - `FORMULARIO-MELHORIAS.md` – UX do formulário
> - `DESTINATION-CARD-MELHORIAS.md` – imagens, traduções, vídeos (visão)

Este documento é **o plano de execução, por tarefas**, só para vídeos.

---

## 0. Visão geral

| Atual | Alvo |
|---|---|
| `videoUrl?: string` no `DestinationDetailData` – vazio | 1–2 vídeos CC verificados por destino |
| Sem tabela de vídeos na DB | `WvDestinationVideo` com attribution completa |
| Hero sempre imagem | Hero com toggle Foto / Vídeo – só se `isVerified=true` |
| Sem validação | CLIP zero-shot opcional no ml-service |
| LCP ~4s | LCP < 2.5s – vídeo só carrega on-demand |

**Fontes – 100% open-source / CC:**

| Fonte | Cobertura | Licença | Verificado? |
|---|---|---|---|
| **Wikimedia Commons** | ~30% destinos grandes | CC BY-SA | ✅ Sim |
| **Archive.org** | Histórico / docs | CC / Public Domain | ⚠️ Manual |
| **PeerTube / SepiaSearch** | Baixa | CC | ⚠️ Manual |
| **Coverr / Mixkit / Pexels Videos** | Alta | Free | ❌ Só com CLIP |

**Regra de ouro:** mais vale foto certa que vídeo errado. Hero vídeo **só se `isVerified=true`**.

---

## 1. Base de Dados

### V-DB-1 — Adicionar `wikidataId` em `WvDestination`

Sem QID não consegues ligar vídeos/imagens/traduções entre línguas.

**Tarefas:**
- [ ] Editar `prisma/schema.prisma`, model `WvDestination`, adicionar:
  ```prisma
  model WvDestination {
    id                Int      @id
    slug              String   @unique @db.VarChar(160)  // aumentar de 32 → 160
    lang              String   @default("pt") @db.VarChar(8)
    nome              String   @db.VarChar(255)
    paisCode          String   @map("pais_code") @db.Char(2)  // ISO 3166

    // --- NOVO ---
    wikidataId        String?  @map("wikidata_id") @db.VarChar(32)
    wikidataLabels    Json?    @map("wikidata_labels") @db.JsonB

    // ... resto dos campos existentes ...

    // --- NOVO: relações ---
    images            WvDestinationImage[]
    videos            WvDestinationVideo[]
    translations      DestinationTranslation[]
    slugRedirects     DestinationSlugRedirect[]

    @@unique([wikidataId, lang])
    @@unique([slug, lang])
    @@index([wikidataId])
    @@index([slug, lang])
    @@index([paisCode, lang])
    @@map("wv_destinations")
  }
  ```
- [ ] Atualizar `scripts/parse-wikivoyage-dump.py` – extrair QID:
  ```python
  import re
  def extract_wikidata_qid(wikitext: str) -> str | None:
      m = re.search(r'\[\[d:(Q\d+)\]\]|{{wikidata\|(Q\d+)}}', wikitext)
      return (m.group(1) or m.group(2)) if m else None
  ```
- [ ] Correr backfill para destinos já na DB – ver `docs/video-implementation/SCHEMA_PATCH.prisma`

### V-DB-2 — Criar model `WvDestinationVideo`

**Tarefas:**
- [ ] Adicionar ao `prisma/schema.prisma`:
  ```prisma
  model WvDestinationVideo {
    id          String  @id @default(cuid())
    destinoId   Int     @map("destino_id")

    url         String  @db.Text
    thumbUrl    String? @map("thumb_url") @db.Text
    posterUrl   String? @map("poster_url") @db.Text

    width       Int?
    height      Int?
    durationSec Int?    @map("duration_sec")
    fileSizeKb  Int?    @map("file_size_kb")

    // attribution – obrigatório CC
    author      String? @db.VarChar(255)
    license     String  @db.VarChar(100)
    source      String  @db.VarChar(32)   // 'wikimedia' | 'archive' | 'peertube' | 'coverr'
    sourceUrl   String? @map("source_url") @db.Text

    isVerified  Boolean @default(false) @map("is_verified")
    sortOrder   Int     @default(0) @map("sort_order")

    createdAt   DateTime @default(now()) @map("created_at")

    destino     WvDestination @relation(fields: [destinoId], references: [id], onDelete: Cascade)

    @@index([destinoId, sortOrder])
    @@map("wv_destination_videos")
  }
  ```
- [ ] Correr migração:
  ```bash
  npx prisma migrate dev --name destination_videos
  npx prisma generate
  ```
- [ ] Ficheiro de referência completo: `docs/video-implementation/SCHEMA_PATCH.prisma`

---

## 2. Enriquecimento – Script de vídeos Wikimedia

### V-ENRICH-1 — Script `enrich-destination-videos.mjs`

Busca vídeos no Wikimedia Commons via Wikidata QID → Commons Category (P373) → filtra `.webm/.ogv/.mp4`.

**Local do ficheiro pronto:** `docs/video-implementation/enrich-destination-videos.mjs`

Copiar para: `scripts/enrich-destination-videos.mjs`

**Funcionalidades:**
- `--lang=pt` – língua do catálogo a enriquecer
- `--limit=100` – nº de destinos
- `--country=PT` – filtrar por país
- `--dry-run` – não escreve na DB
- `--force` – reprocessa mesmo já tendo vídeo
- `--concurrency=3` – pedidos paralelos

**Filtros de qualidade aplicados:**
- Duração: 3s – 120s (rejeita clips < 3s e filmes longos)
- Só landscape (`width >= height`)
- Fonte = Wikimedia Commons → `isVerified = true` automático

**Comandos:**
```bash
# teste dry-run, 10 destinos
node scripts/enrich-destination-videos.mjs --dry-run --limit=10

# primeira passagem – top 200 destinos PT
node scripts/enrich-destination-videos.mjs --limit=200 --lang=pt

# só Portugal
node scripts/enrich-destination-videos.mjs --country=PT

# forçar reprocessamento
node scripts/enrich-destination-videos.mjs --force --limit=50
```

**Cobertura esperada:**
- Top 200 destinos: ~50–70 com pelo menos 1 vídeo verificado
- Destinos PT: ~15–25 vídeos
- Taxa global Wikimedia: ~25–35% dos destinos

**Tarefas:**
- [ ] Copiar `docs/video-implementation/enrich-destination-videos.mjs` → `scripts/enrich-destination-videos.mjs`
- [ ] `chmod +x scripts/enrich-destination-videos.mjs`
- [ ] Testar dry-run: `node scripts/enrich-destination-videos.mjs --dry-run --limit=10`
- [ ] Correr produção: `node scripts/enrich-destination-videos.mjs --limit=200`
- [ ] Verificar na DB:
  ```sql
  SELECT COUNT(DISTINCT destino_id) FROM wv_destination_videos WHERE is_verified = true;
  SELECT pais_code, COUNT(*) FROM wv_destinations d
  JOIN wv_destination_videos v ON v.destino_id = d.id
  GROUP BY pais_code ORDER BY COUNT(*) DESC;
  ```
- [ ] Cron semanal (opcional): `0 3 * * 0 node scripts/enrich-destination-videos.mjs --only-missing --limit=100`

### V-ENRICH-2 — Fontes extra (opcional)

Só depois de esgotar Wikimedia (~30% cobertura).

| Fonte | Script | Verificado? |
|---|---|---|
| Archive.org | `scripts/enrich-videos-archive.mjs` | ❌ `isVerified=false` |
| PeerTube / SepiaSearch | `scripts/enrich-videos-peertube.mjs` | ❌ `isVerified=false` |
| Coverr / Pexels | só com CLIP validation, score ≥ 0.7 | ⚠️ condicional |

**Tarefas (opcional):**
- [ ] Archive.org adapter – `https://archive.org/advancedsearch.php?q={city} AND mediatype:movies&output=json`
- [ ] PeerTube – `https://sepiasearch.org/api/v1/search/videos?search={city}`
- [ ] Guardar sempre com `isVerified=false`
- [ ] Nunca mostrar no hero se não verificado – só em galeria secundária

---

## 3. API

### V-API-1 — `GET /api/travel/v1/destinations/[slug]/videos`

**Ficheiro pronto:** `docs/video-implementation/route.videos.ts`  
**Copiar para:** `src/app/api/travel/v1/destinations/[slug]/videos/route.ts`

Resposta:
```json
{
  "ok": true,
  "count": 1,
  "videos": [{
    "url": "https://upload.wikimedia.org/.../Lisbon.webm",
    "thumbUrl": "https://...",
    "width": 1920, "height": 1080,
    "durationSec": 23,
    "author": "John Doe",
    "license": "CC BY-SA 4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lisbon.webm",
    "isVerified": true
  }]
}
```

**Tarefas:**
- [ ] Copiar `docs/video-implementation/route.videos.ts` → `src/app/api/travel/v1/destinations/[slug]/videos/route.ts`
- [ ] Verificar import do `parseDestinationSlug` – ajustar path se a tua versão for diferente
- [ ] Testar:
  ```bash
  curl http://localhost:3000/api/travel/v1/destinations/pt-42/videos
  ```
- [ ] `export const revalidate = 86400` – cache 24h, vídeos quase nunca mudam

### V-API-2 — Incluir vídeo no endpoint de detalhe do destino

Hoje `GET /api/travel/destinations/[slug]` devolve `DestinationDetailData` sem vídeos.

**Tarefas:**
- [ ] Editar `src/app/api/travel/destinations/[slug]/route.ts` (ou equivalente)
- [ ] Adicionar ao `select / include` do Prisma:
  ```ts
  const dest = await prisma.wvDestination.findFirst({
    where: { /* ... */ },
    include: {
      videos: {
        where: { isVerified: true },
        orderBy: { sortOrder: 'asc' },
        take: 1,
      }
    }
  });
  ```
- [ ] Mapear para `DestinationDetailData`:
  ```ts
  videos: dest.videos.map(v => ({
    url: v.url,
    thumbUrl: v.thumbUrl,
    width: v.width,
    height: v.height,
    author: v.author,
    license: v.license,
    sourceUrl: v.sourceUrl,
    isVerified: v.isVerified,
  }))
  ```
- [ ] Atualizar tipo `DestinationDetailData` em `DestinationDetailPage.tsx`:
  ```ts
  export type DestinationDetailData = {
    // ...
    videos?: {
      url: string;
      thumbUrl?: string | null;
      width?: number | null;
      height?: number | null;
      author?: string | null;
      license: string;
      sourceUrl?: string | null;
      isVerified: boolean;
    }[];
  }
  ```

---

## 4. Frontend

### V-UI-1 — Componente `DestinationVideoHero`

Substitui o hero atual da `DestinationDetailPage.tsx` (que tem parallax + toggle video manual com `showVideo` state espalhado).

**Ficheiro pronto:** `docs/video-implementation/DestinationVideoHero.tsx`  
**Copiar para:** `src/app/components/travel/DestinationVideoHero.tsx`

**Funcionalidades:**
- Se **não há vídeo verificado** → mostra só imagem, sem botão nenhum. Zero confusão.
- Se **há vídeo verificado** → hero com toggle Foto / Vídeo
- Controlos: Play/Pause, Mudo/Som
- Attribution sempre visível: `"Vídeo: John Doe · CC BY-SA 4.0 · fonte"`
- `prefers-reduced-motion` – esconde botão Vídeo automaticamente
- `next/image` para o poster / fallback foto
- Vídeo: `muted`, `autoplay` só após clique, `loop`, `playsInline`, `preload="metadata"`
- Fallback automático para imagem se o vídeo falhar

**Tarefas:**
- [ ] Copiar `docs/video-implementation/DestinationVideoHero.tsx` → `src/app/components/travel/DestinationVideoHero.tsx`
- [ ] Verificar imports:
  - `lucide-react` → já tens
  - `next/image` → já tens
  - Ajustar path do `cn()` se o teu `utils` estiver noutro sítio
- [ ] Se usas `next-intl`, trocar strings hardcoded `"Foto"` / `"Vídeo"` por `useTranslations()`

### V-UI-2 — Integrar no `DestinationDetailPage`

**Local:** `src/app/components/pages/DestinationDetailPage.tsx`

**Tarefas:**
- [ ] No topo do ficheiro, importar:
  ```ts
  import { DestinationVideoHero } from '../travel/DestinationVideoHero';
  ```
- [ ] Localizar o bloco hero atual (linhas ~270–380, `<div ref={heroRef} className="relative h-[50vh]…">`)
- [ ] Substituir o bloco hero inteiro por:
  ```tsx
  <DestinationVideoHero
    imageUrl={data.imageUrl}
    imageAlt={data.nome}
    video={data.videos?.[0] ?? null}
    attribution={data.imageAttribution}
  />
  ```
- [ ] Remover do `DestinationDetailPage` o state que passa a ser interno do componente:
  - Remover `const [showVideo, setShowVideo] = useState(false);`
  - Remover `heroRef`, `useScroll`, `heroY`, `heroOpacity` se só eram usados no hero (se o parallax for importante, o `DestinationVideoHero` pode receber uma prop `enableParallax`)
  - Remover o botão toggle Video/Foto duplicado
  - Remover a lógica de attribution duplicada
- [ ] Atualizar o fetch de dados (linha ~170):
  ```ts
  // antes
  fetch(`/api/travel/destinations/${encodeURIComponent(slug)}`)
  // garantir que a API já inclui videos – ver V-API-2
  ```
- [ ] Testar 3 cenários:
  1. Destino **com vídeo verificado** → aparece botão "Vídeo", funciona play/pause/mute
  2. Destino **sem vídeo** → só imagem, nenhum botão de vídeo aparece
  3. Destino **com vídeo não verificado** (`isVerified=false`) → NÃO mostra – só imagem

### V-UI-3 — `next.config.js` – `images.remotePatterns`

**Tarefas:**
- [ ] Editar `next.config.js`, adicionar:
  ```js
  const nextConfig = {
    images: {
      remotePatterns: [
        { protocol: 'https', hostname: 'upload.wikimedia.org' },
        { protocol: 'https', hostname: 'commons.wikimedia.org' },
        { protocol: 'https', hostname: '**.wikipedia.org' },
        // ... os que já tens: unsplash, openverse, etc.
      ],
      formats: ['image/avif', 'image/webp'],
    },
  }
  export default nextConfig;
  ```
- [ ] Isto é preciso para o `<Image>` do `DestinationVideoHero` carregar thumbs do Commons

### V-UI-4 — Acessibilidade e performance do vídeo

**Tarefas:**
- [ ] `prefers-reduced-motion` – esconder botão "Vídeo":
  ```ts
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // if (prefersReducedMotion) return <ImageOnlyHero ... />
  ```
- [ ] ARIA labels em todos os botões – já incluído no componente fornecido, verificar
- [ ] Keyboard: Space = play/pause, M = mute – opcional, nice-to-have
- [ ] `preload="metadata"` – NÃO `preload="auto"`, senão baixa o vídeo todo antes do clique
- [ ] Poster frame = `thumbUrl` do vídeo, fallback = `imageUrl` do destino
- [ ] `onError` no `<video>` → volta automaticamente para modo foto, sem toast
- [ ] Testar em: Chrome desktop, Safari iOS (playsInline!), Firefox, Android Chrome

---

## 5. Validação (opcional – se usares fontes não-Wikimedia)

### V-ML-1 — CLIP zero-shot no ml-service

Só necessário se fores buscar vídeos ao Coverr/Pexels/PeerTube.

Já documentado em `DESTINATION-CARD-MELHORIAS.md` § VAL-1 – o mesmo endpoint serve para imagens e vídeos (frame do poster).

**Tarefas (opcional):**
- [ ] ml-service: `POST /validate-image` com CLIP – já documentado
  - Adaptar para vídeo: extrair 1 frame do poster/thumbnail e classificar
- [ ] Só aceitar vídeos não-Wikimedia com `clip_score >= 0.7`
- [ ] Guardar sempre com `isVerified=false` se fonte != wikimedia
- [ ] Frontend nunca mostra no hero se `isVerified=false`

> Se ficares só com Wikimedia Commons, podes saltar esta secção inteira – Commons + Wikidata QID = 100% verificado por construção.

---

## 6. QA / Checklist final

### Teste funcional
- [ ] **Com vídeo verificado:** abre `/pt/destinations/pt/lisboa-q597` → aparece botão "Vídeo" → clica → vídeo toca muted, loop → botão Pause funciona → botão Som funciona → attribution "Vídeo: … / CC BY-SA" visível
- [ ] **Sem vídeo:** abre destino sem vídeo → só imagem, **nenhum** botão de vídeo aparece, nenhum layout shift
- [ ] **Vídeo falha a carregar:** simula 404 no .webm → volta automaticamente para imagem, sem erro visível ao utilizador
- [ ] **Mobile iOS:** vídeo toca inline (não fullscreen automático) – `playsInline` a funcionar
- [ ] **`prefers-reduced-motion`:** ativa nas definições do SO → botão "Vídeo" desaparece
- [ ] **Teclado only:** Tab até ao botão Vídeo → Enter → Space = play/pause

### Performance
- [ ] Lighthouse – LCP < 2.5s na página de destino
  - Vídeo NÃO deve contar para LCP – só a imagem poster conta
  - Confirmar: `preload="metadata"`, não `auto`
- [ ] Network tab: vídeo **não é descarregado** até o utilizador clicar "Vídeo"
- [ ] Next.js Image: hero / thumbnails a usar AVIF/WebP automaticamente
- [ ] Bundle: `DestinationVideoHero` < 5 KB gzipped (sem dependências externas)

### SEO / Legal
- [ ] Attribution sempre visível – autor + licença + link fonte (CC compliance)
- [ ] `<video>` tem `poster` attribute
- [ ] Schema.org `VideoObject` no JSON-LD da página (opcional, bom para SEO):
  ```json
  {
    "@type": "VideoObject",
    "name": "Lisboa – AKMLEVA",
    "thumbnailUrl": "https://...",
    "contentUrl": "https://upload.wikimedia.org/.../Lisbon.webm",
    "license": "https://creativecommons.org/licenses/by-sa/4.0/",
    "acquireLicensePage": "https://commons.wikimedia.org/wiki/File:Lisbon.webm"
  }
  ```
- [ ] Sitemap inclui páginas de destino com vídeo – Google descobre via `<video:video>`

### Dados
- [ ] `SELECT COUNT(DISTINCT destino_id) FROM wv_destination_videos WHERE is_verified = true;` → target ≥ 50 nos top 200 destinos
- [ ] Zero vídeos com `is_verified = true AND source NOT IN ('wikimedia')` – a menos que tenhas corrido CLIP validation
- [ ] Todos os vídeos têm `author`, `license`, `sourceUrl` preenchidos

---

## 7. Roadmap

### Sprint V1 – Schema + Enriquecimento (1 dia)
| ID | Tarefa |
|---|---|
| V-DB-1 | Adicionar `wikidataId` em `WvDestination` + `@@unique([wikidataId, lang])` |
| V-DB-2 | Criar model `WvDestinationVideo` → `prisma migrate` |
| V-ENRICH-1 | Copiar e correr `scripts/enrich-destination-videos.mjs --limit=200` |
| V-UI-3 | `next.config.js` – `images.remotePatterns` para Wikimedia |

**Entregável:** DB com vídeos CC verificados em ~50-70 destinos, prontos a consumir.

### Sprint V2 – API + Frontend (1 dia)
| ID | Tarefa |
|---|---|
| V-API-1 | `GET /api/travel/v1/destinations/[slug]/videos` |
| V-API-2 | Incluir `videos[]` no endpoint de detalhe do destino |
| V-UI-1 | Copiar `DestinationVideoHero.tsx` |
| V-UI-2 | Integrar no `DestinationDetailPage.tsx`, remover hero antigo |
| V-UI-4 | Acessibilidade: `prefers-reduced-motion`, ARIA, keyboard |

**Entregável:** Página de destino com toggle Foto/Vídeo funcional, só para vídeos verificados.

### Sprint V3 – QA + Polish (0.5 dia)
| ID | Tarefa |
|---|---|
| QA | Testes funcionais – 3 cenários (com vídeo / sem vídeo / vídeo falha) |
| QA | Performance – Lighthouse LCP < 2.5s |
| QA | SEO – VideoObject schema.org, sitemap |
| QA | Legal – attribution CC sempre visível |

**Entregável:** feature pronta para produção.

### Backlog
- [ ] V-ENRICH-2 – Archive.org / PeerTube adapter
- [ ] V-ML-1 – CLIP validation para fontes não-Wikimedia
- [ ] Galeria de vídeos (múltiplos) em vez de só 1 hero
- [ ] HLS / adaptive streaming para vídeos grandes (>10 MB)
- [ ] Upload de vídeos por utilizadores (com moderação)

---

## 8. Ficheiros

Todos os ficheiros de implementação estão prontos em `docs/video-implementation/`:

| Ficheiro | Destino final | Descrição |
|---|---|---|
| `SCHEMA_PATCH.prisma` | colar em `prisma/schema.prisma` | `WvDestinationVideo` + campos `wikidataId` em `WvDestination` |
| `enrich-destination-videos.mjs` | `scripts/enrich-destination-videos.mjs` | Script batch Wikimedia Commons |
| `route.videos.ts` | `src/app/api/travel/v1/destinations/[slug]/videos/route.ts` | API endpoint |
| `DestinationVideoHero.tsx` | `src/app/components/travel/DestinationVideoHero.tsx` | Componente React hero |

### Comandos rápidos

```bash
# 1. Schema
# colar o conteúdo de docs/video-implementation/SCHEMA_PATCH.prisma
# no teu prisma/schema.prisma
npx prisma migrate dev --name destination_videos
npx prisma generate

# 2. Enriquecimento
cp docs/video-implementation/enrich-destination-videos.mjs scripts/enrich-destination-videos.mjs
chmod +x scripts/enrich-destination-videos.mjs
node scripts/enrich-destination-videos.mjs --dry-run --limit=10
node scripts/enrich-destination-videos.mjs --limit=200

# 3. API
mkdir -p src/app/api/travel/v1/destinations/\[slug\]/videos
cp docs/video-implementation/route.videos.ts \
   src/app/api/travel/v1/destinations/\[slug\]/videos/route.ts

# 4. Frontend
cp docs/video-implementation/DestinationVideoHero.tsx \
   src/app/components/travel/DestinationVideoHero.tsx

# depois integrar no DestinationDetailPage.tsx – ver V-UI-2

# 5. Testar
npm run dev
# abrir http://localhost:3000/pt/destinations/pt/lisboa-q597
# curl http://localhost:3000/api/travel/v1/destinations/lisboa-q597/videos
```

---

## 9. KPIs

| Métrica | Antes | Alvo |
|---|---|---|
| Destinos com vídeo verificado | 0 | ≥ 50 (top 200) |
| Vídeo correto / verificado | N/A | 100% |
| Attribution CC completa | N/A | 100% |
| LCP página destino | ~4s | < 2.5s |
| Vídeo descarregado sem clique | – | 0 – só `preload="metadata"` |
| Lighthouse Performance | ~65 | > 90 |
| Lighthouse Accessibility | ~80 | > 95 |

---

*Documento gerado em 2026-06-24 – Implementação Vídeos AKMLEVA*  
*Ver também:*  
*- `AUDIT-AKMLEVA.md` – auditoria técnica geral*  
*- `FORMULARIO-MELHORIAS.md` – UX do formulário*  
*- `DESTINATION-CARD-MELHORIAS.md` – imagens, traduções, vídeos (visão completa)*
