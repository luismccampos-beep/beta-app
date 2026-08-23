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

/**
 * better-auth field name -> Prisma model field name, per model.
 * better-auth uses camelCase fields (providerId, accessToken, …) that differ
 * from the Prisma schema (provider, access_token, …). Mapping here keeps the
 * Prisma `create`/`update`/`findOne` calls from failing with unknown args.
 */
const MODEL_FIELD_MAPS: Record<string, Record<string, string>> = {
  user: {
    image: 'avatar',
  },
  session: {},
  account: {
    accountId: 'providerAccountId',
    providerId: 'provider',
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    accessTokenExpiresAt: 'expires_at',
    refreshTokenExpiresAt: 'expires_at',
    idToken: 'id_token',
  },
  verification: {
    id: 'tokenId',
  },
}

/**
 * Only these fields are valid on the Prisma model. better-auth sends fields
 * that don't exist as columns (updatedAt, userAgent, …); we drop them so the
 * write never fails with an unknown-arg error.
 */
const MODEL_ALLOWED_FIELDS: Record<string, Set<string>> = {
  user: new Set([
    'id', 'email', 'password', 'name', 'username', 'agencyId',
    'avatar', 'avatarThumbnail', 'avatarUrl', 'bio', 'location', 'phone',
    'birthDate', 'gender', 'taxId', 'address', 'city', 'state', 'country',
    'postalCode', 'status', 'role', 'joinDate', 'lastActive', 'lastLogin',
    'isVerified', 'emailVerified', 'phoneVerified', 'emailVerifiedAt',
    'emailVerificationToken', 'passwordChangedAt', 'twoFactorSecret', 'twoFactorEnabled',
    'twoFactorBackupCode',
    'preferredCurrency', 'preferredLanguage', 'travelFrequency', 'timezone',
    'theme', 'termsAccepted', 'privacyAccepted', 'acceptedTermsDate',
    'acceptedPrivacyDate', 'marketingOptIn', 'dataProcessingOptIn',
    'dataRetentionConsent', 'gdprConsent', 'profileCompletion',
    'experiencePoints', 'streakCount', 'deletedAt', 'deactivatedAt',
    'blockedAt', 'blockedReason', 'isActive', 'permissions',
  ]),
  session: new Set([
    'id', 'userId', 'token', 'refreshToken', 'deviceInfo',
    'deviceFingerprint', 'ipAddress', 'ipHash', 'refreshTokenFamily',
    'tokenSequence', 'expiresAt', 'createdAt', 'lastUsedAt', 'lastActivityAt',
    'revokedAt', 'isRevoked', 'securityFlags',
  ]),
  account: new Set([
    'id', 'userId', 'type', 'provider', 'providerAccountId',
    'refresh_token', 'access_token', 'expires_at', 'token_type', 'scope',
    'id_token', 'session_state', 'createdAt', 'updatedAt',
  ]),
  verification: new Set([
    'tokenId', 'userId', 'token', 'email', 'expiresAt', 'createdAt', 'updatedAt',
  ]),
}

function mapField(model: string, field: string): string {
  return MODEL_FIELD_MAPS[model]?.[field] ?? field
}

function mapFieldsToDb(model: string, data: Record<string, unknown>): Record<string, unknown> {
  const allowed = MODEL_ALLOWED_FIELDS[model]
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (allowed && !allowed.has(key)) continue
    const mapped = mapField(model, key)
    if (mapped === 'expires_at' && 'expires_at' in result) continue
    result[mapped] = value
  }
  if (model === 'session') {
    const sessionData = data as Record<string, unknown>
    if (sessionData.userAgent !== undefined && result.deviceInfo === undefined) {
      result.deviceInfo = { userAgent: sessionData.userAgent }
    }
  }
  return result
}

const OUTPUT_FIELD_MAPS: Record<string, Record<string, string>> = {
  user: { avatar: 'image' },
  account: {
    providerAccountId: 'accountId',
    provider: 'providerId',
    access_token: 'accessToken',
    refresh_token: 'refreshToken',
    expires_at: 'accessTokenExpiresAt',
    id_token: 'idToken',
  },
}

function mapOutput(model: string, data: AdapterResult | null): AdapterResult | null {
  if (!data) return null
  const result = { ...data }
  const map = OUTPUT_FIELD_MAPS[model]
  if (map) {
    for (const [dbKey, outKey] of Object.entries(map)) {
      if (dbKey in result && !(outKey in result)) {
        result[outKey] = result[dbKey]
      }
    }
  }
  return result
}

function buildWhereClause(model: string, where?: WhereClause[]): Record<string, unknown> {
  const whereClause: Record<string, unknown> = {}
  if (where?.length) {
    for (const w of where) {
      whereClause[mapField(model, w.field)] = w.value
    }
  }
  return whereClause
}

export const customPrismaAdapter = () => {
  return (_opts: Record<string, unknown>) => ({
    create: async ({ data, model }: AdapterMethodArgs) => {
      const mapped = mapFieldsToDb(model, data ?? {})
      const created = await getPrismaModel(model).create({ data: mapped })
      return mapOutput(model, created)
    },
    update: async ({ model, where, update }: AdapterMethodArgs) => {
      const mapped = mapFieldsToDb(model, update ?? {})
      const whereClause = buildWhereClause(model, where)
      const updated = await getPrismaModel(model).update({ where: whereClause, data: mapped })
      return mapOutput(model, updated)
    },
    updateMany: async ({ model, where, update }: AdapterMethodArgs) => {
      const mapped = mapFieldsToDb(model, update ?? {})
      const whereClause = buildWhereClause(model, where)
      const result = await getPrismaModel(model).updateMany({ where: whereClause, data: mapped })
      return result.count
    },
    delete: async ({ model, where }: AdapterMethodArgs) => {
      const whereClause = buildWhereClause(model, where)
      await getPrismaModel(model).delete({ where: whereClause })
    },
    deleteMany: async ({ model, where }: AdapterMethodArgs) => {
      const whereClause = buildWhereClause(model, where)
      const result = await getPrismaModel(model).deleteMany({ where: whereClause })
      return result.count
    },
    findOne: async ({ model, where }: AdapterMethodArgs) => {
      const whereClause = buildWhereClause(model, where)
      const result = await getPrismaModel(model).findFirst({ where: whereClause })
      return mapOutput(model, result)
    },
    findMany: async ({ model, where, limit, offset, sortBy }: AdapterMethodArgs) => {
      const whereClause = buildWhereClause(model, where)
      const orderBy = sortBy
        ? { [mapField(model, sortBy.field)]: sortBy.direction }
        : undefined
      const results = await getPrismaModel(model).findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy,
      })
      return results.map((r) => mapOutput(model, r))
    },
    count: async ({ model, where }: AdapterMethodArgs) => {
      const whereClause = buildWhereClause(model, where)
      return getPrismaModel(model).count({ where: whereClause })
    },
  })
}