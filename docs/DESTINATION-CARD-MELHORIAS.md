# Destination Card / Media – Imagens, Traduções, Vídeos

**Ficheiro(s):** `src/app/components/pages/DestinationDetailPage.tsx`, `src/lib/travel/destination-image.ts`  
**Data:** 2026-06-24  
**Âmbito:** Imagem principal do destino, galeria, traduções, vídeos, validação de media

---

## Sumário executivo

O catálogo Wikivoyage / Wikidata que já tens é excelente – é a base que quase ninguém tem. O problema está na camada de media em cima: o Unsplash é usado como fonte primária, faz search textual cego (`"Lisboa"` → pode vir `"Lisbon, Ohio"` ou um pastel de nata genérico), sem attribution, sem verificação.

| Métrica atual | Valor estimado |
|---|---|
| Fonte principal de imagem | Unsplash (search textual) |
| Taxa de imagem correta | ~60% |
| Imagens por destino | 1 |
| Attribution guardada | Não / parcial |
| Traduções | PT only / auto-translate |
| Vídeos | Campo existe, vazio |
| Validação de imagem | Nenhuma |

| Métrica alvo | Valor |
|---|---|
| Fonte principal | Wikimedia Commons / Wikidata P18 |
| Taxa de imagem correta | > 90% |
| Imagens por destino | 4–8 |
| Attribution | Completa (autor, licença, sourceUrl) |
| Traduções | Wikivoyage/Wikipedia nativo PT/EN/ES/FR |
| Vídeos | Wikimedia Commons, só se verificado |
| Validação | CLIP zero-shot no ml-service |

---

## Diagnóstico por área

### IMG-1 — Imagem principal: trocar Unsplash por Wikimedia / Wikidata
**Severidade:** 🔴 P0 – Imagem errada mata confiança

**Atual:** `resolveDestinationImageUrl(d)` → provavelmente Unsplash search por `nome`.

**Problema:** Search textual cego. `"Lisboa"` → pode vir Lisbon, Ohio / pastel de nata / azulejo genérico. Sem attribution. Licença comercial incerta.

**Correção – ordem de resolução com fallback:**

```
1. Wikimedia Commons P18 do Wikidata  ← imagem canónica, sempre certa
2. Wikivoyage pagebanner              ← feito para ser capa
3. Wikipedia lead image               ← via REST API /page/summary
4. Openverse (ex-CC Search)           ← filtrado por QID + licença CC
5. Unsplash / Pexels                  ← último recurso, com validação
```

1–3 são ligadas ao **Wikidata QID**, não a texto livre → imagem certa.

**Implementação:**

```ts
// src/lib/travel/images/resolve-destination-image.ts

export type ResolvedImage = {
  url: string;
  thumbUrl?: string;
  width?: number;
  height?: number;
  source: 'wikidata' | 'wikivoyage' | 'wikipedia' | 'openverse' | 'unsplash' | 'flickr';
  attribution: {
    author?: string;
    license: string;  // "CC BY-SA 4.0"
    sourceUrl: string;
  };
  isVerified: boolean;
};

export async function resolveDestinationImage(
  dest: { 
    nome: string; 
    paisCode: string; 
    wikidataId?: string | null;
    wikipediaUrl?: string | null;
  }
): Promise<ResolvedImage | null> {

  // ── 1. Wikidata P18 – imagem principal canónica ──
  if (dest.wikidataId) {
    try {
      const wd = await fetch(
        `https://www.wikidata.org/wiki/Special:EntityData/${dest.wikidataId}.json`,
        { next: { revalidate: 86400 * 30 } }
      ).then(r => r.json());
      
      const claims = wd.entities?.[dest.wikidataId]?.claims;
      const p18 = claims?.P18?.[0]?.mainsnak?.datavalue?.value as string | undefined;
      
      if (p18) {
        const filename = p18.replace(/ /g, '_');
        return {
          url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1600`,
          thumbUrl: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=400`,
          source: 'wikidata',
          attribution: {
            license: 'CC BY-SA',
            sourceUrl: `https://commons.wikimedia.org/wiki/File:${filename}`,
          },
          isVerified: true,
        };
      }
    } catch {}
  }

  // ── 2. Wikivoyage pagebanner ──
  // O teu parser do Wikivoyage já apanha listings.
  // Acrescentar extração do pagebanner no parse-wikivoyage-dump.py:
  // {{pagebanner|Lisbon skyline.jpg}}
  // Guardar em wv_destinations.imagem_banner
  // → já fica resolvido na DB, sem fetch em runtime

  // ── 3. Wikipedia REST – lead image ──
  if (dest.wikipediaUrl) {
    try {
      const match = dest.wikipediaUrl.match(/\/\/(\w+)\.wikipedia\.org\/wiki\/(.+)/);
      if (match) {
        const [, lang, title] = match;
        const sum = await fetch(
          `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${title}`,
          { next: { revalidate: 86400 * 7 } }
        ).then(r => r.json()).catch(() => null);
        
        if (sum?.thumbnail?.source) {
          return {
            url: sum.thumbnail.source.replace(/\/\d+px-/, '/1200px-'),
            thumbUrl: sum.thumbnail.source,
            width: sum.thumbnail.width,
            height: sum.thumbnail.height,
            source: 'wikipedia',
            attribution: {
              license: 'CC BY-SA',
              sourceUrl: sum.content_urls?.desktop?.page ?? dest.wikipediaUrl,
            },
            isVerified: true,
          };
        }
      }
    } catch {}
  }

  // ── 4. Openverse – CC search ──
  try {
    const ov = await fetch(
      `https://api.openverse.org/v1/images/?` +
      new URLSearchParams({
        q: `${dest.nome} ${dest.paisCode}`,
        license: 'cc0,by,by-sa',
        category: 'photograph',
        mature: 'false',
        page_size: '1',
      }),
      { next: { revalidate: 86400 * 7 } }
    ).then(r => r.json()).catch(() => null);

    if (ov?.results?.[0]) {
      const img = ov.results[0];
      return {
        url: img.url,
        thumbUrl: img.thumbnail,
        source: 'openverse',
        attribution: {
          author: img.creator,
          license: img.license,
          sourceUrl: img.foreign_landing_url,
        },
        isVerified: false,
      };
    }
  } catch {}

  // ── 5. Unsplash – último recurso ──
  return unsplashFallback(dest);
}

async function unsplashFallback(dest: { nome: string; paisCode: string }): Promise<ResolvedImage | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(dest.nome + ' ' + dest.paisCode + ' city')}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${key}` }, next: { revalidate: 86400 * 7 } }
    ).then(r => r.json());
    const p = res?.results?.[0];
    if (!p) return null;
    return {
      url: p.urls.regular,
      thumbUrl: p.urls.small,
      width: p.width,
      height: p.height,
      source: 'unsplash',
      attribution: {
        author: p.user?.name,
        license: 'Unsplash License',
        sourceUrl: p.links?.html,
      },
      isVerified: false,
    };
  } catch { return null; }
}
```

**Schema – acrescentar campos de attribution:**

```prisma
// prisma/schema.prisma – model WvDestination
model WvDestination {
  // ... campos existentes ...
  imagemUrl       String?  @map("imagem_url") @db.VarChar(500)
  imagemQuery     String?  @map("imagem_query") @db.VarChar(255)

  // --- acrescentar ---
  imagemFonte     String?  @map("imagem_fonte") @db.VarChar(32)
  // 'wikidata' | 'wikivoyage' | 'wikipedia' | 'openverse' | 'unsplash' | 'flickr'

  imagemAutor     String?  @map("imagem_autor") @db.VarChar(255)
  imagemLicenca   String?  @map("imagem_licenca") @db.VarChar(100)
  imagemSourceUrl String?  @map("imagem_source_url") @db.VarChar(500)
  imagemVerificada Boolean @default(false) @map("imagem_verificada")
  imagemWikidataId String? @map("imagem_wikidata_id") @db.VarChar(32)
  imagemLargura    Int?    @map("imagem_largura")
  imagemAltura     Int?    @map("imagem_altura")

  // relação 1:N para galeria – ver IMG-2
  images          WvDestinationImage[]
}
```

**Script de enriquecimento em batch:**

```bash
# scripts/enrich-destination-images-wikimedia.mjs
node scripts/enrich-destination-images-wikimedia.mjs \
  --source=wikidata \
  --only-missing \
  --concurrency=5 \
  --limit=100

# Opções:
# --source=wikidata|wikipedia|openverse|all
# --only-missing        só destinos sem imagem_verificada=true
# --force               reprocessa tudo
# --country=PT          filtrar por país
# --dry-run             não escreve na DB
# --concurrency=N       default 5
```

O script percorre `wv_destinations`, resolve via Wikidata → Wikipedia → Openverse, guarda com attribution completa, marca `imagemVerificada`.

**Tarefas:**
- [ ] Criar `src/lib/travel/images/resolve-destination-image.ts` com a cadeia Wikidata → Wikipedia → Openverse → Unsplash
- [ ] Adicionar campos `imagemFonte`, `imagemAutor`, `imagemLicenca`, `imagemSourceUrl`, `imagemVerificada`, `imagemLargura`, `imagemAltura` ao `schema.prisma` → `prisma migrate`
- [ ] Criar `scripts/enrich-destination-images-wikimedia.mjs` com flags `--source`, `--only-missing`, `--dry-run`, `--concurrency`
- [ ] Correr 1ª passagem: `--source=wikidata --only-missing` → ~70-80% cobertura, verificado
- [ ] 2ª passagem: `--source=wikipedia --only-missing` → +10%
- [ ] 3ª passagem: `--source=openverse --only-missing` → cobre o resto
- [ ] Atualizar `resolveDestinationImageUrl()` em `src/lib/travel/destination-image.ts` para ler da DB primeiro, só depois fazer fetch live
- [ ] Cron semanal: re-enriquecer destinos adicionados recentemente
- [ ] Medir: taxa de `imagemVerificada=true` antes/depois – target > 90%

---

### IMG-2 — Galeria: 1 imagem → 4–8 imagens por destino
**Severidade:** 🟠 P1 – Card pobre

**Atual:** `DestinationGallery` mostra `galleryImages ?? [imageUrl]` – normalmente 1 imagem.

**Fontes open source para galeria:**

| Fonte | Como obter | Qt. / destino | Licença |
|---|---|---|---|
| **Wikimedia Commons category** | `action=query&list=categorymembers&cmtitle=Category:Lisbon` | 10–200 | CC BY-SA, tudo atribuído |
| **Wikidata P18 + P41 + P94** | imagem, flag, coat of arms | 1–3 | CC |
| **Openverse** | `api.openverse.org/v1/images/` | ilimitado | CC0 / BY / BY-SA |
| **Flickr Commons** | instituições (BN, etc) | histórico | No known copyright |
| **Mapillary / Kartaview** | street-level | cobertura global | CC BY-SA |
| **Europeana** | museus europeus | cultural | CC / Public Domain |

**Implementação – Wikimedia Commons category via Wikidata P373:**

```ts
// src/lib/travel/images/commons-gallery.ts

export async function getCommonsGallery(
  wikidataId: string,
  limit = 8
): Promise<ResolvedImage[]> {
  // 1. Buscar categoria Commons via Wikidata P373
  const wd = await fetch(
    `https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`
  ).then(r => r.json());
  
  const claims = wd.entities?.[wikidataId]?.claims;
  const commonsCat = claims?.P373?.[0]?.mainsnak?.datavalue?.value as string | undefined;
  
  if (!commonsCat) return [];

  // 2. Listar ficheiros da categoria
  const cat = await fetch(
    `https://commons.wikimedia.org/w/api.php?` +
    new URLSearchParams({
      action: 'query',
      list: 'categorymembers',
      cmtitle: `Category:${commonsCat}`,
      cmtype: 'file',
      cmlimit: '40',
      format: 'json',
      origin: '*',
    })
  ).then(r => r.json());

  const files = (cat.query?.categorymembers ?? [])
    // filtra só jpg/jpeg, exclui maps/flags/svg/logos
    .filter((f: any) => /\.(jpe?g)$/i.test(f.title))
    .filter((f: any) => !/(map|flag|coat|logo|icon|symbol)/i.test(f.title))
    .slice(0, limit);

  return files.map((f: any) => {
    const filename = f.title.replace(/^File:/, '');
    return {
      url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1200`,
      thumbUrl: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=400`,
      source: 'wikimedia' as const,
      attribution: {
        license: 'CC BY-SA',
        sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(f.title)}`,
      },
      isVerified: true,
    };
  });
}
```

**Schema – tabela de imagens do destino:**

```prisma
model WvDestinationImage {
  id           String  @id @default(cuid())
  destinoId    Int     @map("destino_id")
  url          String  @db.Text
  thumbUrl     String? @map("thumb_url") @db.Text
  width        Int?
  height       Int?
  author       String? @db.VarChar(255)
  license      String  @db.VarChar(100)
  source       String  @db.VarChar(32)   // 'wikimedia' | 'openverse' | 'flickr' | ...
  sourceUrl    String? @map("source_url") @db.Text
  sortOrder    Int     @default(0) @map("sort_order")
  isPrimary    Boolean @default(false) @map("is_primary")

  destino      WvDestination @relation(fields: [destinoId], references: [id], onDelete: Cascade)

  @@index([destinoId, sortOrder])
  @@map("wv_destination_images")
}

// Adicionar na WvDestination:
model WvDestination {
  // ...
  images       WvDestinationImage[]
}
```

**Frontend – galeria com next/image:**

```tsx
// src/app/components/travel/DestinationGallery.tsx
import Image from 'next/image';

export function DestinationGallery({ images }: { images: ResolvedImage[] }) {
  // ...
  return (
    <div className="flex gap-3 overflow-x-auto snap-x">
      {images.map((img, i) => (
        <button key={img.url} onClick={() => openLightbox(i)}
          className="relative shrink-0 w-40 aspect-video rounded-xl overflow-hidden"
        >
          <Image
            src={img.thumbUrl ?? img.url}
            alt=""
            fill
            sizes="160px"
            className="object-cover"
            loading="lazy"
          />
        </button>
      ))}
    </div>
  );
  // Lightbox também com next/image
}
```

**Tarefas:**
- [ ] Criar model `WvDestinationImage` no `schema.prisma` → migrate
- [ ] Criar `src/lib/travel/images/commons-gallery.ts` – `getCommonsGallery(wikidataId)`
- [ ] Script `scripts/enrich-destination-gallery.mjs` – popula `wv_destination_images` via Commons P373
- [ ] Fallback Openverse se Commons der < 4 imagens
- [ ] Atualizar `DestinationGallery` para ler `destino.images[]` da DB
- [ ] Trocar `<img>` → `<Image>` na galeria + lightbox
- [ ] Mostrar attribution no hover / lightbox: "Foto por {author} / {license}"
- [ ] Ordenação: `isPrimary DESC, sortOrder ASC`
- [ ] Target: ≥ 4 imagens verificadas por destino nos top 500 destinos

---

### TRAD-1 — Traduções: parar de traduzir, usar o que já existe
**Severidade:** 🟠 P1

**Atual:** `WvDestination.lang = 'pt'`. Quando um utilizador EN/ES/FR abre Lisboa, provavelmente vê texto PT ou tradução automática inconsistente.

**O que existe de borla e certo:**

1. **Wikivoyage multi-língua** – o teu parser já faz `--lang both`, guarda `lang` na DB. Expande para EN/ES/FR. Mesmo destino, texto nativo.
   ```sql
   -- mesmo lugar, 4 línguas
   pt-lisboa-42, en-lisbon-42, es-lisboa-42, fr-lisbonne-42
   ```

2. **Wikipedia interlanguage** – resumo em 300 línguas via REST:
   ```
   https://pt.wikipedia.org/api/rest_v1/page/summary/Lisboa
   https://en.wikipedia.org/api/rest_v1/page/summary/Lisbon
   https://es.wikipedia.org/api/rest_v1/page/summary/Lisboa
   https://fr.wikipedia.org/api/rest_v1/page/summary/Lisbonne
   ```

3. **Wikidata labels/descriptions** – nome do lugar em 400 línguas:
   ```ts
   const labels = entity.labels;
   // labels.pt.value = "Lisboa"
   // labels.en.value = "Lisbon"
   // labels.ja.value = "リスボン"
   ```

4. **Tradução automática só como fallback** – LibreTranslate self-hosted (MIT), ou Argos Translate offline. Nunca API paga sem cache.

**Estratégia de resolução:**

```
1. wv_destinations WHERE id = X AND lang = userLang  ← nativo, perfeito
2. Fallback: wikipedia_resumo no idioma via Wikipedia REST
3. Fallback: Wikidata label/description
4. Último recurso: LibreTranslate + cache em translation_cache
```

**Schema:**

```prisma
model DestinationTranslation {
  destinoId  Int
  lang       String   @db.VarChar(8)
  nome       String?  @db.VarChar(255)
  descricao  String?  @db.Text
  resumo     String?  @db.Text
  fonte      String   @db.VarChar(32)
  // 'wikivoyage' | 'wikipedia' | 'wikidata' | 'libretranslate'
  verificado Boolean  @default(false)

  destino    WvDestination @relation(fields: [destinoId], references: [id], onDelete: Cascade)

  @@id([destinoId, lang])
  @@map("wv_destination_translations")
}

// Adicionar na WvDestination:
model WvDestination {
  // ...
  translations DestinationTranslation[]
}
```

**Resolver no código:**

```ts
// src/lib/travel/destination-i18n.ts
export async function getDestinationLocalized(
  destinoId: number,
  locale: string
): Promise<{ nome: string; descricao: string; fonte: string }> {
  // 1. Tentar Wikivoyage nativo
  const native = await prisma.wvDestination.findFirst({
    where: { id: destinoId, lang: locale }
  });
  if (native) return {
    nome: native.nome,
    descricao: native.descricao ?? '',
    fonte: 'wikivoyage'
  };

  // 2. Tradução guardada?
  const tr = await prisma.destinationTranslation.findUnique({
    where: { destinoId_lang: { destinoId, lang: locale } }
  });
  if (tr) return {
    nome: tr.nome ?? '',
    descricao: tr.descricao ?? '',
    fonte: tr.fonte
  };

  // 3. Wikipedia REST no idioma pedido
  const base = await prisma.wvDestination.findUnique({ where: { id: destinoId } });
  if (base?.wikipediaUrl) {
    // trocar pt.wikipedia.org → en.wikipedia.org via Wikidata sitelinks
    // ...
  }

  // 4. LibreTranslate + cache
  // ...
  return { nome: base!.nome, descricao: base!.descricao ?? '', fonte: 'original' };
}
```

**Tarefas:**
- [ ] Criar model `DestinationTranslation` no schema → migrate
- [ ] Expandir parser Wikivoyage para EN/ES/FR além de PT
  - [ ] `npm run wikivoyage:extract:en`
  - [ ] Mapear destinos equivalentes entre línguas via Wikidata QID
- [ ] Criar `src/lib/travel/destination-i18n.ts` com `getDestinationLocalized()`
- [ ] Integrar Wikipedia REST interlanguage fallback
  - [ ] Usar Wikidata sitelinks para encontrar o título correto em cada língua
  - [ ] Cache da resposta em `DestinationTranslation` com `fonte='wikipedia'`
- [ ] LibreTranslate self-hosted (opcional, fallback final)
  - [ ] `docker run -d -p 5000:5000 libretranslate/libretranslate`
  - [ ] Cache SEMPRE em `DestinationTranslation` com `fonte='libretranslate'`, `verificado=false`
  - [ ] Ou usar `LlmCache` que já existe no schema
- [ ] Atualizar `DestinationDetailPage` para pedir `?lang={locale}` e mostrar texto traduzido
- [ ] UI: badge discreto com fonte da tradução – "Traduzido automaticamente" se `verificado=false`
- [ ] Meta: cobertura PT/EN/ES/FR > 80% dos top 500 destinos via Wikivoyage/Wikipedia nativo (sem MT)

---

### VID-1 — Vídeos: só se for verificado
**Severidade:** 🟡 P2

Hoje `videoUrl?: string` existe em `DestinationDetailData` mas provavelmente vazio.

**Fontes gratuitas / CC:**

| Fonte | Tipo | Observações |
|---|---|---|
| **Wikimedia Commons** | Vídeos CC, drone/cidade | Poucos mas 100% certos – usar como primário |
| **Coverr / Mixkit / Pexels Videos** | Stock free | Mesmo problema do Unsplash – valida lugar |
| **PeerTube / Archive.org** | Travel docs CC | search API disponível |
| **Wikivoyage** | Sem vídeo nativo | – |

**Regra:** mais vale uma foto certa que um vídeo errado. Hero video só se `isVerified=true`.

**Implementação – Wikimedia Commons video:**

```ts
// Commons category → filtra video files
const cat = await fetch(
  `https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers` +
  `&cmtitle=Category:${commonsCat}&cmtype=file&format=json&origin=*`
).then(r => r.json());

const videos = cat.query.categorymembers
  .filter((f: any) => /\.(webm|ogv|mp4)$/i.test(f.title))
  .slice(0, 2);
```

**Schema:**

```prisma
model WvDestinationVideo {
  id         String  @id @default(cuid())
  destinoId  Int     @map("destino_id")
  url        String  @db.Text
  thumbUrl   String? @map("thumb_url") @db.Text
  durationSec Int?   @map("duration_sec")
  width      Int?
  height     Int?
  author     String? @db.VarChar(255)
  license    String  @db.VarChar(100)
  source     String  @db.VarChar(32)  // 'wikimedia' | 'coverr' | 'pexels'
  sourceUrl  String? @map("source_url") @db.Text
  isVerified Boolean @default(false) @map("is_verified")

  destino    WvDestination @relation(fields: [destinoId], references: [id], onDelete: Cascade)
  @@index([destinoId])
  @@map("wv_destination_videos")
}
```

**Frontend:**

```tsx
{hasVerifiedVideo ? (
  <video src={video.url} autoPlay muted loop playsInline className="h-full w-full object-cover" />
) : (
  <Image src={image.url} alt={dest.nome} fill priority className="object-cover" />
)}

// Toggle Video/Foto só aparece se hasVerifiedVideo === true
{hasVerifiedVideo && (
  <button onClick={() => setShowVideo(v => !v)}>
    {showVideo ? <Camera /> : <Play />}
    {showVideo ? 'Ver foto' : 'Ver vídeo'}
  </button>
)}
```

**Tarefas:**
- [ ] Criar model `WvDestinationVideo` → migrate
- [ ] Script `scripts/enrich-destination-videos.mjs` – busca Commons category, filtra video
- [ ] `DestinationDetailPage`: só mostra toggle Video/Foto se `video.isVerified === true`
- [ ] Se não houver vídeo verificado: esconde o toggle completamente
- [ ] Vídeo hero: `muted`, `autoplay`, `loop`, `playsInline`, com poster frame
- [ ] Fallback imediato para imagem se vídeo falhar a carregar
- [ ] Não usar Pexels/Coverr sem validação CLIP (ver VAL-1)

---

### VAL-1 — Validação de imagem: "é mesmo deste lugar?"
**Severidade:** 🟡 P2 – essencial se usares Unsplash/Openverse

É aqui que Unsplash falha sempre. Como garantir?

**Checklist de validação automática:**

```ts
// src/lib/travel/images/validate-image.ts

export type ImageValidation = {
  valid: boolean;
  score: number;  // 0-1
  reasons: string[];
};

export async function validateImage(
  dest: { nome: string; pais: string; latitude?: number; longitude?: number },
  image: { url: string; source: string; tags?: string[] }
): Promise<ImageValidation> {
  const reasons: string[] = [];
  let score = 0;

  // 1. Fontes confiáveis → auto-aprova
  if (['wikidata','wikipedia','wikivoyage'].includes(image.source)) {
    return { valid: true, score: 1.0, reasons: ['trusted_source'] };
  }

  // 2. GPS EXIF dentro de X km do destino?
  // (só Openverse/Flickr costumam ter)
  // ...

  // 3. Tags incluem nome da cidade + país?
  const tags = (image.tags ?? []).join(' ').toLowerCase();
  if (tags.includes(dest.nome.toLowerCase())) { score += 0.3; reasons.push('name_in_tags'); }
  if (tags.includes(dest.pais.toLowerCase())) { score += 0.2; reasons.push('country_in_tags'); }

  // 4. CLIP zero-shot – "does this show {city}, {country}?"
  // Corre no ml-service (FastAPI) – zero custo, local
  try {
    const clipRes = await fetch('http://ml-service:8000/validate-image', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        image_url: image.url,
        candidate_labels: [
          `${dest.nome}, ${dest.pais}`,
          'other place',
          'food',
          'generic travel',
        ]
      })
    }).then(r => r.json());
    
    const matchScore = clipRes.scores?.[0] ?? 0;
    score += matchScore * 0.5;
    reasons.push(`clip_score=${matchScore.toFixed(2)}`);
  } catch {
    // ml-service offline → não penaliza
  }

  // 5. Heurística nome de ficheiro
  const filename = image.url.toLowerCase();
  if (filename.includes(dest.nome.toLowerCase().replace(/\s+/g, ''))) {
    score += 0.15; reasons.push('name_in_filename');
  }
  // rejeita genéricos óbvios
  if (/\b(pasta|food|pizza|burger|beach_generic)\b/.test(filename)) {
    score -= 0.4; reasons.push('generic_filename');
  }

  return { valid: score >= 0.7, score, reasons };
}
```

**ml-service – endpoint CLIP:**

```python
# ml-service/app/api/validate_image.py
from fastapi import APIRouter
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import requests, torch

router = APIRouter()
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

@router.post("/validate-image")
def validate_image(image_url: str, candidate_labels: list[str]):
    img = Image.open(requests.get(image_url, stream=True, timeout=5).raw)
    inputs = processor(text=candidate_labels, images=img, return_tensors="pt", padding=True)
    outputs = model(**inputs)
    probs = outputs.logits_per_image.softmax(dim=1)[0].tolist()
    return {"scores": probs, "labels": candidate_labels}
```

Requirements: `transformers`, `torch`, `pillow` – adiciona em `ml-service/pyproject.toml`.

**Tarefas:**
- [ ] Criar `src/lib/travel/images/validate-image.ts` com heurísticas (tags, filename, trusted_source)
- [ ] ml-service: adicionar endpoint `POST /validate-image` com CLIP zero-shot
  - [ ] Adicionar `transformers`, `torch`, `pillow` ao `ml-service/pyproject.toml`
  - [ ] Endpoint aceita `image_url` + `candidate_labels[]` → retorna scores
  - [ ] Cache de resultados por image_url (evita re-validar)
- [ ] Integrar validação no `enrich-destination-images-wikimedia.mjs`
  - [ ] Imagens de `wikidata/wikipedia/wikivoyage` → `isVerified=true` automático
  - [ ] Imagens de `openverse/unsplash/flickr` → correr `validateImage()`, só aceita se `score >= 0.7`
- [ ] Guardar `imagemVerificada` boolean na DB – já incluído no schema IMG-1
- [ ] Frontend: badge discreto "✓ Imagem verificada" quando `isVerified=true`
- [ ] Galeria: ordenar por `isVerified DESC, sortOrder ASC` – imagens verificadas primeiro
- [ ] Dashboard admin (futuro): fila de revisão manual para imagens `isVerified=false` com score 0.5–0.7

---

### IMG-3 — Performance de imagens: next/image + blur
**Severidade:** 🟡 P2 – LCP killer

Já coberto em `AUDIT-AKMLEVA.md` § UI-5, mas reforço aqui porque é crítico para cards de destino.

**Atual:** `<img src={data.imageUrl}>` cru, sem responsive srcset, sem lazy loading automático, sem blur placeholder.

**Correção:**

```tsx
import Image from 'next/image';

// Hero – LCP, carrega prioritário
<Image
  src={data.imageUrl}
  alt={data.nome}
  fill
  priority
  sizes="100vw"
  placeholder="blur"
  blurDataURL={data.imageBlurDataUrl}
  className="object-cover"
/>

// Galeria – lazy
<Image
  src={img.thumbUrl}
  alt=""
  fill
  sizes="(max-width:768px) 40vw, 160px"
  loading="lazy"
  className="object-cover"
/>

// Card de destino na listagem
<Image
  src={dest.imageUrl}
  alt={dest.nome}
  width={400}
  height={225}
  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
/>
```

**next.config.js:**

```js
// next.config.js
export default {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'commons.wikimedia.org' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: '**.wikipedia.org' },
      { protocol: 'https', hostname: 'images.openverse.org' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'live.staticflickr.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  }
}
```

**Blur placeholder:**

Opção A – gerar no build:
```bash
npm install plaiceholder sharp
```
```ts
import { getPlaiceholder } from 'plaiceholder';
const { base64 } = await getPlaiceholder(imageUrl);
// guardar em wv_destination_images.blur_data_url
```

Opção B – usar thumb 20px do Commons como blur (já tens `thumbUrl`).

**Tarefas:**
- [ ] Trocar `<img>` → `<Image>` em:
  - [ ] `DestinationDetailPage` – hero (`priority={true}`)
  - [ ] `DestinationGallery` + lightbox
  - [ ] Cards de destino na listagem `/destinations`
  - [ ] Hotel cards
- [ ] Configurar `images.remotePatterns` no `next.config.js` (Wikimedia, Wikipedia, Openverse, Unsplash, Flickr)
- [ ] Adicionar `blurDataUrl` em `WvDestinationImage`
  - [ ] Gerar com `plaiceholder` no script de enriquecimento, OU
  - [ ] Usar `thumbUrl` 20px como blur placeholder
- [ ] Medir LCP antes/depois no Lighthouse – target < 2.5s
- [ ] `sizes` attribute correto em todas as imagens
- [ ] `loading="lazy"` automático via next/image (below the fold)

---

## Resumo priorizado

| ID | Ação | Esforço | Impacto |
|---|---|---|---|
| IMG-1 🔴 | **Wikidata/Wikipedia como fonte primária de imagem** + attribution na DB | 1 dia | Imagem certa em 80% dos destinos, licença limpa |
| IMG-1b 🔴 | **Guardar attribution completa** – autor, licença, sourceUrl | 2h | Legal compliance |
| GAL-1 🟠 | **Galeria 4–8 imagens via Commons category (Wikidata P373)** | 1–2 dias | Card muito mais rico |
| TRAD-1 🟠 | **Traduções via Wikipedia interlanguage + Wikidata labels** – tabela `DestinationTranslation` | 1 dia | i18n real PT/EN/ES/FR |
| IMG-2 🟠 | **Script enrich-destination-images-wikimedia.mjs** – batch com `imagemVerificada` flag | 1 dia | catálogo todo coberto |
| VAL-1 🟡 | **Validação CLIP no ml-service** – filtra Unsplash/Openverse falsos positivos | 1 dia | qualidade |
| VID-1 🟡 | **Vídeo Wikimedia Commons, só se verificado** | 4h | sem vídeos errados |
| IMG-3 🟡 | **next/image + blur placeholder** | 2h | LCP < 2.5s |
| GAL-2 🟢 | **Openverse / Flickr Commons como fallback** | 4h | cobertura 20% restante |
| GAL-3 🟢 | **Mapillary street view embed** | 1 dia | "ver como é lá" |

---

## Roadmap

### Sprint Media 1 – Imagem certa (1–2 dias)

| ID | Tarefa |
|---|---|
| IMG-1 | `resolve-destination-image.ts` – cadeia Wikidata → Wikipedia → Openverse → Unsplash |
| IMG-1b | Schema: `imagemFonte`, `imagemAutor`, `imagemLicenca`, `imagemSourceUrl`, `imagemVerificada`, etc. → migrate |
| IMG-1b | Script `enrich-destination-images-wikimedia.mjs` – batch, `--only-missing`, `--dry-run` |
| IMG-1b | Correr: wikidata → wikipedia → openverse. Target: `imagemVerificada=true` em > 90% |
| IMG-3 | `next/image` no hero + galeria + cards, com `remotePatterns` configurado |

### Sprint Media 2 – Galeria + Traduções (2–3 dias)

| ID | Tarefa |
|---|---|
| GAL-1 | Model `WvDestinationImage` → migrate |
| GAL-1 | `getCommonsGallery(wikidataId)` via P373 |
| GAL-1 | Script `enrich-destination-gallery.mjs` |
| GAL-1 | `DestinationGallery` lê `destino.images[]`, mostra attribution |
| TRAD-1 | Model `DestinationTranslation` → migrate |
| TRAD-1 | Expandir parser Wikivoyage EN/ES/FR |
| TRAD-1 | `getDestinationLocalized(destinoId, locale)` – Wikivoyage → Wikipedia → Wikidata → LibreTranslate |
| TRAD-1 | UI: badge "Traduzido automaticamente" se `verificado=false` |

### Sprint Media 3 – Validação + Vídeo (1–2 dias)

| ID | Tarefa |
|---|---|
| VAL-1 | `validate-image.ts` – heurísticas tags/filename/trusted_source |
| VAL-1 | ml-service: `POST /validate-image` com CLIP zero-shot |
| VAL-1 | Integrar no script de enriquecimento – só aceita score ≥ 0.7 |
| VAL-1 | Frontend badge "✓ Imagem verificada", ordenar galeria por `isVerified DESC` |
| VID-1 | Model `WvDestinationVideo` → migrate |
| VID-1 | Script `enrich-destination-videos.mjs` – Commons category, filtra video |
| VID-1 | `DestinationDetailPage`: toggle Video/Foto só se `isVerified=true` |

### Backlog

- [ ] GAL-2 – Openverse / Flickr Commons fallback para destinos sem Commons category rica
- [ ] GAL-3 – Mapillary / Kartaview street view embed
- [ ] IMG-3 – Blur placeholder com `plaiceholder` gerado no build
- [ ] TRAD-1 – LibreTranslate self-hosted como fallback final
- [ ] VAL-1 – Dashboard admin para revisão manual de imagens `score 0.5–0.7`
- [ ] Europeana API – imagens culturais/históricas para destinos europeus

---

## Schema – resumo das alterações

Adicionar ao `prisma/schema.prisma`:

```prisma
// ========== WvDestination – acrescentar campos ==========
model WvDestination {
  // ... existente ...
  imagemUrl        String?  @map("imagem_url") @db.VarChar(500)
  imagemQuery      String?  @map("imagem_query") @db.VarChar(255)

  // NOVO – attribution
  imagemFonte      String?  @map("imagem_fonte") @db.VarChar(32)
  imagemAutor      String?  @map("imagem_autor") @db.VarChar(255)
  imagemLicenca    String?  @map("imagem_licenca") @db.VarChar(100)
  imagemSourceUrl  String?  @map("imagem_source_url") @db.VarChar(500)
  imagemVerificada Boolean  @default(false) @map("imagem_verificada")
  imagemWikidataId String?  @map("imagem_wikidata_id") @db.VarChar(32)
  imagemLargura    Int?     @map("imagem_largura")
  imagemAltura     Int?     @map("imagem_altura")

  // NOVO – relações
  images           WvDestinationImage[]
  videos           WvDestinationVideo[]
  translations     DestinationTranslation[]
}

// ========== NOVO – Galeria ==========
model WvDestinationImage {
  id           String  @id @default(cuid())
  destinoId    Int     @map("destino_id")
  url          String  @db.Text
  thumbUrl     String? @map("thumb_url") @db.Text
  blurDataUrl  String? @map("blur_data_url") @db.Text
  width        Int?
  height       Int?
  author       String? @db.VarChar(255)
  license      String  @db.VarChar(100)
  source       String  @db.VarChar(32)
  sourceUrl    String? @map("source_url") @db.Text
  sortOrder    Int     @default(0) @map("sort_order")
  isPrimary    Boolean @default(false) @map("is_primary")

  destino      WvDestination @relation(fields: [destinoId], references: [id], onDelete: Cascade)
  @@index([destinoId, sortOrder])
  @@map("wv_destination_images")
}

// ========== NOVO – Vídeos ==========
model WvDestinationVideo {
  id          String  @id @default(cuid())
  destinoId   Int     @map("destino_id")
  url         String  @db.Text
  thumbUrl    String? @map("thumb_url") @db.Text
  durationSec Int?    @map("duration_sec")
  width       Int?
  height      Int?
  author      String? @db.VarChar(255)
  license     String  @db.VarChar(100)
  source      String  @db.VarChar(32)
  sourceUrl   String? @map("source_url") @db.Text
  isVerified  Boolean @default(false) @map("is_verified")

  destino     WvDestination @relation(fields: [destinoId], references: [id], onDelete: Cascade)
  @@index([destinoId])
  @@map("wv_destination_videos")
}

// ========== NOVO – Traduções ==========
model DestinationTranslation {
  destinoId  Int
  lang       String   @db.VarChar(8)
  nome       String?  @db.VarChar(255)
  descricao  String?  @db.Text
  resumo     String?  @db.Text
  fonte      String   @db.VarChar(32)
  // 'wikivoyage' | 'wikipedia' | 'wikidata' | 'libretranslate'
  verificado Boolean  @default(false)

  destino    WvDestination @relation(fields: [destinoId], references: [id], onDelete: Cascade)
  @@id([destinoId, lang])
  @@map("wv_destination_translations")
}
```

Após editar o schema:
```bash
npx prisma migrate dev --name destination_media_enrichment
npx prisma generate
```

---

## Ficheiros a criar

```
src/lib/travel/images/
  resolve-destination-image.ts   # IMG-1 – Wikidata → Wikipedia → Openverse → Unsplash
  commons-gallery.ts             # GAL-1 – getCommonsGallery(wikidataId)
  validate-image.ts              # VAL-1 – heurísticas + CLIP
  openverse.ts                   # GAL-2 – fallback Openverse

src/lib/travel/
  destination-i18n.ts            # TRAD-1 – getDestinationLocalized()

scripts/
  enrich-destination-images-wikimedia.mjs   # IMG-1
  enrich-destination-gallery.mjs            # GAL-1
  enrich-destination-videos.mjs             # VID-1
  enrich-destination-translations.mjs       # TRAD-1

ml-service/app/api/
  validate_image.py              # VAL-1 – CLIP zero-shot
```

---

## KPIs

| Métrica | Atual | Alvo |
|---|---|---|
| Imagem principal correta | ~60% | > 90% |
| Imagens por destino | 1 | 4–8 |
| Imagens com attribution completa | ~0% | 100% |
| Imagens verificadas | 0% | > 90% |
| Traduções PT/EN/ES/FR (top 500) | PT only | > 80% nativo |
| Vídeos verificados | 0 | top 100 destinos |
| LCP Destination page | ~4s | < 2.5s |
| Lighthouse Performance | ~65 | > 90 |

---

*Documento gerado em 2026-06-24 – Auditoria Destination Card / Media AKMLEVA*  
*Ver também:*  
*- `AUDIT-AKMLEVA.md` – auditoria técnica completa (backend, DB, APIs, UI)*  
*- `FORMULARIO-MELHORIAS.md` – auditoria UX do formulário de preferências*
