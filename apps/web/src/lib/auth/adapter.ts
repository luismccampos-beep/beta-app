import { prisma } from '@akmleva/db'

interface WhereClause {
  field: string
  value: unknown
}

interface SortBy {
  field: string
  direction: 'asc' | 'desc'
}

interface AdapterMethodArgs {
  model: string
  data?: Record<string, unknown>
  where?: WhereClause[]
  update?: Record<string, unknown>
  limit?: number
  offset?: number
  sortBy?: SortBy
}

interface AdapterResult {
  [key: string]: unknown
}

type PrismaModel = {
  create: (args: { data: Record<string, unknown> }) => Promise<AdapterResult>
  update: (args: { where: Record<string, unknown>; data: Record<string, unknown> }) => Promise<AdapterResult>
  updateMany: (args: { where: Record<string, unknown>; data: Record<string, unknown> }) => Promise<{ count: number }>
  delete: (args: { where: Record<string, unknown> }) => Promise<void>
  deleteMany: (args: { where: Record<string, unknown> }) => Promise<{ count: number }>
  findFirst: (args: { where: Record<string, unknown> }) => Promise<AdapterResult | null>
  findMany: (args: { where: Record<string, unknown>; take?: number; skip?: number; orderBy?: Record<string, unknown> }) => Promise<AdapterResult[]>
  count: (args: { where: Record<string, unknown> }) => Promise<number>
}

function getPrismaModel(model: string): PrismaModel {
  switch (model) {
    case 'user': return prisma.user as unknown as PrismaModel
    case 'session': return prisma.session as unknown as PrismaModel
    case 'account': return prisma.account as unknown as PrismaModel
    case 'verification': return prisma.emailVerificationToken as unknown as PrismaModel
    default: throw new Error(`Unknown model: ${model}`)
  }
}

function mapField(field: string): string {
  const map: Record<string, string> = {
    image: 'avatar',
  }
  return map[field] ?? field
}

function mapFieldsToDb(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    result[mapField(key)] = value
  }
  return result
}

function mapOutput(data: AdapterResult | null): AdapterResult | null {
  if (!data) return null
  const result = { ...data }
  if ('avatar' in result) {
    result.image = result.avatar
  }
  return result
}

function buildWhereClause(where?: WhereClause[]): Record<string, unknown> {
  const whereClause: Record<string, unknown> = {}
  if (where?.length) {
    for (const w of where) {
      whereClause[mapField(w.field)] = w.value
    }
  }
  return whereClause
}

export const customPrismaAdapter = () => {
  return (_opts: Record<string, unknown>) => ({
    create: async ({ data, model }: AdapterMethodArgs) => {
      const mapped = mapFieldsToDb(data ?? {})
      const created = await getPrismaModel(model).create({ data: mapped })
      return mapOutput(created)
    },
    update: async ({ model, where, update }: AdapterMethodArgs) => {
      const mapped = mapFieldsToDb(update ?? {})
      const whereClause = buildWhereClause(where)
      const updated = await getPrismaModel(model).update({ where: whereClause, data: mapped })
      return mapOutput(updated)
    },
    updateMany: async ({ model, where, update }: AdapterMethodArgs) => {
      const mapped = mapFieldsToDb(update ?? {})
      const whereClause = buildWhereClause(where)
      const result = await getPrismaModel(model).updateMany({ where: whereClause, data: mapped })
      return result.count
    },
    delete: async ({ model, where }: AdapterMethodArgs) => {
      const whereClause = buildWhereClause(where)
      await getPrismaModel(model).delete({ where: whereClause })
    },
    deleteMany: async ({ model, where }: AdapterMethodArgs) => {
      const whereClause = buildWhereClause(where)
      const result = await getPrismaModel(model).deleteMany({ where: whereClause })
      return result.count
    },
    findOne: async ({ model, where }: AdapterMethodArgs) => {
      const whereClause = buildWhereClause(where)
      const result = await getPrismaModel(model).findFirst({ where: whereClause })
      return mapOutput(result)
    },
    findMany: async ({ model, where, limit, offset, sortBy }: AdapterMethodArgs) => {
      const whereClause = buildWhereClause(where)
      const orderBy = sortBy
        ? { [mapField(sortBy.field)]: sortBy.direction }
        : undefined
      const results = await getPrismaModel(model).findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy,
      })
      return results.map(mapOutput)
    },
    count: async ({ model, where }: AdapterMethodArgs) => {
      const whereClause = buildWhereClause(where)
      return getPrismaModel(model).count({ where: whereClause })
    },
  })
}
