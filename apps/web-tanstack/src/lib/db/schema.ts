// =============================================================================
// Drizzle D1 Schema — Core tables for AKMLEVA TanStack Start / Cloudflare Workers
// =============================================================================
// Mirrors the essential tables from the Prisma schema (packages/db/prisma/schema.prisma)
// but adapted for D1 (SQLite). Uses text for JSON fields and omits unsupported features
// like enums, @db.JsonB, and GIS types.
// =============================================================================

import { sqliteTable, text, integer, real, unique, index } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// ---------------------------------------------------------------------------
// Auth & User tables (required by better-auth + custom adapter)
// ---------------------------------------------------------------------------

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password_hash'), // nullable for OAuth users
  name: text('name'),
  username: text('username').unique(),
  avatar: text('avatar'),
  avatarUrl: text('avatar_url'),
  phone: text('phone'),
  birthDate: text('birth_date'), // ISO date string
  role: text('role').default('USER').notNull(),
  status: text('status').default('ACTIVE').notNull(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  termsAccepted: integer('terms_accepted', { mode: 'boolean' }).default(false),
  acceptedTermsDate: text('accepted_terms_date'),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  permissions: text('permissions').default('[]'), // JSON array
  twoFactorEnabled: integer('two_factor_enabled', { mode: 'boolean' }).default(false),
  twoFactorSecret: text('two_factor_secret'),
  emailVerificationToken: text('email_verification_token'),
  passwordResetToken: text('password_reset_token'),
  passwordResetExpires: text('password_reset_expires'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text('deleted_at'),
  lastLogin: text('last_login'),
  preferredLanguage: text('preferred_language').default('pt'),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  phoneIdx: index('users_phone_idx').on(table.phone),
}))

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  token: text('token').notNull().unique(),
  refreshToken: text('refresh_token').unique(),
  deviceInfo: text('device_info'), // JSON
  deviceFingerprint: text('device_fingerprint'),
  ipAddress: text('ip_address'),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  lastUsedAt: text('last_used_at').default('CURRENT_TIMESTAMP'),
  isRevoked: integer('is_revoked', { mode: 'boolean' }).default(false),
  revokedAt: text('revoked_at'),
}, (table) => ({
  userIdIdx: index('sessions_user_id_idx').on(table.userId),
  tokenIdx: index('sessions_token_idx').on(table.token),
}))

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
  idToken: text('id_token'),
  sessionState: text('session_state'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  userIdIdx: index('accounts_user_id_idx').on(table.userId),
  providerIdx: unique('accounts_provider_idx').on(table.provider, table.providerAccountId),
}))

export const emailVerificationTokens = sqliteTable('email_verification_tokens', {
  tokenId: text('token_id').primaryKey(),
  userId: text('user_id').notNull(),
  token: text('token').notNull().unique(),
  email: text('email').notNull(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  userIdIdx: index('evt_user_id_idx').on(table.userId),
  tokenIdx: index('evt_token_idx').on(table.token),
}))

// ---------------------------------------------------------------------------
// Destination tables (used by browse, search, sitemap, results)
// ---------------------------------------------------------------------------

export const destinations = sqliteTable('destinations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  country: text('country'),
  countryCode: text('country_code'),
  city: text('city'),
  region: text('region'),
  description: text('description'),
  shortDescription: text('short_description'),
  imageUrl: text('image_url'),
  images: text('images'), // JSON
  latitude: real('latitude'),
  longitude: real('longitude'),
  pricePerDay: real('price_per_day'),
  pricePerNight: real('price_per_night'),
  currency: text('currency').default('EUR'),
  rating: real('rating').default(0),
  reviewsCount: integer('reviews_count').default(0),
  category: text('category').default('CITY'),
  tags: text('tags').default('[]'), // JSON
  continent: text('continent'),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  climateInfo: text('climate_info'),
  bestTimeToVisit: text('best_time_to_visit'),
  visaRequirements: text('visa_requirements'),
  primaryLanguage: text('primary_language'),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  isPublished: integer('is_published', { mode: 'boolean' }).default(true),
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
  isPopular: integer('is_popular', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text('deleted_at'),
}, (table) => ({
  slugIdx: index('dest_slug_idx').on(table.slug),
  continentIdx: index('dest_continent_idx').on(table.continent),
  countryIdx: index('dest_country_idx').on(table.country),
  publishedIdx: index('dest_published_idx').on(table.isPublished),
}))

// ---------------------------------------------------------------------------
// Trips / Itineraries
// ---------------------------------------------------------------------------

export const trips = sqliteTable('trips', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  slug: text('slug'),
  name: text('name'),
  description: text('description'),
  destinationId: text('destination_id'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  budget: real('budget'),
  currency: text('currency').default('EUR'),
  status: text('status').default('DRAFT'),
  itinerary: text('itinerary'), // JSON
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text('deleted_at'),
}, (table) => ({
  userIdIdx: index('trips_user_id_idx').on(table.userId),
  slugIdx: index('trips_slug_idx').on(table.slug),
}))

// ---------------------------------------------------------------------------
// User Preferences
// ---------------------------------------------------------------------------

export const userPreferences = sqliteTable('user_preferences', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  travelStyles: text('travel_styles').default('[]'), // JSON
  budgetRange: text('budget_range').default('[2000,5000]'), // JSON
  preferredDestinations: text('preferred_destinations').default('[]'), // JSON
  dailyBudgetProfile: text('daily_budget_profile').default('conforto'),
  cabinClass: text('cabin_class').default('economy'),
  aiSettings: text('ai_settings'), // JSON
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  userIdIdx: index('upref_user_id_idx').on(table.userId),
}))
