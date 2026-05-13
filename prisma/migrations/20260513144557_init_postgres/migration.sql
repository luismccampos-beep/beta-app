-- CreateEnum
CREATE TYPE "SupplierType" AS ENUM ('HOTEL', 'GUIDE', 'TRANSFER', 'ACTIVITY', 'CRUISE', 'INSURANCE', 'FLIGHT', 'CAR_RENTAL', 'OTHER');

-- CreateEnum
CREATE TYPE "SupplierStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PartnershipLevel" AS ENUM ('BASIC', 'PREFERRED', 'PREMIUM', 'EXCLUSIVE');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "FollowUpStatus" AS ENUM ('PENDING', 'SENT', 'OPENED', 'RESPONDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FollowUpType" AS ENUM ('FEEDBACK_REQUEST', 'WELCOME_HOME', 'REVIEW_REMINDER', 'LOYALTY_OFFER', 'UPSELL');

-- CreateEnum
CREATE TYPE "BirthdayAlertStatus" AS ENUM ('PENDING', 'NOTIFIED', 'VOUCHER_SENT', 'VOUCHER_USED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "CommunityReactionType" AS ENUM ('LIKE');

-- CreateEnum
CREATE TYPE "AgencyPlan" AS ENUM ('STARTER', 'PROFESSIONAL', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "AgencyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LeadPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'MODERATOR', 'PARTNER', 'SUPPORT', 'PREMIUM', 'SUPER_ADMIN', 'PREMIUM_USER', 'TRAVEL_AGENT');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "TravelFrequency" AS ENUM ('OCCASIONAL', 'FREQUENT', 'SEASONAL', 'BUSINESS', 'OCCASIONAL_BUSINESS');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('BRL', 'USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'THB', 'AED', 'MAD', 'NZD', 'DKK', 'CNY', 'INR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU');

-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('adventure', 'beach', 'city_break', 'cultural', 'luxury', 'family', 'eco', 'romantic', 'wellness', 'ski', 'cruise');

-- CreateEnum
CREATE TYPE "Seasonality" AS ENUM ('TROPICAL', 'TEMPERATE', 'CONTINENTAL', 'ARCTIC', 'DESERT', 'MEDITERRANEAN', 'SUBTROPICAL');

-- CreateEnum
CREATE TYPE "DestinationCategory" AS ENUM ('CITY', 'BEACH', 'MOUNTAIN', 'COUNTRYSIDE', 'ISLAND', 'HERITAGE', 'SAFARI', 'DESERT', 'SKI', 'CRUISE', 'NATURE', 'ADVENTURE', 'CULTURAL', 'RELAXATION', 'NIGHTLIFE', 'FAMILY', 'ROMANTIC', 'LUXURY', 'BACKPACKING', 'WELLNESS');

-- CreateEnum
CREATE TYPE "AccessibilityLevel" AS ENUM ('FULL', 'PARTIAL', 'LIMITED', 'NONE');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('DRAFT', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REFUNDED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED', 'PARTIALLY_REFUNDED', 'SUCCEEDED', 'CANCELED', 'REQUIRES_ACTION');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'PIX', 'PAYPAL', 'STRIPE', 'CASH', 'CRYPTO', 'GIFT_CARD');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('draft', 'scheduled', 'published', 'archived', 'deleted');

-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('pending', 'approved', 'rejected', 'spam', 'flagged');

-- CreateEnum
CREATE TYPE "SecurityLevel" AS ENUM ('high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "SustainabilityCategory" AS ENUM ('carbon_neutral', 'eco_friendly', 'sustainable', 'responsible', 'standard');

-- CreateEnum
CREATE TYPE "ArticleCategory" AS ENUM ('travel_guide', 'destination_tip', 'culture', 'adventure', 'food', 'accommodation', 'transport', 'budget_travel', 'luxury_travel', 'solo_travel', 'family_travel', 'sustainability', 'digital_nomad', 'photography', 'wellness', 'business_travel', 'news', 'interview', 'review', 'how_to', 'Roteiros', 'Dicas', 'Guias', 'Gastronomia', 'Notícias');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('article', 'guide', 'review', 'interview', 'opinion', 'tutorial', 'case_study', 'roundup');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('DRAFT', 'PLANNING', 'BOOKING', 'TRAVELING', 'COMPLETED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ReviewType" AS ENUM ('POST_TRIP', 'DURING_TRIP', 'PRE_TRIP', 'FOLLOW_UP');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED');

-- CreateEnum
CREATE TYPE "LoyaltyTier" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BOOKING_CONFIRMATION', 'REVIEW_REQUEST', 'PRICE_ALERT', 'DESTINATION_UPDATE', 'PROMOTIONAL', 'SYSTEM');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255),
    "name" VARCHAR(255),
    "username" VARCHAR(50),
    "agency_id" TEXT,
    "avatar" TEXT,
    "avatar_thumbnail" TEXT,
    "avatar_url" TEXT,
    "bio" TEXT,
    "location" VARCHAR(255),
    "phone" VARCHAR(20),
    "birth_date" DATE,
    "gender" VARCHAR(20),
    "address" VARCHAR(255),
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "join_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_active" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified_at" TIMESTAMP(3),
    "email_verification_token" VARCHAR(255),
    "password_changed_at" TIMESTAMP(3),
    "two_factor_secret" VARCHAR(255),
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "two_factor_backup_code" JSONB NOT NULL DEFAULT '[]',
    "forgot_password_token" VARCHAR(255),
    "forgot_password_token_expiry" TIMESTAMP(3),
    "preferred_currency" "Currency" DEFAULT 'BRL',
    "preferred_language" VARCHAR(10) DEFAULT 'pt-BR',
    "travel_frequency" "TravelFrequency" NOT NULL DEFAULT 'OCCASIONAL',
    "timezone" VARCHAR(50),
    "theme" VARCHAR(20),
    "terms_accepted" BOOLEAN NOT NULL DEFAULT false,
    "privacy_accepted" BOOLEAN NOT NULL DEFAULT false,
    "accepted_terms_date" TIMESTAMP(3),
    "accepted_privacy_date" TIMESTAMP(3),
    "marketing_opt_in" BOOLEAN NOT NULL DEFAULT false,
    "data_processing_opt_in" BOOLEAN NOT NULL DEFAULT false,
    "data_retention_consent" BOOLEAN NOT NULL DEFAULT false,
    "gdpr_consent" BOOLEAN NOT NULL DEFAULT false,
    "profile_completion" SMALLINT NOT NULL DEFAULT 0,
    "experience_points" INTEGER NOT NULL DEFAULT 0,
    "streak_count" INTEGER NOT NULL DEFAULT 0,
    "favorite_destinations" JSONB,
    "friends" JSONB,
    "blocked_users" JSONB,
    "deleted_at" TIMESTAMP(3),
    "deactivated_at" TIMESTAMP(3),
    "blocked_at" TIMESTAMP(3),
    "blocked_reason" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "permissions" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_posts" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_comments" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "community_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_reactions" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "CommunityReactionType" NOT NULL DEFAULT 'LIKE',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agencies" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "domain" VARCHAR(255),
    "logo_url" TEXT,
    "primary_color" VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
    "secondary_color" VARCHAR(7) NOT NULL DEFAULT '#10B981',
    "accent_color" VARCHAR(7) NOT NULL DEFAULT '#F59E0B',
    "plan" "AgencyPlan" NOT NULL DEFAULT 'STARTER',
    "status" "AgencyStatus" NOT NULL DEFAULT 'ACTIVE',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "trial_ends_at" TIMESTAMP(3),
    "subscription_id" VARCHAR(255),
    "max_users" INTEGER NOT NULL DEFAULT 5,
    "max_clients" INTEGER NOT NULL DEFAULT 100,
    "features" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "agencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "agency_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "document" VARCHAR(50),
    "birth_date" DATE,
    "address" TEXT,
    "city" VARCHAR(100),
    "country" VARCHAR(100),
    "notes" TEXT,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "agency_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "source" VARCHAR(100),
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "priority" "LeadPriority" NOT NULL DEFAULT 'MEDIUM',
    "value" DECIMAL(10,2),
    "notes" TEXT,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" VARCHAR(50),
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verification_tokens" (
    "tokenId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("tokenId")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "refreshToken" VARCHAR(500),
    "deviceInfo" JSONB,
    "device_fingerprint" VARCHAR(255),
    "ip_address" VARCHAR(45),
    "ip_hash" VARCHAR(64),
    "refresh_token_family" VARCHAR(255),
    "token_sequence" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(0) NOT NULL,
    "last_activity_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,
    "security_flags" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "key_hash" VARCHAR(255) NOT NULL,
    "key_prefix" VARCHAR(8) NOT NULL,
    "userId" TEXT,
    "serviceName" VARCHAR(100) NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "scopes" JSONB NOT NULL DEFAULT '[]',
    "allowed_ips" JSONB NOT NULL DEFAULT '[]',
    "rate_limit" INTEGER NOT NULL DEFAULT 1000,
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "revoked_by" TEXT,
    "revoke_reason" TEXT,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "two_factor_devices" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceId" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "two_factor_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "notification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_friends" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "friend_id" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "sms_notifications" BOOLEAN NOT NULL DEFAULT false,
    "push_notifications" BOOLEAN NOT NULL DEFAULT true,
    "promotional_emails" BOOLEAN NOT NULL DEFAULT true,
    "preferred_accommodation_type" JSONB,
    "budget_range_min" DECIMAL(10,2),
    "budget_range_max" DECIMAL(10,2),
    "favorite_destination_types" JSONB NOT NULL DEFAULT '[]',
    "favorite_activities" JSONB NOT NULL DEFAULT '[]',
    "travel_style" VARCHAR(50),
    "budget_range" VARCHAR(50),
    "accommodation_preference" VARCHAR(100),
    "trip_duration" VARCHAR(50),
    "group_size" VARCHAR(50),
    "pace_preference" VARCHAR(50),
    "cuisine_preferences" JSONB NOT NULL DEFAULT '[]',
    "dietary_restrictions" JSONB NOT NULL DEFAULT '[]',
    "auto_accept_best_price" BOOLEAN NOT NULL DEFAULT false,
    "receive_price_alerts" BOOLEAN NOT NULL DEFAULT true,
    "price_alert_threshold" DECIMAL(3,2),
    "dark_mode" BOOLEAN NOT NULL DEFAULT false,
    "temperature_unit" VARCHAR(1),
    "distance_unit" VARCHAR(2),
    "ai_settings" JSONB,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "consentType" VARCHAR(100) NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" VARCHAR(100) NOT NULL,
    "entity" VARCHAR(50) NOT NULL,
    "entityId" TEXT,
    "changes" JSONB,
    "metadata" JSONB,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaceSearchLog" (
    "id" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "radius" INTEGER NOT NULL,
    "types" JSONB NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "cached" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaceSearchLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinations" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "country_code" VARCHAR(2),
    "city" VARCHAR(100) NOT NULL,
    "region" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "description" TEXT,
    "short_description" VARCHAR(500),
    "long_description" TEXT,
    "image_url" VARCHAR(500),
    "images" JSONB,
    "location_latlon" JSONB,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "timezone" VARCHAR(50),
    "altitude_meters" INTEGER,
    "price_per_day" REAL,
    "price_per_night" REAL,
    "currency" "Currency" NOT NULL DEFAULT 'BRL',
    "price_reliability" REAL,
    "rating" DECIMAL(3,2) DEFAULT 0,
    "reviews_count" INTEGER NOT NULL DEFAULT 0,
    "recommendation_percentage" INTEGER NOT NULL DEFAULT 0,
    "climate_info" TEXT,
    "seasonality" "Seasonality" NOT NULL DEFAULT 'TEMPERATE',
    "best_time_to_visit" VARCHAR(100),
    "worst_time_to_visit" VARCHAR(100),
    "average_temperature_min" DECIMAL(5,2),
    "average_temperature_max" DECIMAL(5,2),
    "visa_requirements" TEXT,
    "visa_requirements_for_nationalities" JSONB,
    "primary_language" VARCHAR(100),
    "languages_spoken" JSONB,
    "safety_rating" INTEGER NOT NULL DEFAULT 5,
    "crime_rate_percentage" DECIMAL(5,2),
    "accessibility_level" "AccessibilityLevel" NOT NULL DEFAULT 'PARTIAL',
    "category" "DestinationCategory" NOT NULL DEFAULT 'CITY',
    "tags" JSONB NOT NULL DEFAULT '[]',
    "travel_styles" JSONB,
    "ai_description" TEXT,
    "ai_recommendations" JSONB,
    "ai_local_tips" JSONB,
    "popularity_score" DECIMAL(5,2) DEFAULT 0,
    "trending_score" DECIMAL(5,2) DEFAULT 0,
    "seasonality_data" JSONB,
    "structured_data" JSONB,
    "meta_title" VARCHAR(255),
    "meta_description" VARCHAR(500),
    "meta_keywords" VARCHAR(500),
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "is_trending" BOOLEAN NOT NULL DEFAULT false,
    "moderation_status" VARCHAR(50),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "published_at" TIMESTAMP(3),
    "indexed_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attractions" (
    "id" TEXT NOT NULL,
    "destination_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255),
    "description" TEXT,
    "category" VARCHAR(100) NOT NULL,
    "sub_category" VARCHAR(100),
    "address" TEXT NOT NULL,
    "postal_code" VARCHAR(20),
    "location_latlon" JSONB,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "price_currency" "Currency" DEFAULT 'BRL',
    "price_amount" DECIMAL(10,2),
    "price_range" VARCHAR(10),
    "free_entry" BOOLEAN DEFAULT false,
    "opening_hours" JSONB,
    "is_open_24h" BOOLEAN DEFAULT false,
    "contact_info" JSONB,
    "website_url" VARCHAR(500),
    "booking_url" VARCHAR(500),
    "image_url" VARCHAR(500),
    "images" JSONB,
    "rating" DECIMAL(3,2) DEFAULT 0,
    "reviews_count" INTEGER NOT NULL DEFAULT 0,
    "accessibility_features" JSONB,
    "amenities" JSONB,
    "accepted_payment_methods" JSONB,
    "average_visit_duration_minutes" INTEGER,
    "best_time_to_visit" VARCHAR(100),
    "languages_guide_available" JSONB,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "attractions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" "PackageType" NOT NULL,
    "destination" VARCHAR(255) NOT NULL,
    "durationdays" INTEGER NOT NULL DEFAULT 7,
    "agency_id" TEXT,
    "priceoriginal" DECIMAL(10,2),
    "pricecurrent" DECIMAL(10,2),
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "imageurl" TEXT,
    "images" JSONB,
    "itinerary" JSONB,
    "tags" JSONB NOT NULL,
    "rating" REAL DEFAULT 0,
    "reviewscount" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "provider" VARCHAR(255),
    "metatitle" VARCHAR(60),
    "metadescription" VARCHAR(160),
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(0) NOT NULL,
    "deletedat" TIMESTAMP(3),

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airlines" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(3) NOT NULL,
    "logo" TEXT,
    "website" VARCHAR(500),
    "rating" REAL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "airlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airports" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(3) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lounge_available" BOOLEAN NOT NULL DEFAULT false,
    "lounge_details" JSONB,
    "priority_services" JSONB,

    CONSTRAINT "airports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flights" (
    "id" TEXT NOT NULL,
    "airline_id" TEXT NOT NULL,
    "departure_airport_id" TEXT NOT NULL,
    "arrival_airport_id" TEXT NOT NULL,
    "flight_number" VARCHAR(20) NOT NULL,
    "agency_id" TEXT,
    "departure_time" TIMESTAMP(3) NOT NULL,
    "arrival_time" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "total_seats" SMALLINT NOT NULL,
    "available_seats" SMALLINT NOT NULL,
    "base_price" DECIMAL(10,2) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'BRL',
    "status" VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_details" (
    "id" TEXT NOT NULL,
    "flight_id" TEXT NOT NULL,
    "overview" JSONB,
    "pricing" JSONB,
    "fare_tiers" JSONB,
    "baggage" JSONB,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "flight_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_details" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "overview" JSONB,
    "itineraries" JSONB,
    "pricing" JSONB,
    "availability" JSONB,
    "policies" JSONB,
    "provider_info" JSONB,
    "highlights" JSONB,
    "included" JSONB,
    "excluded" JSONB,
    "images" JSONB,
    "ratings" REAL,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "service_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cruises" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "operator" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "agency_id" TEXT,
    "startPort" VARCHAR(255) NOT NULL,
    "endPort" VARCHAR(255) NOT NULL,
    "ports" JSONB NOT NULL,
    "departureDate" DATE NOT NULL,
    "returnDate" DATE NOT NULL,
    "duration" SMALLINT NOT NULL,
    "totalCapacity" SMALLINT NOT NULL,
    "availableCapacity" SMALLINT NOT NULL,
    "occupancy" REAL,
    "pricePerPerson" DECIMAL(10,2) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'BRL',
    "priceIncludes" JSONB NOT NULL,
    "shipName" VARCHAR(255),
    "cabinTypes" JSONB NOT NULL,
    "amenities" JSONB NOT NULL,
    "rating" REAL DEFAULT 0,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "cruises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cruise_steps" (
    "id" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "iconColor" TEXT NOT NULL,
    "titleKey" TEXT NOT NULL,
    "descKey" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cruise_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cruise_fleet" (
    "id" TEXT NOT NULL,
    "nameKey" TEXT NOT NULL,
    "descKey" TEXT NOT NULL,
    "imageUrl" TEXT,
    "passengers" INTEGER NOT NULL,
    "cabins" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cruise_fleet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cruise_providers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cruise_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cruise_ships" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "shipName" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "cabins" INTEGER NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "features" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cruise_ships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodations" (
    "id" TEXT NOT NULL,
    "destination_id" TEXT,
    "name" TEXT NOT NULL,
    "slug" VARCHAR(500) NOT NULL,
    "type" TEXT,
    "description" TEXT,
    "address" TEXT,
    "price_per_night" DECIMAL(10,2),
    "currency" TEXT,
    "image" TEXT,
    "images" JSONB,
    "rating" DECIMAL(3,1),
    "amenities" JSONB,
    "latitude" DECIMAL(10,6),
    "longitude" DECIMAL(10,6),
    "sustainability_score" DECIMAL(4,1),
    "booking_url" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "accommodations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "city" VARCHAR(100),
    "country" VARCHAR(100),
    "star_rating" INTEGER,
    "amenities" JSONB NOT NULL,
    "price_per_night" DECIMAL(10,2),
    "currency" TEXT,
    "rating" DECIMAL(3,1),
    "reviews_count" INTEGER,
    "published" BOOLEAN DEFAULT true,
    "featured" BOOLEAN DEFAULT false,
    "metadata" JSONB,
    "agency_id" TEXT,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "hotels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_details" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "overview" JSONB,
    "itineraries" JSONB,
    "pricing" JSONB,
    "availability" JSONB,
    "policies" JSONB,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "hotel_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_steps" (
    "id" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "iconColor" TEXT NOT NULL,
    "titleKey" TEXT NOT NULL,
    "descKey" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_fleet" (
    "id" TEXT NOT NULL,
    "nameKey" TEXT NOT NULL,
    "descKey" TEXT NOT NULL,
    "imageUrl" TEXT,
    "maxOccupancy" INTEGER NOT NULL,
    "beds" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_fleet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_providers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_properties" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "propertyName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "starRating" INTEGER NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "features" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_rooms" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "roomType" VARCHAR(50) NOT NULL,
    "maxOccupancy" SMALLINT NOT NULL,
    "beds" JSONB,
    "amenities" JSONB NOT NULL,
    "pricePerNight" DECIMAL(10,2) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'BRL',
    "totalRooms" SMALLINT NOT NULL,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "hotel_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "destination_id" TEXT,
    "name" TEXT NOT NULL,
    "slug" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2),
    "currency" TEXT,
    "duration_text" TEXT,
    "image" TEXT,
    "rating" DECIMAL(3,1),
    "categories" JSONB,
    "location" TEXT,
    "booking_url" TEXT,
    "sustainability_score" DECIMAL(4,1),
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "providers" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "website" VARCHAR(500),
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "rating" REAL DEFAULT 0,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "partnership" VARCHAR(50),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(0) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "providerId" TEXT,
    "destinationId" TEXT,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "shortDesc" VARCHAR(500),
    "category" VARCHAR(50) NOT NULL,
    "subcategory" VARCHAR(50),
    "coverImage" TEXT,
    "imageGallery" JSONB,
    "features" JSONB NOT NULL,
    "amenities" JSONB NOT NULL,
    "tags" JSONB NOT NULL,
    "included" JSONB NOT NULL,
    "excluded" JSONB NOT NULL,
    "requirements" JSONB NOT NULL,
    "capacity" SMALLINT,
    "minBooking" SMALLINT,
    "maxBooking" SMALLINT,
    "instantConfirm" BOOLEAN NOT NULL DEFAULT false,
    "price" JSONB NOT NULL,
    "priceDisplay" VARCHAR(100) NOT NULL,
    "priceAmount" DECIMAL(10,2),
    "rating" REAL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "bookingCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(0) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_steps" (
    "id" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "iconColor" TEXT NOT NULL,
    "titleKey" TEXT NOT NULL,
    "descKey" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_fleet" (
    "id" TEXT NOT NULL,
    "nameKey" TEXT NOT NULL,
    "descKey" TEXT NOT NULL,
    "imageUrl" TEXT,
    "participants" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_fleet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_providers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_offerings" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "activityName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "participants" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "imageUrl" TEXT,
    "features" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_offerings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gastronomy_steps" (
    "id" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "iconColor" TEXT NOT NULL,
    "titleKey" TEXT NOT NULL,
    "descKey" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gastronomy_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gastronomy_fleet" (
    "id" TEXT NOT NULL,
    "nameKey" TEXT NOT NULL,
    "descKey" TEXT NOT NULL,
    "imageUrl" TEXT,
    "capacity" INTEGER NOT NULL,
    "cuisine" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gastronomy_fleet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gastronomy_providers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gastronomy_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gastronomy_restaurants" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "cuisine" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "capacity" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "features" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gastronomy_restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_steps" (
    "id" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "iconColor" TEXT NOT NULL,
    "titleKey" TEXT NOT NULL,
    "descKey" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_fleet" (
    "id" TEXT NOT NULL,
    "nameKey" TEXT NOT NULL,
    "descKey" TEXT NOT NULL,
    "imageUrl" TEXT,
    "capacity" INTEGER NOT NULL,
    "eventType" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_fleet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_providers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_offerings" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "capacity" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "features" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_offerings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_steps" (
    "id" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "iconColor" TEXT NOT NULL,
    "titleKey" TEXT NOT NULL,
    "descKey" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guide_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_fleet" (
    "id" TEXT NOT NULL,
    "nameKey" TEXT NOT NULL,
    "descKey" TEXT NOT NULL,
    "imageUrl" TEXT,
    "languages" JSONB NOT NULL,
    "specialties" JSONB NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guide_fleet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_providers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guide_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_offerings" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "guideName" TEXT NOT NULL,
    "languages" JSONB NOT NULL,
    "specialties" JSONB NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "experience" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "features" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guide_offerings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_images" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" VARCHAR(255),
    "title" VARCHAR(255),
    "order" SMALLINT NOT NULL DEFAULT 0,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfers" (
    "id" TEXT NOT NULL,
    "providerId" TEXT,
    "name" VARCHAR(255) NOT NULL,
    "pickupLocation" VARCHAR(255) NOT NULL,
    "dropoffLocation" VARCHAR(255) NOT NULL,
    "vehicleType" VARCHAR(50) NOT NULL,
    "capacity" SMALLINT NOT NULL,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'BRL',
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfer_steps" (
    "id" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "iconColor" TEXT NOT NULL,
    "titleKey" TEXT NOT NULL,
    "descKey" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transfer_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_fleet" (
    "id" TEXT NOT NULL,
    "nameKey" TEXT NOT NULL,
    "descKey" TEXT NOT NULL,
    "imageUrl" TEXT,
    "passengers" INTEGER NOT NULL,
    "luggage" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_fleet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfer_providers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transfer_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfer_vehicles" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "pricePerKm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "passengers" INTEGER NOT NULL,
    "luggage" INTEGER NOT NULL,
    "duration" TEXT,
    "imageUrl" TEXT,
    "features" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transfer_vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemType" VARCHAR(50) NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" SMALLINT NOT NULL DEFAULT 1,
    "checkIn" DATE,
    "checkOut" DATE,
    "passengers" JSONB,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'BRL',
    "metadata" JSONB,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "agency_id" TEXT,
    "client_id" TEXT,
    "destination_id" TEXT NOT NULL,
    "trip_id" TEXT,
    "trip_destination_id" TEXT,
    "booking_reference" VARCHAR(50) NOT NULL,
    "supplier_booking_reference" VARCHAR(100),
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "check_in_time" VARCHAR(10),
    "check_out_time" VARCHAR(10),
    "adults" SMALLINT NOT NULL DEFAULT 1,
    "children" SMALLINT NOT NULL DEFAULT 0,
    "infants" SMALLINT NOT NULL DEFAULT 0,
    "price_per_night" REAL,
    "subtotal" REAL NOT NULL,
    "tax_amount" REAL DEFAULT 0,
    "discount_amount" REAL DEFAULT 0,
    "total_price" REAL NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'BRL',
    "booking_status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_method" "PaymentMethod" NOT NULL,
    "payment_intent_id" VARCHAR(255),
    "payment_transaction_id" VARCHAR(255),
    "last_payment_attempt" TIMESTAMP(3),
    "cancellation_reason" VARCHAR(255),
    "cancellation_date" TIMESTAMP(3),
    "refund_amount" REAL,
    "refund_date" TIMESTAMP(3),
    "guest_email" VARCHAR(255) NOT NULL,
    "guest_phone" VARCHAR(20),
    "emergency_contact_name" VARCHAR(255),
    "emergency_contact_phone" VARCHAR(20),
    "emergency_contact_email" VARCHAR(255),
    "special_requests" TEXT,
    "dietary_preferences" VARCHAR(255),
    "accessibility_requirements" TEXT,
    "confirmation_sent" BOOLEAN NOT NULL DEFAULT false,
    "confirmation_sent_at" TIMESTAMP(3),
    "reminder_sent" BOOLEAN NOT NULL DEFAULT false,
    "reminder_sent_at" TIMESTAMP(3),
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(0) NOT NULL,
    "checked_in_at" TIMESTAMP(3),
    "checked_out_at" TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_bookings" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "flightId" TEXT NOT NULL,
    "seats" JSONB NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flight_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_bookings" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "nights" SMALLINT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hotel_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_bookings" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "quantity" SMALLINT NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3),
    "timeSlot" VARCHAR(50),
    "options" JSONB,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cruise_bookings" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "cruiseId" TEXT NOT NULL,
    "cabinType" VARCHAR(50) NOT NULL,
    "cabinNumber" VARCHAR(50),
    "price" DECIMAL(10,2) NOT NULL,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cruise_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfer_bookings" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "transferId" TEXT NOT NULL,
    "pickupTime" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transfer_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_history" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "reason" TEXT,
    "changes" JSONB,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "transaction_id" VARCHAR(100) NOT NULL,
    "gateway_transaction_id" VARCHAR(255),
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'BRL',
    "payment_method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "failure_reason" VARCHAR(255),
    "error_code" VARCHAR(100),
    "error_message" TEXT,
    "card_last_four" VARCHAR(4),
    "card_brand" VARCHAR(50),
    "refundable" BOOLEAN NOT NULL DEFAULT false,
    "refund_amount" VARCHAR(20),
    "refund_reason" VARCHAR(255),
    "provider_data" JSONB,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "refunded_at" TIMESTAMP(3),
    "updatedat" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "transaction_id" VARCHAR(100) NOT NULL,
    "gateway_transaction_id" VARCHAR(255),
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'BRL',
    "payment_method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "failure_reason" VARCHAR(255),
    "error_code" VARCHAR(100),
    "error_message" TEXT,
    "card_last_four" VARCHAR(4),
    "card_brand" VARCHAR(50),
    "refundable" BOOLEAN NOT NULL DEFAULT false,
    "refund_amount" VARCHAR(20),
    "refund_reason" VARCHAR(255),
    "provider_data" JSONB,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "refunded_at" TIMESTAMP(3),
    "updatedat" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vouchers" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "discountType" VARCHAR(20) NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL,
    "maxDiscount" DECIMAL(10,2),
    "validFrom" DATE NOT NULL,
    "validUntil" DATE NOT NULL,
    "maxUses" SMALLINT,
    "currentUses" SMALLINT NOT NULL DEFAULT 0,
    "usesPerUser" SMALLINT DEFAULT 1,
    "minPurchaseAmount" DECIMAL(10,2),
    "applicableDestinations" JSONB NOT NULL,
    "applicableCategories" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotions" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "code" VARCHAR(50) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "value" REAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "minPurchase" REAL,
    "packageIds" JSONB NOT NULL DEFAULT '[]',
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(0) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_payment_methods" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "nameLocalized" JSONB,
    "description" TEXT,
    "descriptionLocalized" JSONB,
    "type" VARCHAR(50) NOT NULL,
    "provider" VARCHAR(100) NOT NULL,
    "iconName" VARCHAR(100),
    "logoUrl" VARCHAR(500),
    "status" VARCHAR(20) NOT NULL DEFAULT 'ativo',
    "fees" JSONB,
    "countriesAvailable" JSONB NOT NULL,
    "currenciesAccepted" JSONB NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT true,
    "isInstant" BOOLEAN NOT NULL DEFAULT true,
    "requiresSetup" BOOLEAN NOT NULL DEFAULT false,
    "setupUrl" VARCHAR(500),
    "documentationUrl" VARCHAR(500),
    "config" JSONB,
    "limits" JSONB,
    "processingTime" JSONB,
    "metadata" JSONB,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isTestMode" BOOLEAN NOT NULL DEFAULT false,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "system_payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voucher_usage" (
    "id" TEXT NOT NULL,
    "voucherId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "usedat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voucher_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255),
    "description" TEXT,
    "cover_image_url" VARCHAR(500),
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "duration_days" INTEGER,
    "status" "TripStatus" NOT NULL DEFAULT 'DRAFT',
    "is_private" BOOLEAN NOT NULL DEFAULT true,
    "is_draft" BOOLEAN NOT NULL DEFAULT true,
    "progress_percentage" SMALLINT NOT NULL DEFAULT 0,
    "total_budget" DECIMAL(12,2),
    "total_spent" DECIMAL(12,2) DEFAULT 0,
    "budget_currency" "Currency" NOT NULL DEFAULT 'BRL',
    "accommodation_budget" DECIMAL(10,2),
    "accommodation_spent" DECIMAL(10,2) DEFAULT 0,
    "transportation_budget" DECIMAL(10,2),
    "transportation_spent" DECIMAL(10,2) DEFAULT 0,
    "food_budget" DECIMAL(10,2),
    "food_spent" DECIMAL(10,2) DEFAULT 0,
    "activities_budget" DECIMAL(10,2),
    "activities_spent" DECIMAL(10,2) DEFAULT 0,
    "entertainment_budget" DECIMAL(10,2),
    "entertainment_spent" DECIMAL(10,2) DEFAULT 0,
    "other_budget" DECIMAL(10,2),
    "other_spent" DECIMAL(10,2) DEFAULT 0,
    "origin_location" VARCHAR(255),
    "origin_latitude" DECIMAL(10,8),
    "origin_longitude" DECIMAL(11,8),
    "trip_type" VARCHAR(50),
    "travel_mode" VARCHAR(50),
    "companions_count" INTEGER NOT NULL DEFAULT 0,
    "companions" JSONB,
    "destinations_count" INTEGER NOT NULL DEFAULT 0,
    "bookings_count" INTEGER NOT NULL DEFAULT 0,
    "photos_count" INTEGER NOT NULL DEFAULT 0,
    "ai_itinerary_suggestions" JSONB,
    "estimated_total_cost" DECIMAL(12,2),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itineraries" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "overview" TEXT,
    "recommendations" JSONB,
    "optimizedRoute" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "itineraries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itinerary_days" (
    "id" TEXT NOT NULL,
    "itineraryId" TEXT NOT NULL,
    "dayNumber" SMALLINT NOT NULL,
    "date" DATE NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "activities" JSONB NOT NULL,
    "weather" JSONB,
    "budget" DECIMAL(10,2),

    CONSTRAINT "itinerary_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_destinations" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "destination_id" TEXT NOT NULL,
    "sequence_order" INTEGER NOT NULL,
    "arrival_date" DATE,
    "departure_date" DATE,
    "duration_days" INTEGER,
    "budget" DECIMAL(10,2),
    "spent" DECIMAL(10,2) DEFAULT 0,
    "notes" TEXT,
    "itinerary_details" JSONB,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "trip_destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_itineraries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "destinationId" TEXT,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "slug" VARCHAR(255),
    "itineraryData" JSONB NOT NULL,
    "duration" SMALLINT NOT NULL,
    "budget" DECIMAL(10,2),
    "currency" "Currency" NOT NULL DEFAULT 'BRL',
    "preferences" JSONB,
    "aiModel" VARCHAR(50),
    "version" SMALLINT NOT NULL DEFAULT 1,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareCode" VARCHAR(50),
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "saved_itineraries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "booking_id" TEXT,
    "destination_id" TEXT,
    "attraction_id" TEXT,
    "title" VARCHAR(255) NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" SMALLINT NOT NULL,
    "cleanliness_rating" SMALLINT,
    "comfort_rating" SMALLINT,
    "location_rating" SMALLINT,
    "value_rating" SMALLINT,
    "service_rating" SMALLINT,
    "reviewer_name" VARCHAR(255),
    "review_type" "ReviewType" NOT NULL DEFAULT 'POST_TRIP',
    "review_status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "is_verified_booking" BOOLEAN NOT NULL DEFAULT false,
    "travel_type" VARCHAR(50),
    "helpful_count" INTEGER NOT NULL DEFAULT 0,
    "unhelpful_count" INTEGER NOT NULL DEFAULT 0,
    "flag_count" INTEGER NOT NULL DEFAULT 0,
    "photos" JSONB,
    "videos" JSONB,
    "moderation_notes" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "published_at" TIMESTAMP(3),
    "moderated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemType" VARCHAR(50) NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "priority" SMALLINT NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_conversations" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" VARCHAR(255),
    "conversationStatus" VARCHAR(20) NOT NULL DEFAULT 'active',
    "escalatedToEmail" BOOLEAN NOT NULL DEFAULT false,
    "escalatedAt" TIMESTAMP(3),
    "context" JSONB,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_chat_messages" (
    "id" TEXT NOT NULL,
    "aiConversationId" TEXT NOT NULL,
    "userId" TEXT,
    "role" VARCHAR(20) NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ai_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "content" TEXT NOT NULL,
    "tokens" INTEGER,
    "model" VARCHAR(50),
    "metadata" JSONB,
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "helpful" BOOLEAN,
    "rating" SMALLINT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,
    "aiConversationId" TEXT NOT NULL,

    CONSTRAINT "ai_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_rooms" (
    "id" TEXT NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255),
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_participants" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "joinedAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "chat_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "reactions" JSONB,
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_programs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "tier" "LoyaltyTier" NOT NULL DEFAULT 'BRONZE',
    "lifetimePoints" INTEGER NOT NULL DEFAULT 0,
    "tierExpiresAt" TIMESTAMP(3),
    "discountPercentage" REAL NOT NULL DEFAULT 0,
    "perks" JSONB,
    "nextTierPoints" INTEGER,
    "pointsToExpire" JSONB,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "loyalty_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_transactions" (
    "id" TEXT NOT NULL,
    "loyaltyProgramId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "description" VARCHAR(500),
    "referenceType" VARCHAR(50),
    "referenceId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "expired" BOOLEAN NOT NULL DEFAULT false,
    "balanceAfter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "destination_id" TEXT,
    "title" VARCHAR(500) NOT NULL,
    "slug" VARCHAR(500) NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" VARCHAR(1000),
    "featured_image_url" VARCHAR(500),
    "featured_image_alt" TEXT,
    "images" JSONB,
    "video_url" VARCHAR(500),
    "content_type" "ContentType" NOT NULL DEFAULT 'article',
    "category" "ArticleCategory" DEFAULT 'travel_guide',
    "tags" JSONB,
    "reading_time_minutes" INTEGER,
    "word_count" INTEGER,
    "status" "ArticleStatus" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(3),
    "scheduled_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(0) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "pin_until" TIMESTAMP(3),
    "visibility" VARCHAR(50) NOT NULL DEFAULT 'public',
    "sustainability_rating" SMALLINT DEFAULT 0,
    "sustainability_category" "SustainabilityCategory",
    "carbon_footprint_estimate" INTEGER,
    "eco_certifications" JSONB,
    "security_level" "SecurityLevel" NOT NULL DEFAULT 'medium',
    "requires_authentication" BOOLEAN NOT NULL DEFAULT false,
    "content_warning" TEXT,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "unique_views_count" INTEGER NOT NULL DEFAULT 0,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "shares_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "bookmark_count" INTEGER NOT NULL DEFAULT 0,
    "trend_score" SMALLINT NOT NULL DEFAULT 0,
    "trending_rank" INTEGER,
    "ai_generated" BOOLEAN NOT NULL DEFAULT false,
    "ai_summary" TEXT,
    "ai_keywords" JSONB,
    "meta_title" VARCHAR(160),
    "meta_description" VARCHAR(160),
    "meta_keywords" VARCHAR(500),
    "canonical_url" VARCHAR(500),
    "structured_data" JSONB,
    "related_articles" JSONB,
    "is_approved" BOOLEAN NOT NULL DEFAULT true,
    "moderation_notes" TEXT,
    "moderated_by" TEXT,
    "moderated_at" TIMESTAMP(3),

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_comments" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "user_id" TEXT,
    "parent_comment_id" TEXT,
    "guest_name" VARCHAR(255),
    "guest_email" VARCHAR(255),
    "guest_verified" BOOLEAN NOT NULL DEFAULT false,
    "title" VARCHAR(500),
    "content" TEXT NOT NULL,
    "rating_given" SMALLINT,
    "status" "CommentStatus" NOT NULL DEFAULT 'pending',
    "is_verified_purchase" BOOLEAN NOT NULL DEFAULT false,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "content_warning" TEXT,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "dislikes_count" INTEGER NOT NULL DEFAULT 0,
    "helpful_count" INTEGER NOT NULL DEFAULT 0,
    "unhelpful_count" INTEGER NOT NULL DEFAULT 0,
    "moderation_notes" TEXT,
    "moderated_by" TEXT,
    "moderated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "depth" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "article_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" VARCHAR(50) NOT NULL,
    "questions" JSONB NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempts" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "score" REAL,
    "result" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "icon" VARCHAR(50),
    "actionUrl" TEXT,
    "actionText" VARCHAR(50),
    "metadata" JSONB,
    "channels" JSONB NOT NULL DEFAULT '["in_app"]',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "dismissed" BOOLEAN NOT NULL DEFAULT false,
    "priority" VARCHAR(20) NOT NULL DEFAULT 'normal',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "template" VARCHAR(100) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "bounced" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "email_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email_enabled" BOOLEAN NOT NULL DEFAULT true,
    "push_enabled" BOOLEAN NOT NULL DEFAULT true,
    "sms_enabled" BOOLEAN NOT NULL DEFAULT false,
    "in_app_enabled" BOOLEAN NOT NULL DEFAULT true,
    "booking_notifications" BOOLEAN NOT NULL DEFAULT true,
    "promotion_notifications" BOOLEAN NOT NULL DEFAULT true,
    "social_notifications" BOOLEAN NOT NULL DEFAULT true,
    "review_notifications" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "notification_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_events" (
    "id" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "customerId" TEXT,
    "payload" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "receivedAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "sessionId" VARCHAR(255),
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_customers" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "cpfCnpj" VARCHAR(20) NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "number" VARCHAR(10) NOT NULL,
    "complement" VARCHAR(50),
    "neighborhood" VARCHAR(50),
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "zipCode" VARCHAR(10) NOT NULL,
    "country" VARCHAR(3) NOT NULL,
    "documents" JSONB,
    "notes" TEXT,
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "crm_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_bookings" (
    "id" TEXT NOT NULL,
    "reference" VARCHAR(20) NOT NULL,
    "customerId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "paymentMethod" VARCHAR(20),
    "paymentProof" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "crm_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_categories" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "crm_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_products" (
    "id" TEXT NOT NULL,
    "sku" VARCHAR(50) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "costPrice" DECIMAL(10,2),
    "currency" "Currency" NOT NULL DEFAULT 'BRL',
    "categoryId" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "stock" INTEGER NOT NULL DEFAULT 0,
    "images" JSONB,
    "tags" JSONB NOT NULL,
    "specifications" JSONB,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "crm_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "embedding_cache" (
    "id" TEXT NOT NULL,
    "cacheKey" VARCHAR(255) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "text" VARCHAR(500) NOT NULL,
    "embedding" JSONB NOT NULL,
    "tokens" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "embedding_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "llm_cache" (
    "id" TEXT NOT NULL,
    "cacheKey" VARCHAR(255) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "content" TEXT NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "finishReason" VARCHAR(50) NOT NULL,
    "usage" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "llm_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_runs" (
    "id" TEXT NOT NULL,
    "queue" VARCHAR(50) NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "durationMs" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "job_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_events" (
    "id" TEXT NOT NULL,
    "campaign" VARCHAR(100) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "messageId" VARCHAR(200),
    "extra" JSONB,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emission_factors" (
    "id" TEXT NOT NULL,
    "mode" VARCHAR(20) NOT NULL,
    "subcategory" VARCHAR(50),
    "country" VARCHAR(3),
    "factor" DECIMAL(10,6) NOT NULL,
    "unit" VARCHAR(50) NOT NULL,
    "source" TEXT,
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emission_factors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airport_geo" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "name" VARCHAR(255),
    "city" VARCHAR(100),
    "country" VARCHAR(3),
    "lat" REAL NOT NULL,
    "lon" REAL NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "airport_geo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_versions" (
    "id" TEXT NOT NULL,
    "modelName" VARCHAR(100) NOT NULL,
    "version" VARCHAR(50) NOT NULL,
    "weightPercent" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "avatar" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "local_guides" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT,
    "photo_alt" TEXT,
    "description" TEXT,
    "specialties" JSONB,
    "languages" JSONB,
    "rating" DECIMAL(3,1),
    "reviews" INTEGER NOT NULL DEFAULT 0,
    "availability" JSONB,
    "price" JSONB,
    "location" JSONB,
    "expertise" TEXT,
    "bio" TEXT,
    "years_experience" INTEGER,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "certifications" JSONB,
    "tag_line" TEXT,
    "tours_highlighted" JSONB,
    "contact" JSONB,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "local_guides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_products" (
    "id" TEXT NOT NULL,
    "provider" TEXT,
    "plan_code" VARCHAR(500) NOT NULL,
    "name_key" TEXT,
    "description_key" TEXT,
    "summary_key" TEXT,
    "price_range_key" TEXT,
    "icon" TEXT,
    "badge_key" TEXT,
    "coverages" JSONB,
    "benefits" JSONB,
    "fine_print_key" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "details" JSONB,

    CONSTRAINT "insurance_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "number" VARCHAR(100) NOT NULL,
    "booking_id" TEXT,
    "status" VARCHAR(50),
    "issue_date" DATE,
    "due_date" DATE,
    "paid_date" DATE,
    "customer" JSONB,
    "company" JSONB,
    "items" JSONB,
    "subtotal" DECIMAL(10,2),
    "taxes" DECIMAL(10,2),
    "discounts" DECIMAL(10,2),
    "total" DECIMAL(10,2),
    "currency" VARCHAR(10),
    "payment_method" VARCHAR(50),
    "payment_reference" VARCHAR(255),
    "notes" TEXT,
    "terms" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refund_requests" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT,
    "invoice_id" TEXT,
    "status" VARCHAR(50),
    "type" VARCHAR(50),
    "reason" TEXT,
    "request_date" TIMESTAMP(3),
    "processed_date" TIMESTAMP(3),
    "completed_date" TIMESTAMP(3),
    "customer" JSONB,
    "booking" JSONB,
    "refund" JSONB,
    "original_payment" JSONB,
    "notes" TEXT,
    "internal_notes" TEXT,
    "customer_message" TEXT,
    "attachments" JSONB,
    "processed_by" TEXT,
    "approved_by" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "refund_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_transactions" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "name" VARCHAR(255),
    "email" VARCHAR(255),
    "amount" DECIMAL(10,2),
    "type" VARCHAR(50),
    "status" VARCHAR(50),
    "description" TEXT,
    "payment_method" VARCHAR(50),
    "invoice_id" TEXT,
    "customer" JSONB,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "status" VARCHAR(50),
    "subscribed_at" TIMESTAMP(3),
    "language" VARCHAR(10),
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_campaigns" (
    "id" TEXT NOT NULL,
    "subject" VARCHAR(255),
    "title" VARCHAR(255),
    "content" TEXT,
    "status" VARCHAR(50),
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduled_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "language" VARCHAR(10),
    "preview_text" VARCHAR(255),
    "recipients_count" INTEGER,
    "stats" JSONB,

    CONSTRAINT "newsletter_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transportations" (
    "id" TEXT NOT NULL,
    "destination_id" TEXT,
    "type" TEXT,
    "provider" TEXT,
    "origin" TEXT,
    "destination" TEXT,
    "departure_time" TEXT,
    "arrival_time" TEXT,
    "duration_text" TEXT,
    "price" DECIMAL(10,2),
    "currency" TEXT,
    "co2_emissions" DECIMAL(10,2),
    "sustainability_score" DECIMAL(4,1),
    "booking_url" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transportations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_images" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hotel_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cruise_details" (
    "id" TEXT NOT NULL,
    "cruise_id" TEXT NOT NULL,
    "overview" JSONB,
    "itineraries" JSONB,
    "route_weather" JSONB,
    "monthly_recommendations" JSONB,
    "sea_state" JSONB,
    "excursions" JSONB,
    "cabins" JSONB,
    "images" JSONB,
    "ratings" REAL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "cruise_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_details" (
    "id" TEXT NOT NULL,
    "guide_id" BIGINT NOT NULL,
    "bio" JSONB,
    "specialties" JSONB,
    "certifications" JSONB,
    "availability" JSONB,
    "pricing" JSONB,
    "languages" JSONB,
    "images" JSONB,
    "ratings" REAL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "guide_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_destinations" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "destination_id" TEXT NOT NULL,
    "mention_type" VARCHAR(100),
    "order_position" INTEGER,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_attractions" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "attraction_id" TEXT NOT NULL,
    "mention_type" VARCHAR(100),
    "description" TEXT,
    "order_position" INTEGER,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_attractions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(100) NOT NULL,
    "color" VARCHAR(50) NOT NULL,
    "bg_color" VARCHAR(50) NOT NULL,
    "logo" TEXT,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "rating" DECIMAL(3,1),
    "users" VARCHAR(50),
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "coming_soon" BOOLEAN NOT NULL DEFAULT false,
    "features" JSONB NOT NULL,
    "website" VARCHAR(500),
    "pricing" VARCHAR(50),
    "status" VARCHAR(50) DEFAULT 'active',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_suggestions" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(50) NOT NULL,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "search_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "popular_destinations" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "image_url" VARCHAR(500),
    "rating" DECIMAL(3,2) NOT NULL,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "trending" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "popular_destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trending_searches" (
    "id" TEXT NOT NULL,
    "query" VARCHAR(255) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "category" VARCHAR(50) NOT NULL,
    "last_searched" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "trending_searches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_prompts" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "template" TEXT NOT NULL,
    "variables" JSONB DEFAULT '{}',
    "service" TEXT NOT NULL,
    "model" TEXT,
    "tags" JSONB NOT NULL,
    "enabled" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_recommendations" (
    "id" SERIAL NOT NULL,
    "context_type" TEXT NOT NULL,
    "context_id" TEXT NOT NULL,
    "recommendation" JSONB NOT NULL,
    "service" TEXT,
    "model" TEXT,
    "confidence" DECIMAL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_workflows" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "steps" JSONB NOT NULL,
    "enabled" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" VARCHAR(50) NOT NULL,
    "type" "SupplierType" NOT NULL DEFAULT 'HOTEL',
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "email" VARCHAR(255),
    "phone" VARCHAR(50),
    "website" VARCHAR(500),
    "address" VARCHAR(255),
    "city" VARCHAR(100),
    "country" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "tax_id" VARCHAR(50),
    "logo" VARCHAR(500),
    "status" "SupplierStatus" NOT NULL DEFAULT 'PENDING',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_date" TIMESTAMP(3),
    "partnership_level" "PartnershipLevel" NOT NULL DEFAULT 'BASIC',
    "default_commission_rate" DECIMAL(5,2) NOT NULL DEFAULT 15,
    "rating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "total_reviews" INTEGER NOT NULL DEFAULT 0,
    "performance" JSONB,
    "categories" JSONB,
    "tags" JSONB,
    "serviceRegions" JSONB,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "last_booking_at" TIMESTAMP(3),

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_contacts" (
    "id" VARCHAR(50) NOT NULL,
    "supplier_id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" VARCHAR(100),
    "email" VARCHAR(255),
    "phone" VARCHAR(50),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "supplier_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commission_records" (
    "id" VARCHAR(50) NOT NULL,
    "supplier_id" VARCHAR(50) NOT NULL,
    "booking_id" VARCHAR(50),
    "booking_reference" VARCHAR(50),
    "booking_date" TIMESTAMP(3),
    "gross_amount" DECIMAL(10,2) NOT NULL,
    "commission_amount" DECIMAL(10,2) NOT NULL,
    "commission_rate" DECIMAL(5,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'EUR',
    "status" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(3),
    "customer_name" VARCHAR(255),
    "destination" VARCHAR(255),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "commission_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destination_preferences" (
    "id" TEXT NOT NULL,
    "destination_id" VARCHAR(50) NOT NULL,
    "destination_name" VARCHAR(255) NOT NULL,
    "destination_country" VARCHAR(100) NOT NULL,
    "subscriber_count" INTEGER NOT NULL DEFAULT 0,
    "last_campaign_sent" TIMESTAMP(3),
    "open_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "click_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "destination_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "segmented_campaigns" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(500) NOT NULL,
    "content" TEXT,
    "destination_id" VARCHAR(50) NOT NULL,
    "destination_name" VARCHAR(255) NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduled_date" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "recipient_count" INTEGER NOT NULL DEFAULT 0,
    "open_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "click_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "segmented_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_trip_follow_ups" (
    "id" TEXT NOT NULL,
    "booking_id" VARCHAR(50) NOT NULL,
    "user_id" VARCHAR(50) NOT NULL,
    "user_name" VARCHAR(255) NOT NULL,
    "user_email" VARCHAR(255) NOT NULL,
    "destination_name" VARCHAR(255) NOT NULL,
    "check_out_date" TIMESTAMP(3) NOT NULL,
    "follow_up_type" "FollowUpType" NOT NULL DEFAULT 'FEEDBACK_REQUEST',
    "status" "FollowUpStatus" NOT NULL DEFAULT 'PENDING',
    "scheduled_date" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "opened_at" TIMESTAMP(3),
    "responded_at" TIMESTAMP(3),
    "feedback_rating" INTEGER,
    "feedback_comment" TEXT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "post_trip_follow_ups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "birthday_alerts" (
    "id" TEXT NOT NULL,
    "user_id" VARCHAR(50) NOT NULL,
    "user_name" VARCHAR(255) NOT NULL,
    "user_email" VARCHAR(255) NOT NULL,
    "birth_date" DATE NOT NULL,
    "upcoming_birthday" DATE NOT NULL,
    "days_until_birthday" INTEGER NOT NULL DEFAULT 0,
    "age" INTEGER NOT NULL DEFAULT 0,
    "alert_status" "BirthdayAlertStatus" NOT NULL DEFAULT 'PENDING',
    "voucher_code" VARCHAR(50),
    "voucher_discount" INTEGER,
    "voucher_expiry" TIMESTAMP(3),
    "voucher_used_at" TIMESTAMP(3),
    "last_notified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "birthday_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follow_up_templates" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "FollowUpType" NOT NULL,
    "subject" VARCHAR(500) NOT NULL,
    "content" TEXT NOT NULL,
    "delay_days" INTEGER NOT NULL DEFAULT 2,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "follow_up_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "birthday_voucher_configs" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "discount_percentage" INTEGER NOT NULL DEFAULT 15,
    "min_booking_value" DECIMAL(10,2) NOT NULL DEFAULT 100,
    "valid_for_days" INTEGER NOT NULL DEFAULT 30,
    "max_uses" INTEGER NOT NULL DEFAULT 1000,
    "current_uses" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "birthday_voucher_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preference_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "session_id" TEXT NOT NULL,
    "preference_type" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "context" JSONB NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "preference_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preference_analytics" (
    "id" TEXT NOT NULL,
    "analytics_type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "computed_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "preference_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "response_predictions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "preference_hash" TEXT NOT NULL,
    "predicted_response" JSONB NOT NULL,
    "confidence_score" DECIMAL(3,2) NOT NULL,
    "model_version" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "response_predictions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "community_posts_author_id_idx" ON "community_posts"("author_id");

-- CreateIndex
CREATE INDEX "community_posts_created_at_idx" ON "community_posts"("created_at");

-- CreateIndex
CREATE INDEX "community_comments_post_id_idx" ON "community_comments"("post_id");

-- CreateIndex
CREATE INDEX "community_comments_author_id_idx" ON "community_comments"("author_id");

-- CreateIndex
CREATE INDEX "community_comments_created_at_idx" ON "community_comments"("created_at");

-- CreateIndex
CREATE INDEX "community_reactions_post_id_idx" ON "community_reactions"("post_id");

-- CreateIndex
CREATE INDEX "community_reactions_user_id_idx" ON "community_reactions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "community_reactions_post_id_user_id_type_key" ON "community_reactions"("post_id", "user_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "agencies_slug_key" ON "agencies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "agencies_domain_key" ON "agencies"("domain");

-- CreateIndex
CREATE INDEX "agencies_slug_idx" ON "agencies"("slug");

-- CreateIndex
CREATE INDEX "agencies_domain_idx" ON "agencies"("domain");

-- CreateIndex
CREATE INDEX "clients_agency_id_idx" ON "clients"("agency_id");

-- CreateIndex
CREATE INDEX "clients_email_idx" ON "clients"("email");

-- CreateIndex
CREATE INDEX "leads_agency_id_idx" ON "leads"("agency_id");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "leads"("email");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_tokens_token_key" ON "email_verification_tokens"("token");

-- CreateIndex
CREATE INDEX "email_verification_tokens_userId_idx" ON "email_verification_tokens"("userId");

-- CreateIndex
CREATE INDEX "email_verification_tokens_token_idx" ON "email_verification_tokens"("token");

-- CreateIndex
CREATE INDEX "email_verification_tokens_expiresAt_idx" ON "email_verification_tokens"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "password_reset_tokens_userId_idx" ON "password_reset_tokens"("userId");

-- CreateIndex
CREATE INDEX "password_reset_tokens_token_idx" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "password_reset_tokens_expiresAt_idx" ON "password_reset_tokens"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshToken_key" ON "sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_token_idx" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_refreshToken_idx" ON "sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "sessions_refresh_token_family_idx" ON "sessions"("refresh_token_family");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "sessions_device_fingerprint_idx" ON "sessions"("device_fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_hash_key" ON "api_keys"("key_hash");

-- CreateIndex
CREATE INDEX "api_keys_key_hash_idx" ON "api_keys"("key_hash");

-- CreateIndex
CREATE INDEX "api_keys_serviceName_idx" ON "api_keys"("serviceName");

-- CreateIndex
CREATE INDEX "api_keys_userId_idx" ON "api_keys"("userId");

-- CreateIndex
CREATE INDEX "api_keys_is_active_expiresAt_idx" ON "api_keys"("is_active", "expiresAt");

-- CreateIndex
CREATE INDEX "two_factor_devices_userId_deviceId_idx" ON "two_factor_devices"("userId", "deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_tokens_token_key" ON "notification_tokens"("token");

-- CreateIndex
CREATE INDEX "notification_tokens_userId_idx" ON "notification_tokens"("userId");

-- CreateIndex
CREATE INDEX "notification_tokens_token_idx" ON "notification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_friends_user_id_friend_id_key" ON "user_friends"("user_id", "friend_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- CreateIndex
CREATE INDEX "consent_records_userId_consentType_idx" ON "consent_records"("userId", "consentType");

-- CreateIndex
CREATE INDEX "audit_logs_userId_createdAt_idx" ON "audit_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "PlaceSearchLog_createdAt_idx" ON "PlaceSearchLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "destinations_slug_key" ON "destinations"("slug");

-- CreateIndex
CREATE INDEX "destinations_country_city_idx" ON "destinations"("country", "city");

-- CreateIndex
CREATE INDEX "destinations_rating_idx" ON "destinations"("rating");

-- CreateIndex
CREATE INDEX "destinations_slug_idx" ON "destinations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "attractions_slug_key" ON "attractions"("slug");

-- CreateIndex
CREATE INDEX "attractions_destination_id_idx" ON "attractions"("destination_id");

-- CreateIndex
CREATE UNIQUE INDEX "packages_slug_key" ON "packages"("slug");

-- CreateIndex
CREATE INDEX "packages_type_idx" ON "packages"("type");

-- CreateIndex
CREATE INDEX "packages_destination_idx" ON "packages"("destination");

-- CreateIndex
CREATE INDEX "packages_rating_idx" ON "packages"("rating");

-- CreateIndex
CREATE INDEX "packages_slug_idx" ON "packages"("slug");

-- CreateIndex
CREATE INDEX "packages_agency_id_idx" ON "packages"("agency_id");

-- CreateIndex
CREATE UNIQUE INDEX "airlines_code_key" ON "airlines"("code");

-- CreateIndex
CREATE UNIQUE INDEX "airports_code_key" ON "airports"("code");

-- CreateIndex
CREATE INDEX "airports_code_idx" ON "airports"("code");

-- CreateIndex
CREATE INDEX "flights_airline_id_idx" ON "flights"("airline_id");

-- CreateIndex
CREATE INDEX "flights_agency_id_idx" ON "flights"("agency_id");

-- CreateIndex
CREATE UNIQUE INDEX "flight_details_flight_id_key" ON "flight_details"("flight_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_details_service_id_key" ON "service_details"("service_id");

-- CreateIndex
CREATE UNIQUE INDEX "cruises_name_key" ON "cruises"("name");

-- CreateIndex
CREATE INDEX "cruises_agency_id_idx" ON "cruises"("agency_id");

-- CreateIndex
CREATE UNIQUE INDEX "cruise_providers_slug_key" ON "cruise_providers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "accommodations_slug_key" ON "accommodations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "hotels_slug_key" ON "hotels"("slug");

-- CreateIndex
CREATE INDEX "hotels_slug_idx" ON "hotels"("slug");

-- CreateIndex
CREATE INDEX "hotels_city_country_idx" ON "hotels"("city", "country");

-- CreateIndex
CREATE INDEX "hotels_agency_id_idx" ON "hotels"("agency_id");

-- CreateIndex
CREATE UNIQUE INDEX "hotel_details_hotel_id_key" ON "hotel_details"("hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "hotel_providers_slug_key" ON "hotel_providers"("slug");

-- CreateIndex
CREATE INDEX "hotel_rooms_hotelId_idx" ON "hotel_rooms"("hotelId");

-- CreateIndex
CREATE UNIQUE INDEX "activities_slug_key" ON "activities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "providers_slug_key" ON "providers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- CreateIndex
CREATE INDEX "services_providerId_idx" ON "services"("providerId");

-- CreateIndex
CREATE INDEX "services_destinationId_idx" ON "services"("destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "activity_providers_slug_key" ON "activity_providers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "gastronomy_providers_slug_key" ON "gastronomy_providers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "event_providers_slug_key" ON "event_providers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "guide_providers_slug_key" ON "guide_providers"("slug");

-- CreateIndex
CREATE INDEX "service_images_serviceId_idx" ON "service_images"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "transfers_pickupLocation_dropoffLocation_vehicleType_provid_key" ON "transfers"("pickupLocation", "dropoffLocation", "vehicleType", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "transfer_providers_slug_key" ON "transfer_providers"("slug");

-- CreateIndex
CREATE INDEX "cart_items_userId_itemType_idx" ON "cart_items"("userId", "itemType");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_booking_reference_key" ON "bookings"("booking_reference");

-- CreateIndex
CREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");

-- CreateIndex
CREATE INDEX "bookings_agency_id_idx" ON "bookings"("agency_id");

-- CreateIndex
CREATE INDEX "bookings_client_id_idx" ON "bookings"("client_id");

-- CreateIndex
CREATE INDEX "bookings_destination_id_idx" ON "bookings"("destination_id");

-- CreateIndex
CREATE INDEX "bookings_trip_id_idx" ON "bookings"("trip_id");

-- CreateIndex
CREATE INDEX "bookings_booking_status_payment_status_idx" ON "bookings"("booking_status", "payment_status");

-- CreateIndex
CREATE INDEX "hotel_bookings_hotelId_idx" ON "hotel_bookings"("hotelId");

-- CreateIndex
CREATE INDEX "booking_history_bookingId_createdat_idx" ON "booking_history"("bookingId", "createdat");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_transaction_id_key" ON "payment_transactions"("transaction_id");

-- CreateIndex
CREATE INDEX "payment_transactions_booking_id_idx" ON "payment_transactions"("booking_id");

-- CreateIndex
CREATE INDEX "payment_transactions_user_id_idx" ON "payment_transactions"("user_id");

-- CreateIndex
CREATE INDEX "payment_transactions_status_idx" ON "payment_transactions"("status");

-- CreateIndex
CREATE INDEX "payment_transactions_transaction_id_idx" ON "payment_transactions"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transaction_id_key" ON "payments"("transaction_id");

-- CreateIndex
CREATE INDEX "payments_booking_id_idx" ON "payments"("booking_id");

-- CreateIndex
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_transaction_id_idx" ON "payments"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "vouchers_code_key" ON "vouchers"("code");

-- CreateIndex
CREATE INDEX "vouchers_userId_idx" ON "vouchers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "promotions_code_key" ON "promotions"("code");

-- CreateIndex
CREATE INDEX "promotions_active_expiresAt_idx" ON "promotions"("active", "expiresAt");

-- CreateIndex
CREATE INDEX "promotions_code_idx" ON "promotions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "voucher_usage_voucherId_userId_key" ON "voucher_usage"("voucherId", "userId");

-- CreateIndex
CREATE INDEX "trips_user_id_idx" ON "trips"("user_id");

-- CreateIndex
CREATE INDEX "trips_status_idx" ON "trips"("status");

-- CreateIndex
CREATE UNIQUE INDEX "itineraries_tripId_key" ON "itineraries"("tripId");

-- CreateIndex
CREATE INDEX "itinerary_days_itineraryId_idx" ON "itinerary_days"("itineraryId");

-- CreateIndex
CREATE UNIQUE INDEX "trip_destinations_trip_id_destination_id_sequence_order_key" ON "trip_destinations"("trip_id", "destination_id", "sequence_order");

-- CreateIndex
CREATE UNIQUE INDEX "saved_itineraries_slug_key" ON "saved_itineraries"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "saved_itineraries_shareCode_key" ON "saved_itineraries"("shareCode");

-- CreateIndex
CREATE INDEX "saved_itineraries_userId_idx" ON "saved_itineraries"("userId");

-- CreateIndex
CREATE INDEX "reviews_booking_id_idx" ON "reviews"("booking_id");

-- CreateIndex
CREATE INDEX "reviews_user_id_idx" ON "reviews"("user_id");

-- CreateIndex
CREATE INDEX "reviews_destination_id_idx" ON "reviews"("destination_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_itemType_itemId_key" ON "favorites"("userId", "itemType", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorites_userId_destinationId_key" ON "user_favorites"("userId", "destinationId");

-- CreateIndex
CREATE INDEX "ai_conversations_userId_idx" ON "ai_conversations"("userId");

-- CreateIndex
CREATE INDEX "ai_conversations_conversationStatus_idx" ON "ai_conversations"("conversationStatus");

-- CreateIndex
CREATE INDEX "ai_conversations_updatedAt_idx" ON "ai_conversations"("updatedAt");

-- CreateIndex
CREATE INDEX "ai_chat_messages_aiConversationId_idx" ON "ai_chat_messages"("aiConversationId");

-- CreateIndex
CREATE INDEX "ai_chat_messages_userId_idx" ON "ai_chat_messages"("userId");

-- CreateIndex
CREATE INDEX "ai_chat_messages_createdAt_idx" ON "ai_chat_messages"("createdAt");

-- CreateIndex
CREATE INDEX "ai_messages_aiConversationId_idx" ON "ai_messages"("aiConversationId");

-- CreateIndex
CREATE UNIQUE INDEX "ai_messages_conversationId_id_key" ON "ai_messages"("conversationId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_participants_roomId_userId_key" ON "chat_participants"("roomId", "userId");

-- CreateIndex
CREATE INDEX "chat_messages_roomId_createdAt_idx" ON "chat_messages"("roomId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "loyalty_programs_userId_key" ON "loyalty_programs"("userId");

-- CreateIndex
CREATE INDEX "loyalty_transactions_loyaltyProgramId_createdAt_idx" ON "loyalty_transactions"("loyaltyProgramId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_slug_idx" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_is_featured_idx" ON "articles"("is_featured");

-- CreateIndex
CREATE INDEX "quiz_attempts_quizId_userId_idx" ON "quiz_attempts"("quizId", "userId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "email_notifications_userId_idx" ON "email_notifications"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_settings_user_id_key" ON "notification_settings"("user_id");

-- CreateIndex
CREATE INDEX "crm_events_customerId_idx" ON "crm_events"("customerId");

-- CreateIndex
CREATE INDEX "crm_events_type_idx" ON "crm_events"("type");

-- CreateIndex
CREATE INDEX "crm_events_timestamp_idx" ON "crm_events"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "crm_customers_email_key" ON "crm_customers"("email");

-- CreateIndex
CREATE INDEX "crm_customers_email_idx" ON "crm_customers"("email");

-- CreateIndex
CREATE INDEX "crm_customers_cpfCnpj_idx" ON "crm_customers"("cpfCnpj");

-- CreateIndex
CREATE INDEX "crm_customers_city_state_idx" ON "crm_customers"("city", "state");

-- CreateIndex
CREATE UNIQUE INDEX "crm_bookings_reference_key" ON "crm_bookings"("reference");

-- CreateIndex
CREATE INDEX "crm_bookings_customerId_idx" ON "crm_bookings"("customerId");

-- CreateIndex
CREATE INDEX "crm_bookings_reference_idx" ON "crm_bookings"("reference");

-- CreateIndex
CREATE INDEX "crm_bookings_status_idx" ON "crm_bookings"("status");

-- CreateIndex
CREATE INDEX "crm_bookings_startDate_endDate_idx" ON "crm_bookings"("startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "crm_categories_slug_key" ON "crm_categories"("slug");

-- CreateIndex
CREATE INDEX "crm_categories_slug_idx" ON "crm_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "crm_products_sku_key" ON "crm_products"("sku");

-- CreateIndex
CREATE INDEX "crm_products_sku_idx" ON "crm_products"("sku");

-- CreateIndex
CREATE INDEX "crm_products_categoryId_idx" ON "crm_products"("categoryId");

-- CreateIndex
CREATE INDEX "crm_products_status_idx" ON "crm_products"("status");

-- CreateIndex
CREATE UNIQUE INDEX "embedding_cache_cacheKey_key" ON "embedding_cache"("cacheKey");

-- CreateIndex
CREATE INDEX "embedding_cache_cacheKey_idx" ON "embedding_cache"("cacheKey");

-- CreateIndex
CREATE INDEX "embedding_cache_model_idx" ON "embedding_cache"("model");

-- CreateIndex
CREATE INDEX "embedding_cache_expiresAt_idx" ON "embedding_cache"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "llm_cache_cacheKey_key" ON "llm_cache"("cacheKey");

-- CreateIndex
CREATE INDEX "llm_cache_cacheKey_idx" ON "llm_cache"("cacheKey");

-- CreateIndex
CREATE INDEX "llm_cache_expiresAt_idx" ON "llm_cache"("expiresAt");

-- CreateIndex
CREATE INDEX "job_runs_queue_type_status_createdAt_idx" ON "job_runs"("queue", "type", "status", "createdAt");

-- CreateIndex
CREATE INDEX "email_events_campaign_type_createdAt_idx" ON "email_events"("campaign", "type", "createdAt");

-- CreateIndex
CREATE INDEX "emission_factors_mode_subcategory_country_idx" ON "emission_factors"("mode", "subcategory", "country");

-- CreateIndex
CREATE UNIQUE INDEX "mode_subcategory_country" ON "emission_factors"("mode", "subcategory", "country");

-- CreateIndex
CREATE UNIQUE INDEX "airport_geo_code_key" ON "airport_geo"("code");

-- CreateIndex
CREATE INDEX "airport_geo_city_country_idx" ON "airport_geo"("city", "country");

-- CreateIndex
CREATE UNIQUE INDEX "model_versions_modelName_version_key" ON "model_versions"("modelName", "version");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_products_plan_code_key" ON "insurance_products"("plan_code");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_number_key" ON "invoices"("number");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cruise_details_cruise_id_key" ON "cruise_details"("cruise_id");

-- CreateIndex
CREATE UNIQUE INDEX "guide_details_guide_id_key" ON "guide_details"("guide_id");

-- CreateIndex
CREATE UNIQUE INDEX "article_destinations_article_id_destination_id_mention_type_key" ON "article_destinations"("article_id", "destination_id", "mention_type");

-- CreateIndex
CREATE UNIQUE INDEX "article_attractions_article_id_attraction_id_mention_type_key" ON "article_attractions"("article_id", "attraction_id", "mention_type");

-- CreateIndex
CREATE INDEX "search_suggestions_popularity_idx" ON "search_suggestions"("popularity");

-- CreateIndex
CREATE INDEX "search_suggestions_category_idx" ON "search_suggestions"("category");

-- CreateIndex
CREATE INDEX "popular_destinations_rating_idx" ON "popular_destinations"("rating");

-- CreateIndex
CREATE INDEX "popular_destinations_trending_idx" ON "popular_destinations"("trending");

-- CreateIndex
CREATE INDEX "trending_searches_count_idx" ON "trending_searches"("count");

-- CreateIndex
CREATE INDEX "trending_searches_last_searched_idx" ON "trending_searches"("last_searched");

-- CreateIndex
CREATE UNIQUE INDEX "ai_prompts_key_key" ON "ai_prompts"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ai_recommendations_context_type_context_id_key" ON "ai_recommendations"("context_type", "context_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_workflows_key_key" ON "ai_workflows"("key");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_slug_key" ON "suppliers"("slug");

-- CreateIndex
CREATE INDEX "suppliers_type_idx" ON "suppliers"("type");

-- CreateIndex
CREATE INDEX "suppliers_status_idx" ON "suppliers"("status");

-- CreateIndex
CREATE INDEX "suppliers_city_idx" ON "suppliers"("city");

-- CreateIndex
CREATE INDEX "suppliers_country_idx" ON "suppliers"("country");

-- CreateIndex
CREATE INDEX "supplier_contacts_supplier_id_idx" ON "supplier_contacts"("supplier_id");

-- CreateIndex
CREATE INDEX "commission_records_supplier_id_idx" ON "commission_records"("supplier_id");

-- CreateIndex
CREATE INDEX "commission_records_status_idx" ON "commission_records"("status");

-- CreateIndex
CREATE UNIQUE INDEX "destination_preferences_destination_id_key" ON "destination_preferences"("destination_id");

-- CreateIndex
CREATE INDEX "segmented_campaigns_destination_id_idx" ON "segmented_campaigns"("destination_id");

-- CreateIndex
CREATE INDEX "segmented_campaigns_status_idx" ON "segmented_campaigns"("status");

-- CreateIndex
CREATE INDEX "segmented_campaigns_scheduled_date_idx" ON "segmented_campaigns"("scheduled_date");

-- CreateIndex
CREATE INDEX "post_trip_follow_ups_booking_id_idx" ON "post_trip_follow_ups"("booking_id");

-- CreateIndex
CREATE INDEX "post_trip_follow_ups_user_id_idx" ON "post_trip_follow_ups"("user_id");

-- CreateIndex
CREATE INDEX "post_trip_follow_ups_status_idx" ON "post_trip_follow_ups"("status");

-- CreateIndex
CREATE INDEX "post_trip_follow_ups_follow_up_type_idx" ON "post_trip_follow_ups"("follow_up_type");

-- CreateIndex
CREATE INDEX "birthday_alerts_user_id_idx" ON "birthday_alerts"("user_id");

-- CreateIndex
CREATE INDEX "birthday_alerts_alert_status_idx" ON "birthday_alerts"("alert_status");

-- CreateIndex
CREATE INDEX "birthday_alerts_days_until_birthday_idx" ON "birthday_alerts"("days_until_birthday");

-- CreateIndex
CREATE UNIQUE INDEX "follow_up_templates_type_key" ON "follow_up_templates"("type");

-- CreateIndex
CREATE INDEX "preference_events_user_id_idx" ON "preference_events"("user_id");

-- CreateIndex
CREATE INDEX "preference_events_session_id_idx" ON "preference_events"("session_id");

-- CreateIndex
CREATE INDEX "preference_events_preference_type_idx" ON "preference_events"("preference_type");

-- CreateIndex
CREATE INDEX "preference_events_timestamp_idx" ON "preference_events"("timestamp");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "community_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_reactions" ADD CONSTRAINT "community_reactions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_reactions" ADD CONSTRAINT "community_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "two_factor_devices" ADD CONSTRAINT "two_factor_devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_tokens" ADD CONSTRAINT "notification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_friends" ADD CONSTRAINT "user_friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_friends" ADD CONSTRAINT "user_friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attractions" ADD CONSTRAINT "attractions_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "airlines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_departure_airport_id_fkey" FOREIGN KEY ("departure_airport_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_arrival_airport_id_fkey" FOREIGN KEY ("arrival_airport_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_details" ADD CONSTRAINT "flight_details_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_details" ADD CONSTRAINT "service_details_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cruises" ADD CONSTRAINT "cruises_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cruise_ships" ADD CONSTRAINT "cruise_ships_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "cruise_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodations" ADD CONSTRAINT "accommodations_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_details" ADD CONSTRAINT "hotel_details_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_properties" ADD CONSTRAINT "hotel_properties_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "hotel_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_rooms" ADD CONSTRAINT "hotel_rooms_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_offerings" ADD CONSTRAINT "activity_offerings_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "activity_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gastronomy_restaurants" ADD CONSTRAINT "gastronomy_restaurants_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "gastronomy_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_offerings" ADD CONSTRAINT "event_offerings_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "event_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guide_offerings" ADD CONSTRAINT "guide_offerings_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "guide_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_images" ADD CONSTRAINT "service_images_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_vehicles" ADD CONSTRAINT "transfer_vehicles_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "transfer_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_trip_destination_id_fkey" FOREIGN KEY ("trip_destination_id") REFERENCES "trip_destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_bookings" ADD CONSTRAINT "flight_bookings_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_bookings" ADD CONSTRAINT "flight_bookings_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "flights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_bookings" ADD CONSTRAINT "hotel_bookings_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_bookings" ADD CONSTRAINT "hotel_bookings_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_bookings" ADD CONSTRAINT "hotel_bookings_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "hotel_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_bookings" ADD CONSTRAINT "service_bookings_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_bookings" ADD CONSTRAINT "service_bookings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cruise_bookings" ADD CONSTRAINT "cruise_bookings_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cruise_bookings" ADD CONSTRAINT "cruise_bookings_cruiseId_fkey" FOREIGN KEY ("cruiseId") REFERENCES "cruises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_bookings" ADD CONSTRAINT "transfer_bookings_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_bookings" ADD CONSTRAINT "transfer_bookings_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "transfers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_history" ADD CONSTRAINT "booking_history_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_usage" ADD CONSTRAINT "voucher_usage_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_usage" ADD CONSTRAINT "voucher_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_days" ADD CONSTRAINT "itinerary_days_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "itineraries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_destinations" ADD CONSTRAINT "trip_destinations_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_destinations" ADD CONSTRAINT "trip_destinations_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_itineraries" ADD CONSTRAINT "saved_itineraries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_itineraries" ADD CONSTRAINT "saved_itineraries_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_attraction_id_fkey" FOREIGN KEY ("attraction_id") REFERENCES "attractions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_chat_messages" ADD CONSTRAINT "ai_chat_messages_aiConversationId_fkey" FOREIGN KEY ("aiConversationId") REFERENCES "ai_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_chat_messages" ADD CONSTRAINT "ai_chat_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_aiConversationId_fkey" FOREIGN KEY ("aiConversationId") REFERENCES "ai_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_roomId_userId_fkey" FOREIGN KEY ("roomId", "userId") REFERENCES "chat_participants"("roomId", "userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_programs" ADD CONSTRAINT "loyalty_programs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_loyaltyProgramId_fkey" FOREIGN KEY ("loyaltyProgramId") REFERENCES "loyalty_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_moderated_by_fkey" FOREIGN KEY ("moderated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_comments" ADD CONSTRAINT "article_comments_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_comments" ADD CONSTRAINT "article_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_comments" ADD CONSTRAINT "article_comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "article_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_comments" ADD CONSTRAINT "article_comments_moderated_by_fkey" FOREIGN KEY ("moderated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_settings" ADD CONSTRAINT "notification_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_bookings" ADD CONSTRAINT "crm_bookings_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "crm_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_products" ADD CONSTRAINT "crm_products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "crm_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transportations" ADD CONSTRAINT "transportations_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cruise_details" ADD CONSTRAINT "cruise_details_cruise_id_fkey" FOREIGN KEY ("cruise_id") REFERENCES "cruises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guide_details" ADD CONSTRAINT "guide_details_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "local_guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_destinations" ADD CONSTRAINT "article_destinations_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_destinations" ADD CONSTRAINT "article_destinations_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_attractions" ADD CONSTRAINT "article_attractions_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_attractions" ADD CONSTRAINT "article_attractions_attraction_id_fkey" FOREIGN KEY ("attraction_id") REFERENCES "attractions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_contacts" ADD CONSTRAINT "supplier_contacts_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_records" ADD CONSTRAINT "commission_records_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preference_events" ADD CONSTRAINT "preference_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_predictions" ADD CONSTRAINT "response_predictions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
