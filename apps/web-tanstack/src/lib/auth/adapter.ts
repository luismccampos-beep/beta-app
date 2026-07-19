import { prisma } from '@akmleva/db'

function getPrismaModel(model: string) {
  switch (model) {
    case 'user': return prisma.user as any
    case 'session': return prisma.session as any
    case 'account': return prisma.account as any
    case 'verification': return prisma.emailVerificationToken as any
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

function mapOutput(data: any): any {
  if (!data) return null
  const result = { ...data }
  if ('avatar' in result) {
    result.image = result.avatar
  }
  return result
}

export const customPrismaAdapter = () => {
  return (opts: any) => ({
    create: async ({ data, model }: any) => {
      const mapped = mapFieldsToDb(data)
      const created = await getPrismaModel(model).create({ data: mapped })
      return mapOutput(created)
    },
    update: async ({ model, where, update }: any) => {
      const mapped = mapFieldsToDb(update)
      const whereClause: any = {}
      if (where?.length) {
        for (const w of where) {
          whereClause[mapField(w.field)] = w.value
        }
      }
      const updated = await getPrismaModel(model).update({ where: whereClause, data: mapped })
      return mapOutput(updated)
    },
    updateMany: async ({ model, where, update }: any) => {
      const mapped = mapFieldsToDb(update)
      const whereClause: any = {}
      if (where?.length) {
        for (const w of where) {
          whereClause[mapField(w.field)] = w.value
        }
      }
      const result = await getPrismaModel(model).updateMany({ where: whereClause, data: mapped })
      return result.count
    },
    delete: async ({ model, where }: any) => {
      const whereClause: any = {}
      if (where?.length) {
        for (const w of where) {
          whereClause[mapField(w.field)] = w.value
        }
      }
      await getPrismaModel(model).delete({ where: whereClause })
    },
    deleteMany: async ({ model, where }: any) => {
      const whereClause: any = {}
      if (where?.length) {
        for (const w of where) {
          whereClause[mapField(w.field)] = w.value
        }
      }
      const result = await getPrismaModel(model).deleteMany({ where: whereClause })
      return result.count
    },
    findOne: async ({ model, where }: any) => {
      const whereClause: any = {}
      if (where?.length) {
        for (const w of where) {
          whereClause[mapField(w.field)] = w.value
        }
      }
      const result = await getPrismaModel(model).findFirst({ where: whereClause })
      return mapOutput(result)
    },
    findMany: async ({ model, where, limit, offset, sortBy }: any) => {
      const whereClause: any = {}
      if (where?.length) {
        for (const w of where) {
          whereClause[mapField(w.field)] = w.value
        }
      }
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
    count: async ({ model, where }: any) => {
      const whereClause: any = {}
      if (where?.length) {
        for (const w of where) {
          whereClause[mapField(w.field)] = w.value
        }
      }
      return getPrismaModel(model).count({ where: whereClause })
    },
  })
}
