fix(prisma): corrigir stub mode em build (P1001 no Vercel)

O stub em src/lib/prisma.ts que existia antes (process.env.NEXT_PHASE
=== 'build') estava muerto: o Next.js durante next build define
NEXT_PHASE para 'phase-production-build', nao 'build'. Resultado: o
stub nunca disparava e o Vercel tentava abrir ligacao Postgres durante
SSG pre-render, falhando com P1001 (Can't reach database server).

Mudancas:

* Detecao correta: phase-...startsWith && -build endWith cobre
  tanto 'phase-production-build' como 'phase-development-build'. Em
 conjunto com DISABLE_SSR_FETCH=true (que o vercel-build ja passa via
  cross-env), o stub dispara confiavelmente em build.
* Removida a clausula VERCEL_ENV === 'preview' que quebrava preview
  deploys em runtime (NEXT_PHASE no runtime = phase-production-server,
  nao build, entao isStubMode ficaria true em runtime e devolveria []
  para todas as queries).
* Stub passa a lancar (em vez de devolver [] silenciosamente) em
  metodos de mutacao: create, createMany, update, updateMany, upsert,
  delete, deleteMany, executeRaw, executeRawUnsafe, $executeRaw,
  $executeRawUnsafe, $transaction. Se uma pagina acidentalmente
  escrever durante SSG, o erro e agora visivel em vez de mascarado.
* Reads (findMany, findUnique, count, aggregate, $queryRaw, ...) continuam
  a devolver Promise<[]> como antes, deixando o build fazer
  pre-render sem tocar na DB.

Validacao: prisma validate OK, tsc strict OK, smoke confirma que $executeRawUnsafe agora lanca, $queryRaw continua read-only. Stub nao afeta dev local (NEXT_PHASE=phase-development-server, sem DISABLE_SSR_FETCH) nem preview runtime.
