-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NULL,
    `name` VARCHAR(255) NULL,
    `username` VARCHAR(50) NULL,
    `agency_id` VARCHAR(191) NULL,
    `avatar` TEXT NULL,
    `avatar_thumbnail` TEXT NULL,
    `avatar_url` TEXT NULL,
    `bio` TEXT NULL,
    `location` VARCHAR(255) NULL,
    `phone` VARCHAR(20) NULL,
    `birth_date` DATE NULL,
    `gender` VARCHAR(20) NULL,
    `address` VARCHAR(255) NULL,
    `city` VARCHAR(100) NULL,
    `state` VARCHAR(100) NULL,
    `country` VARCHAR(100) NULL,
    `postal_code` VARCHAR(20) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED') NOT NULL DEFAULT 'ACTIVE',
    `role` ENUM('USER', 'ADMIN', 'MODERATOR', 'PARTNER', 'SUPPORT', 'PREMIUM', 'SUPER_ADMIN', 'PREMIUM_USER', 'TRAVEL_AGENT') NOT NULL DEFAULT 'USER',
    `join_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_active` DATETIME NOT NULL,
    `last_login` DATETIME NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `email_verified` BOOLEAN NOT NULL DEFAULT false,
    `phone_verified` BOOLEAN NOT NULL DEFAULT false,
    `email_verified_at` DATETIME NULL,
    `email_verification_token` VARCHAR(255) NULL,
    `password_changed_at` DATETIME NULL,
    `two_factor_secret` VARCHAR(255) NULL,
    `two_factor_enabled` BOOLEAN NOT NULL DEFAULT false,
    `two_factor_backup_code` JSON NOT NULL,
    `forgot_password_token` VARCHAR(255) NULL,
    `forgot_password_token_expiry` DATETIME NULL,
    `preferred_currency` ENUM('BRL', 'USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'THB', 'AED', 'MAD', 'NZD', 'DKK', 'CNY', 'INR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU') NULL DEFAULT 'BRL',
    `preferred_language` VARCHAR(10) NULL DEFAULT 'pt-BR',
    `travel_frequency` ENUM('OCCASIONAL', 'FREQUENT', 'SEASONAL', 'BUSINESS', 'OCCASIONAL_BUSINESS') NOT NULL DEFAULT 'OCCASIONAL',
    `timezone` VARCHAR(50) NULL,
    `theme` VARCHAR(20) NULL,
    `terms_accepted` BOOLEAN NOT NULL DEFAULT false,
    `privacy_accepted` BOOLEAN NOT NULL DEFAULT false,
    `accepted_terms_date` DATETIME NULL,
    `accepted_privacy_date` DATETIME NULL,
    `marketing_opt_in` BOOLEAN NOT NULL DEFAULT false,
    `data_processing_opt_in` BOOLEAN NOT NULL DEFAULT false,
    `data_retention_consent` BOOLEAN NOT NULL DEFAULT false,
    `gdpr_consent` BOOLEAN NOT NULL DEFAULT false,
    `profile_completion` SMALLINT NOT NULL DEFAULT 0,
    `experience_points` INTEGER NOT NULL DEFAULT 0,
    `streak_count` INTEGER NOT NULL DEFAULT 0,
    `favorite_destinations` JSON NULL,
    `friends` JSON NULL,
    `blocked_users` JSON NULL,
    `deleted_at` DATETIME NULL,
    `deactivated_at` DATETIME NULL,
    `blocked_at` DATETIME NULL,
    `blocked_reason` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `permissions` JSON NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `community_posts` (
    `id` VARCHAR(191) NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `body` TEXT NOT NULL,
    `tags` JSON NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,
    `deleted_at` DATETIME NULL,

    INDEX `community_posts_author_id_idx`(`author_id`),
    INDEX `community_posts_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `community_comments` (
    `id` VARCHAR(191) NOT NULL,
    `post_id` VARCHAR(191) NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `parent_id` VARCHAR(191) NULL,
    `body` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,
    `deleted_at` DATETIME NULL,

    INDEX `community_comments_post_id_idx`(`post_id`),
    INDEX `community_comments_author_id_idx`(`author_id`),
    INDEX `community_comments_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `community_reactions` (
    `id` VARCHAR(191) NOT NULL,
    `post_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `type` ENUM('LIKE') NOT NULL DEFAULT 'LIKE',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `community_reactions_post_id_idx`(`post_id`),
    INDEX `community_reactions_user_id_idx`(`user_id`),
    UNIQUE INDEX `community_reactions_post_id_user_id_type_key`(`post_id`, `user_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agencies` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `domain` VARCHAR(255) NULL,
    `logo_url` TEXT NULL,
    `primary_color` VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
    `secondary_color` VARCHAR(7) NOT NULL DEFAULT '#10B981',
    `accent_color` VARCHAR(7) NOT NULL DEFAULT '#F59E0B',
    `plan` ENUM('STARTER', 'PROFESSIONAL', 'ENTERPRISE') NOT NULL DEFAULT 'STARTER',
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `settings` JSON NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,
    `trial_ends_at` DATETIME NULL,
    `subscription_id` VARCHAR(255) NULL,
    `max_users` INTEGER NOT NULL DEFAULT 5,
    `max_clients` INTEGER NOT NULL DEFAULT 100,
    `features` JSON NOT NULL,

    UNIQUE INDEX `agencies_slug_key`(`slug`),
    UNIQUE INDEX `agencies_domain_key`(`domain`),
    INDEX `agencies_slug_idx`(`slug`),
    INDEX `agencies_domain_idx`(`domain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clients` (
    `id` VARCHAR(191) NOT NULL,
    `agency_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(20) NULL,
    `document` VARCHAR(50) NULL,
    `birth_date` DATE NULL,
    `address` TEXT NULL,
    `city` VARCHAR(100) NULL,
    `country` VARCHAR(100) NULL,
    `notes` TEXT NULL,
    `tags` JSON NOT NULL,
    `metadata` JSON NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `clients_agency_id_idx`(`agency_id`),
    INDEX `clients_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leads` (
    `id` VARCHAR(191) NOT NULL,
    `agency_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(20) NULL,
    `source` VARCHAR(100) NULL,
    `status` ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST', 'ARCHIVED') NOT NULL DEFAULT 'NEW',
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
    `value` DECIMAL(10, 2) NULL,
    `notes` TEXT NULL,
    `tags` JSON NOT NULL,
    `metadata` JSON NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `leads_agency_id_idx`(`agency_id`),
    INDEX `leads_status_idx`(`status`),
    INDEX `leads_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `provider` VARCHAR(50) NOT NULL,
    `providerAccountId` VARCHAR(255) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(50) NULL,
    `scope` TEXT NULL,
    `id_token` TEXT NULL,
    `session_state` TEXT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `accounts_userId_idx`(`userId`),
    UNIQUE INDEX `accounts_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_verification_tokens` (
    `tokenId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `expiresAt` DATETIME NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `email_verification_tokens_token_key`(`token`),
    INDEX `email_verification_tokens_userId_idx`(`userId`),
    INDEX `email_verification_tokens_token_idx`(`token`),
    INDEX `email_verification_tokens_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`tokenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_reset_tokens` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expiresAt` DATETIME NOT NULL,
    `usedAt` DATETIME NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `password_reset_tokens_token_key`(`token`),
    INDEX `password_reset_tokens_userId_idx`(`userId`),
    INDEX `password_reset_tokens_token_idx`(`token`),
    INDEX `password_reset_tokens_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(500) NOT NULL,
    `refreshToken` VARCHAR(500) NULL,
    `deviceInfo` JSON NULL,
    `device_fingerprint` VARCHAR(255) NULL,
    `ip_address` VARCHAR(45) NULL,
    `ip_hash` VARCHAR(64) NULL,
    `refresh_token_family` VARCHAR(255) NULL,
    `token_sequence` INTEGER NOT NULL DEFAULT 0,
    `expiresAt` DATETIME NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `lastUsedAt` TIMESTAMP(0) NOT NULL,
    `last_activity_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `revokedAt` DATETIME NULL,
    `is_revoked` BOOLEAN NOT NULL DEFAULT false,
    `security_flags` JSON NOT NULL,

    UNIQUE INDEX `sessions_token_key`(`token`),
    UNIQUE INDEX `sessions_refreshToken_key`(`refreshToken`),
    INDEX `sessions_userId_idx`(`userId`),
    INDEX `sessions_token_idx`(`token`),
    INDEX `sessions_refreshToken_idx`(`refreshToken`),
    INDEX `sessions_refresh_token_family_idx`(`refresh_token_family`),
    INDEX `sessions_expiresAt_idx`(`expiresAt`),
    INDEX `sessions_device_fingerprint_idx`(`device_fingerprint`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `api_keys` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `key_hash` VARCHAR(255) NOT NULL,
    `key_prefix` VARCHAR(8) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `serviceName` VARCHAR(100) NOT NULL,
    `permissions` JSON NOT NULL,
    `scopes` JSON NOT NULL,
    `allowed_ips` JSON NOT NULL,
    `rate_limit` INTEGER NOT NULL DEFAULT 1000,
    `expiresAt` DATETIME NULL,
    `lastUsedAt` DATETIME NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `revokedAt` DATETIME NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_by` VARCHAR(191) NULL,
    `revoked_by` VARCHAR(191) NULL,
    `revoke_reason` TEXT NULL,

    UNIQUE INDEX `api_keys_key_hash_key`(`key_hash`),
    INDEX `api_keys_key_hash_idx`(`key_hash`),
    INDEX `api_keys_serviceName_idx`(`serviceName`),
    INDEX `api_keys_userId_idx`(`userId`),
    INDEX `api_keys_is_active_expiresAt_idx`(`is_active`, `expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `two_factor_devices` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `deviceId` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `two_factor_devices_userId_deviceId_idx`(`userId`, `deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification_tokens` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(500) NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `lastUsedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `notification_tokens_token_key`(`token`),
    INDEX `notification_tokens_userId_idx`(`userId`),
    INDEX `notification_tokens_token_idx`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_friends` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `friend_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `user_friends_user_id_friend_id_key`(`user_id`, `friend_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_preferences` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `email_notifications` BOOLEAN NOT NULL DEFAULT true,
    `sms_notifications` BOOLEAN NOT NULL DEFAULT false,
    `push_notifications` BOOLEAN NOT NULL DEFAULT true,
    `promotional_emails` BOOLEAN NOT NULL DEFAULT true,
    `preferred_accommodation_type` JSON NULL,
    `budget_range_min` DECIMAL(10, 2) NULL,
    `budget_range_max` DECIMAL(10, 2) NULL,
    `favorite_destination_types` JSON NOT NULL,
    `favorite_activities` JSON NOT NULL,
    `travel_style` VARCHAR(50) NULL,
    `budget_range` VARCHAR(50) NULL,
    `accommodation_preference` VARCHAR(100) NULL,
    `trip_duration` VARCHAR(50) NULL,
    `group_size` VARCHAR(50) NULL,
    `pace_preference` VARCHAR(50) NULL,
    `cuisine_preferences` JSON NOT NULL,
    `dietary_restrictions` JSON NOT NULL,
    `auto_accept_best_price` BOOLEAN NOT NULL DEFAULT false,
    `receive_price_alerts` BOOLEAN NOT NULL DEFAULT true,
    `price_alert_threshold` DECIMAL(3, 2) NULL,
    `dark_mode` BOOLEAN NOT NULL DEFAULT false,
    `temperature_unit` VARCHAR(1) NULL,
    `distance_unit` VARCHAR(2) NULL,
    `ai_settings` JSON NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `user_preferences_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consent_records` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `consentType` VARCHAR(100) NOT NULL,
    `version` VARCHAR(20) NOT NULL,
    `granted` BOOLEAN NOT NULL,
    `grantedAt` DATETIME NOT NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` TEXT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `consent_records_userId_consentType_idx`(`userId`, `consentType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `action` VARCHAR(100) NOT NULL,
    `entity` VARCHAR(50) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `changes` JSON NULL,
    `metadata` JSON NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` TEXT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `audit_logs_userId_createdAt_idx`(`userId`, `createdAt`),
    INDEX `audit_logs_action_idx`(`action`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlaceSearchLog` (
    `id` VARCHAR(191) NOT NULL,
    `lat` DOUBLE NOT NULL,
    `lon` DOUBLE NOT NULL,
    `radius` INTEGER NOT NULL,
    `types` JSON NOT NULL,
    `durationMs` INTEGER NOT NULL,
    `cached` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `PlaceSearchLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `destinations` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `country_code` VARCHAR(2) NULL,
    `city` VARCHAR(100) NOT NULL,
    `region` VARCHAR(100) NULL,
    `postal_code` VARCHAR(20) NULL,
    `description` TEXT NULL,
    `short_description` VARCHAR(500) NULL,
    `long_description` TEXT NULL,
    `image_url` VARCHAR(500) NULL,
    `images` JSON NULL,
    `location_latlon` JSON NULL,
    `latitude` DECIMAL(10, 8) NULL,
    `longitude` DECIMAL(11, 8) NULL,
    `timezone` VARCHAR(50) NULL,
    `altitude_meters` INTEGER NULL,
    `price_per_day` FLOAT NULL,
    `price_per_night` FLOAT NULL,
    `currency` ENUM('BRL', 'USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'THB', 'AED', 'MAD', 'NZD', 'DKK', 'CNY', 'INR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU') NOT NULL DEFAULT 'BRL',
    `price_reliability` FLOAT NULL,
    `rating` DECIMAL(3, 2) NULL DEFAULT 0,
    `reviews_count` INTEGER NOT NULL DEFAULT 0,
    `recommendation_percentage` INTEGER NOT NULL DEFAULT 0,
    `climate_info` TEXT NULL,
    `seasonality` ENUM('TROPICAL', 'TEMPERATE', 'CONTINENTAL', 'ARCTIC', 'DESERT', 'MEDITERRANEAN', 'SUBTROPICAL') NOT NULL DEFAULT 'TEMPERATE',
    `best_time_to_visit` VARCHAR(100) NULL,
    `worst_time_to_visit` VARCHAR(100) NULL,
    `average_temperature_min` DECIMAL(5, 2) NULL,
    `average_temperature_max` DECIMAL(5, 2) NULL,
    `visa_requirements` TEXT NULL,
    `visa_requirements_for_nationalities` JSON NULL,
    `primary_language` VARCHAR(100) NULL,
    `languages_spoken` JSON NULL,
    `safety_rating` INTEGER NOT NULL DEFAULT 5,
    `crime_rate_percentage` DECIMAL(5, 2) NULL,
    `accessibility_level` ENUM('FULL', 'PARTIAL', 'LIMITED', 'NONE') NOT NULL DEFAULT 'PARTIAL',
    `category` ENUM('CITY', 'BEACH', 'MOUNTAIN', 'COUNTRYSIDE', 'ISLAND', 'HERITAGE', 'SAFARI', 'DESERT', 'SKI', 'CRUISE', 'NATURE', 'ADVENTURE', 'CULTURAL', 'RELAXATION', 'NIGHTLIFE', 'FAMILY', 'ROMANTIC', 'LUXURY', 'BACKPACKING', 'WELLNESS') NOT NULL DEFAULT 'CITY',
    `tags` JSON NOT NULL,
    `travel_styles` JSON NULL,
    `ai_description` TEXT NULL,
    `ai_recommendations` JSON NULL,
    `ai_local_tips` JSON NULL,
    `popularity_score` DECIMAL(5, 2) NULL DEFAULT 0,
    `trending_score` DECIMAL(5, 2) NULL DEFAULT 0,
    `seasonality_data` JSON NULL,
    `structured_data` JSON NULL,
    `meta_title` VARCHAR(255) NULL,
    `meta_description` VARCHAR(500) NULL,
    `meta_keywords` VARCHAR(500) NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `is_popular` BOOLEAN NOT NULL DEFAULT false,
    `is_trending` BOOLEAN NOT NULL DEFAULT false,
    `moderation_status` VARCHAR(50) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,
    `published_at` DATETIME NULL,
    `indexed_at` DATETIME NULL,
    `deleted_at` DATETIME NULL,

    UNIQUE INDEX `destinations_slug_key`(`slug`),
    INDEX `destinations_country_city_idx`(`country`, `city`),
    INDEX `destinations_rating_idx`(`rating`),
    INDEX `destinations_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attractions` (
    `id` VARCHAR(191) NOT NULL,
    `destination_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `category` VARCHAR(100) NOT NULL,
    `sub_category` VARCHAR(100) NULL,
    `address` TEXT NOT NULL,
    `postal_code` VARCHAR(20) NULL,
    `location_latlon` JSON NULL,
    `latitude` DECIMAL(10, 8) NULL,
    `longitude` DECIMAL(11, 8) NULL,
    `price_currency` ENUM('BRL', 'USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'THB', 'AED', 'MAD', 'NZD', 'DKK', 'CNY', 'INR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU') NULL DEFAULT 'BRL',
    `price_amount` DECIMAL(10, 2) NULL,
    `price_range` VARCHAR(10) NULL,
    `free_entry` BOOLEAN NULL DEFAULT false,
    `opening_hours` JSON NULL,
    `is_open_24h` BOOLEAN NULL DEFAULT false,
    `contact_info` JSON NULL,
    `website_url` VARCHAR(500) NULL,
    `booking_url` VARCHAR(500) NULL,
    `image_url` VARCHAR(500) NULL,
    `images` JSON NULL,
    `rating` DECIMAL(3, 2) NULL DEFAULT 0,
    `reviews_count` INTEGER NOT NULL DEFAULT 0,
    `accessibility_features` JSON NULL,
    `amenities` JSON NULL,
    `accepted_payment_methods` JSON NULL,
    `average_visit_duration_minutes` INTEGER NULL,
    `best_time_to_visit` VARCHAR(100) NULL,
    `languages_guide_available` JSON NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `attractions_slug_key`(`slug`),
    INDEX `attractions_destination_id_idx`(`destination_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `packages` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `type` ENUM('adventure', 'beach', 'city_break', 'cultural', 'luxury', 'family', 'eco', 'romantic', 'wellness', 'ski', 'cruise') NOT NULL,
    `destination` VARCHAR(255) NOT NULL,
    `durationdays` INTEGER NOT NULL DEFAULT 7,
    `agency_id` VARCHAR(191) NULL,
    `priceoriginal` DECIMAL(10, 2) NULL,
    `pricecurrent` DECIMAL(10, 2) NULL,
    `currency` ENUM('BRL', 'USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'THB', 'AED', 'MAD', 'NZD', 'DKK', 'CNY', 'INR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU') NOT NULL DEFAULT 'EUR',
    `imageurl` TEXT NULL,
    `images` JSON NULL,
    `itinerary` JSON NULL,
    `tags` JSON NOT NULL,
    `rating` FLOAT NULL DEFAULT 0,
    `reviewscount` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `metadata` JSON NULL,
    `provider` VARCHAR(255) NULL,
    `metatitle` VARCHAR(60) NULL,
    `metadescription` VARCHAR(160) NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedat` TIMESTAMP(0) NOT NULL,
    `deletedat` DATETIME NULL,

    UNIQUE INDEX `packages_slug_key`(`slug`),
    INDEX `packages_type_idx`(`type`),
    INDEX `packages_destination_idx`(`destination`),
    INDEX `packages_rating_idx`(`rating`),
    INDEX `packages_slug_idx`(`slug`),
    INDEX `packages_agency_id_idx`(`agency_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `airlines` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(3) NOT NULL,
    `logo` TEXT NULL,
    `website` VARCHAR(500) NULL,
    `rating` FLOAT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `airlines_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `airports` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(3) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `latitude` FLOAT NULL,
    `longitude` FLOAT NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `lounge_available` BOOLEAN NOT NULL DEFAULT false,
    `lounge_details` JSON NULL,
    `priority_services` JSON NULL,

    UNIQUE INDEX `airports_code_key`(`code`),
    INDEX `airports_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flights` (
    `id` VARCHAR(191) NOT NULL,
    `airline_id` VARCHAR(191) NOT NULL,
    `departure_airport_id` VARCHAR(191) NOT NULL,
    `arrival_airport_id` VARCHAR(191) NOT NULL,
    `flight_number` VARCHAR(20) NOT NULL,
    `agency_id` VARCHAR(191) NULL,
    `departure_time` DATETIME NOT NULL,
    `arrival_time` DATETIME NOT NULL,
    `duration` INTEGER NOT NULL,
    `total_seats` SMALLINT NOT NULL,
    `available_seats` SMALLINT NOT NULL,
    `base_price` DECIMAL(10, 2) NOT NULL,
    `currency` ENUM('BRL', 'USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'THB', 'AED', 'MAD', 'NZD', 'DKK', 'CNY', 'INR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU') NOT NULL DEFAULT 'BRL',
    `status` VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    `published` BOOLEAN NOT NULL DEFAULT true,
    `metadata` JSON NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedat` TIMESTAMP(0) NOT NULL,

    INDEX `flights_airline_id_idx`(`airline_id`),
    INDEX `flights_agency_id_idx`(`agency_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flight_details` (
    `id` VARCHAR(191) NOT NULL,
    `flight_id` VARCHAR(191) NOT NULL,
    `overview` JSON NULL,
    `pricing` JSON NULL,
    `fare_tiers` JSON NULL,
    `baggage` JSON NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedat` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `flight_details_flight_id_key`(`flight_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_details` (
    `id` VARCHAR(191) NOT NULL,
    `service_id` VARCHAR(191) NOT NULL,
    `overview` JSON NULL,
    `itineraries` JSON NULL,
    `pricing` JSON NULL,
    `availability` JSON NULL,
    `policies` JSON NULL,
    `provider_info` JSON NULL,
    `highlights` JSON NULL,
    `included` JSON NULL,
    `excluded` JSON NULL,
    `images` JSON NULL,
    `ratings` FLOAT NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedat` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `service_details_service_id_key`(`service_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cruises` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `operator` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `image` TEXT NULL,
    `agency_id` VARCHAR(191) NULL,
    `startPort` VARCHAR(255) NOT NULL,
    `endPort` VARCHAR(255) NOT NULL,
    `ports` JSON NOT NULL,
    `departureDate` DATE NOT NULL,
    `returnDate` DATE NOT NULL,
    `duration` SMALLINT NOT NULL,
    `totalCapacity` SMALLINT NOT NULL,
    `availableCapacity` SMALLINT NOT NULL,
    `occupancy` FLOAT NULL,
    `pricePerPerson` DECIMAL(10, 2) NOT NULL,
    `currency` ENUM('BRL', 'USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'THB', 'AED', 'MAD', 'NZD', 'DKK', 'CNY', 'INR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU') NOT NULL DEFAULT 'BRL',
    `priceIncludes` JSON NOT NULL,
    `shipName` VARCHAR(255) NULL,
    `cabinTypes` JSON NOT NULL,
    `amenities` JSON NOT NULL,
    `rating` FLOAT NULL DEFAULT 0,
    `reviewsCount` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedat` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `cruises_name_key`(`name`),
    INDEX `cruises_agency_id_idx`(`agency_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cruise_steps` (
    `id` VARCHAR(191) NOT NULL,
    `iconName` VARCHAR(191) NOT NULL,
    `iconColor` VARCHAR(191) NOT NULL,
    `titleKey` VARCHAR(191) NOT NULL,
    `descKey` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cruise_fleet` (
    `id` VARCHAR(191) NOT NULL,
    `nameKey` VARCHAR(191) NOT NULL,
    `descKey` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `passengers` INTEGER NOT NULL,
    `cabins` INTEGER NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cruise_providers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cruise_providers_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cruise_ships` (
    `id` VARCHAR(191) NOT NULL,
    `providerId` VARCHAR(191) NOT NULL,
    `shipName` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `cabins` INTEGER NOT NULL,
    `basePrice` DOUBLE NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `features` JSON NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accommodations` (
    `id` VARCHAR(191) NOT NULL,
    `destination_id` VARCHAR(191) NULL,
    `name` TEXT NOT NULL,
    `slug` VARCHAR(500) NOT NULL,
    `type` TEXT NULL,
    `description` TEXT NULL,
    `address` TEXT NULL,
    `price_per_night` DECIMAL(10, 2) NULL,
    `currency` TEXT NULL,
    `image` TEXT NULL,
    `images` JSON NULL,
    `rating` DECIMAL(3, 1) NULL,
    `amenities` JSON NULL,
    `latitude` DECIMAL(10, 6) NULL,
    `longitude` DECIMAL(10, 6) NULL,
    `sustainability_score` DECIMAL(4, 1) NULL,
    `booking_url` TEXT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedat` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `accommodations_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotels` (
    `id` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `slug` VARCHAR(500) NOT NULL,
    `description` TEXT NULL,
    `image` TEXT NULL,
    `city` VARCHAR(100) NULL,
    `country` VARCHAR(100) NULL,
    `star_rating` INTEGER NULL,
    `amenities` JSON NOT NULL,
    `price_per_night` DECIMAL(10, 2) NULL,
    `currency` TEXT NULL,
    `rating` DECIMAL(3, 1) NULL,
    `reviews_count` INTEGER NULL,
    `published` BOOLEAN NULL DEFAULT true,
    `featured` BOOLEAN NULL DEFAULT false,
    `metadata` JSON NULL,
    `agency_id` VARCHAR(191) NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedat` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `hotels_slug_key`(`slug`),
    INDEX `hotels_slug_idx`(`slug`),
    INDEX `hotels_city_country_idx`(`city`, `country`),
    INDEX `hotels_agency_id_idx`(`agency_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotel_details` (
    `id` VARCHAR(191) NOT NULL,
    `hotel_id` VARCHAR(191) NOT NULL,
    `overview` JSON NULL,
    `itineraries` JSON NULL,
    `pricing` JSON NULL,
    `availability` JSON NULL,
    `policies` JSON NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedat` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `hotel_details_hotel_id_key`(`hotel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotel_steps` (
    `id` VARCHAR(191) NOT NULL,
    `iconName` VARCHAR(191) NOT NULL,
    `iconColor` VARCHAR(191) NOT NULL,
    `titleKey` VARCHAR(191) NOT NULL,
    `descKey` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotel_fleet` (
    `id` VARCHAR(191) NOT NULL,
    `nameKey` VARCHAR(191) NOT NULL,
    `descKey` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `maxOccupancy` INTEGER NOT NULL,
    `beds` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotel_providers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `hotel_providers_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotel_properties` (
    `id` VARCHAR(191) NOT NULL,
    `providerId` VARCHAR(191) NOT NULL,
    `propertyName` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `starRating` INTEGER NOT NULL,
    `basePrice` DOUBLE NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `features` JSON NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotel_rooms` (
    `id` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `roomType` VARCHAR(50) NOT NULL,
    `maxOccupancy` SMALLINT NOT NULL,
    `beds` JSON NULL,
    `amenities` JSON NOT NULL,
    `pricePerNight` DECIMAL(10, 2) NOT NULL,
    `currency` ENUM('BRL', 'USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'THB', 'AED', 'MAD', 'NZD', 'DKK', 'CNY', 'INR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU') NOT NULL DEFAULT 'BRL',
    `totalRooms` SMALLINT NOT NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedat` TIMESTAMP(0) NOT NULL,

    INDEX `hotel_rooms_hotelId_idx`(`hotelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activities` (
    `id` VARCHAR(191) NOT NULL,
    `destination_id` VARCHAR(191) NULL,
    `name` TEXT NOT NULL,
    `slug` VARCHAR(500) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(10, 2) NULL,
    `currency` TEXT NULL,
    `duration_text` TEXT NULL,
    `image` TEXT NULL,
    `rating` DECIMAL(3, 1) NULL,
    `categories` JSON NULL,
    `location` TEXT NULL,
    `booking_url` TEXT NULL,
    `sustainability_score` DECIMAL(4, 1) NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `activities_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `providers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `logo` TEXT NULL,
    `website` VARCHAR(500) NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(20) NULL,
    `rating` FLOAT NULL DEFAULT 0,
    `reviewsCount` INTEGER NOT NULL DEFAULT 0,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `partnership` VARCHAR(50) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedat` TIMESTAMP(0) NOT NULL,
    `deletedAt` DATETIME NULL,

    UNIQUE INDEX `providers_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `services` (
    `id` VARCHAR(191) NOT NULL,
    `providerId` VARCHAR(191) NULL,
    `destinationId` VARCHAR(191) NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `shortDesc` VARCHAR(500) NULL,
    `category` VARCHAR(50) NOT NULL,
    `subcategory` VARCHAR(50) NULL,
    `coverImage` TEXT NULL,
    `imageGallery` JSON NULL,
    `features` JSON NOT NULL,
    `amenities` JSON NOT NULL,
    `tags` JSON NOT NULL,
    `included` JSON NOT NULL,
    `excluded` JSON NOT NULL,
    `requirements` JSON NOT NULL,
    `capacity` SMALLINT NULL,
    `minBooking` SMALLINT NULL,
    `maxBooking` SMALLINT NULL,
    `instantConfirm` BOOLEAN NOT NULL DEFAULT false,
    `price` JSON NOT NULL,
    `priceDisplay` VARCHAR(100) NOT NULL,
    `priceAmount` DECIMAL(10, 2) NULL,
    `rating` FLOAT NULL DEFAULT 0,
    `reviewCount` INTEGER NOT NULL DEFAULT 0,
    `bookingCount` INTEGER NOT NULL DEFAULT 0,
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',
    `published` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedat` TIMESTAMP(0) NOT NULL,
    `deletedAt` DATETIME NULL,

    UNIQUE INDEX `services_slug_key`(`slug`),
    INDEX `services_providerId_idx`(`providerId`),
    INDEX `services_destinationId_idx`(`destinationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_steps` (
    `id` VARCHAR(191) NOT NULL,
    `iconName` VARCHAR(191) NOT NULL,
    `iconColor` VARCHAR(191) NOT NULL,
    `titleKey` VARCHAR(191) NOT NULL,
    `descKey` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_fleet` (
    `id` VARCHAR(191) NOT NULL,
    `nameKey` VARCHAR(191) NOT NULL,
    `descKey` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `participants` INTEGER NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_providers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `activity_providers_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_offerings` (
    `id` VARCHAR(191) NOT NULL,
    `providerId` VARCHAR(191) NOT NULL,
    `activityName` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `basePrice` DOUBLE NOT NULL,
    `participants` INTEGER NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `features` JSON NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gastronomy_steps` (
    `id` VARCHAR(191) NOT NULL,
    `iconName` VARCHAR(191) NOT NULL,
    `iconColor` VARCHAR(191) NOT NULL,
    `titleKey` VARCHAR(191) NOT NULL,
    `descKey` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gastronomy_fleet` (
    `id` VARCHAR(191) NOT NULL,
    `nameKey` VARCHAR(191) NOT NULL,
    `descKey` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `capacity` INTEGER NOT NULL,
    `cuisine` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gastronomy_providers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `gastronomy_providers_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gastronomy_restaurants` (
    `id` VARCHAR(191) NOT NULL,
    `providerId` VARCHAR(191) NOT NULL,
    `restaurantName` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `cuisine` VARCHAR(191) NOT NULL,
    `basePrice` DOUBLE NOT NULL,
    `capacity` INTEGER NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `features` JSON NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_steps` (
    `id` VARCHAR(191) NOT NULL,
    `iconName` VARCHAR(191) NOT NULL,
    `iconColor` VARCHAR(191) NOT NULL,
    `titleKey` VARCHAR(191) NOT NULL,
    `descKey` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_fleet` (
    `id` VARCHAR(191) NOT NULL,
    `nameKey` VARCHAR(191) NOT NULL,
    `descKey` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `capacity` INTEGER NOT NULL,
    `eventType` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_providers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `event_providers_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_offerings` (
    `id` VARCHAR(191) NOT NULL,
    `providerId` VARCHAR(191) NOT NULL,
    `eventName` VARCHAR(191) NOT NULL,
    `eventType` VARCHAR(191) NOT NULL,
    `basePrice` DOUBLE NOT NULL,
    `capacity` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `features` JSON NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guide_steps` (
    `id` VARCHAR(191) NOT NULL,
    `iconName` VARCHAR(191) NOT NULL,
    `iconColor` VARCHAR(191) NOT NULL,
    `titleKey` VARCHAR(191) NOT NULL,
    `descKey` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guide_fleet` (
    `id` VARCHAR(191) NOT NULL,
    `nameKey` VARCHAR(191) NOT NULL,
    `descKey` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `languages` JSON NOT NULL,
    `specialties` JSON NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guide_providers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `guide_providers_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guide_offerings` (
    `id` VARCHAR(191) NOT NULL,
    `providerId` VARCHAR(191) NOT NULL,
    `guideName` VARCHAR(191) NOT NULL,
    `languages` JSON NOT NULL,
    `specialties` JSON NOT NULL,
    `basePrice` DOUBLE NOT NULL,
    `experience` INTEGER NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `features` JSON NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_images` (
    `id` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `alt` VARCHAR(255) NULL,
    `title` VARCHAR(255) NULL,
    `order` SMALLINT NOT NULL DEFAULT 0,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `service_images_serviceId_idx`(`serviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transfers` (
    `id` VARCHAR(191) NOT NULL,
    `providerId` VARCHAR(191) NULL,
    `name` VARCHAR(255) NOT NULL,
    `pickupLocation` VARCHAR(255) NOT NULL,
    `dropoffLocation` VARCHAR(255) NOT NULL,
    `vehicleType` VARCHAR(50) NOT NULL,
    `capacity` SMALLINT NOT NULL,
    `basePrice` DECIMAL(10, 2) NOT NULL,
    `currency` ENUM('BRL', 'USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'THB', 'AED', 'MAD', 'NZD', 'DKK', 'CNY', 'INR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU') NOT NULL DEFAULT 'BRL',
    `available` BOOLEAN NOT NULL DEFAULT true,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `transfers_pickupLocation_dropoffLocation_vehicleType_provide_key`(`pickupLocation`, `dropoffLocation`, `vehicleType`, `providerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transfer_steps` (
    `id` VARCHAR(191) NOT NULL,
    `iconName` VARCHAR(191) NOT NULL,
    `iconColor` VARCHAR(191) NOT NULL,
    `titleKey` VARCHAR(191) NOT NULL,
    `descKey` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicle_fleet` (
    `id` VARCHAR(191) NOT NULL,
    `nameKey` VARCHAR(191) NOT NULL,
    `descKey` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `passengers` INTEGER NOT NULL,
    `luggage` INTEGER NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transfer_providers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `transfer_providers_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transfer_vehicles` (
    `id` VARCHAR(191) NOT NULL,
    `providerId` VARCHAR(191) NOT NULL,
    `vehicleType` VARCHAR(191) NOT NULL,
    `basePrice` DOUBLE NOT NULL,
    `pricePerKm` DOUBLE NOT NULL DEFAULT 0,
    `passengers` INTEGER NOT NULL,
    `luggage` INTEGER NOT NULL,
    `duration` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `features` JSON NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart_items` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `itemType` VARCHAR(50) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `quantity` SMALLINT NOT NULL DEFAULT 1,
    `checkIn` DATE NULL,
    `checkOut` DATE NULL,
    `passengers` JSON NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `currency` ENUM('BRL', 'USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'THB', 'AED', 'MAD', 'NZD', 'DKK', 'CNY', 'INR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU') NOT NULL DEFAULT 'BRL',
    `metadata` JSON NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expiresAt` DATETIME NOT NULL,

    INDEX `cart_items_userId_itemType_idx`(`userId`, `itemType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `agency_id` VARCHAR(191) NULL,
    `client_id` VARCHAR(191) NULL,
    `destination_id` VARCHAR(191) NOT NULL,
    `trip_id` VARCHAR(191) NULL,
    `trip_destination_id` VARCHAR(191) NULL,
    `booking_reference` VARCHAR(50) NOT NULL,
    `supplier_booking_reference` VARCHAR(100) NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `check_in_time` VARCHAR(10) NULL,
    `check_out_time` VARCHAR(10) NULL,
    `adults` SMALLINT NOT NULL DEFAULT 1,
    `children` SMALLINT NOT NULL DEFAULT 0,
    `infants` SMALLINT NOT NULL DEFAULT 0,
    `price_per_night` FLOAT NULL,
    `subtotal` FLOAT NOT NULL,
    `tax_amount` FLOAT NULL DEFAULT 0,
    `discount_amount` FLOAT NULL DEFAULT 0,
    `total_price` FLOAT NOT NULL,
    `currency` ENUM('BRL', 'USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'THB', 'AED', 'MAD', 'NZD', 'DKK', 'CNY', 'INR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU') NOT NULL DEFAULT 'BRL',
    `booking_status` ENUM('DRAFT', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REFUNDED', 'NO_SHOW') NOT NULL DEFAULT 'PENDING',
    `payment_status` ENUM('PENDING', 'PAID', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED', 'PARTIALLY_REFUNDED', 'SUCCEEDED', 'CANCELED', 'REQUIRES_ACTION') NOT NULL DEFAULT 'PENDING',
    `payment_method` ENUM('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'PIX', 'PAYPAL', 'STRIPE', 'CASH', 'CRYPTO', 'GIFT_CARD') NOT NULL,
    `payment_intent_id` VARCHAR(255) NULL,
    `payment_transaction_id` VARCHAR(255) NULL,
    `last_payment_attempt` DATETIME NULL,
    `cancellation_reason` VARCHAR(255) NULL,
    `cancellation_date` DATETIME NULL,
    `refund_amount` FLOAT NULL,
    `refund_date` DATETIME NULL,
    `guest_email` VARCHAR(255) NOT NULL,
    `guest_phone` VARCHAR(20) NULL,
    `emergency_contact_name` VARCHAR(255) NULL,
    `emergency_contact_phone` VARCHAR(20) NULL,
    `emergency_contact_email` VARCHAR(255) NULL,
    `special_requests` TEXT NULL,
    `dietary_preferences` VARCHAR(255) NULL,
    `accessibility_requirements` TEXT NULL,
    `confirmation_sent` BOOLEAN NOT NULL DEFAULT false,
    `confirmation_sent_at` DATETIME NULL,
    `reminder_sent` BOOLEAN NOT NULL DEFAULT false,
    `reminder_sent_at` DATETIME NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedat` TIMESTAMP(0) NOT NULL,
    `checked_in_at` DATETIME NULL,
    `checked_out_at` TIMESTAMP NULL,

    UNIQUE INDEX `bookings_booking_reference_key`(`booking_reference`),
    INDEX `bookings_user_id_idx`(`user_id`),
    INDEX `bookings_agency_id_idx`(`agency_id`),
    INDEX `bookings_client_id_idx`(`client_id`),
    INDEX `bookings_destination_id_idx`(`destination_id`),
    INDEX `bookings_trip_id_idx`(`trip_id`),
    INDEX `bookings_booking_status_payment_status_idx`(`booking_status`, `payment_status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flight_bookings` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `flightId` VARCHAR(191) NOT NULL,
    `seats` JSON NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotel_bookings` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `nights` SMALLINT NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `hotel_bookings_hotelId_idx`(`hotelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_bookings` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `quantity` SMALLINT NOT NULL DEFAULT 1,
    `price` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `date` DATETIME NULL,
    `timeSlot` VARCHAR(50) NULL,
    `options` JSON NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cruise_bookings` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `cruiseId` VARCHAR(191) NOT NULL,
    `cabinType` VARCHAR(50) NOT NULL,
    `cabinNumber` VARCHAR(50) NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transfer_bookings` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `transferId` VARCHAR(191) NOT NULL,
    `pickupTime` DATETIME NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking_history` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `reason` TEXT NULL,
    `changes` JSON NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `booking_history_bookingId_createdat_idx`(`bookingId`, `createdat`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `booking_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `transaction_id` VARCHAR(100) NOT NULL,
    `gateway_transaction_id` VARCHAR(255) NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `currency` ENUM('BRL', 'USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'THB', 'AED', 'MAD', 'NZD', 'DKK', 'CNY', 'INR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU') NOT NULL DEFAULT 'BRL',
    `payment_method` ENUM('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'PIX', 'PAYPAL', 'STRIPE', 'CASH', 'CRYPTO', 'GIFT_CARD') NOT NULL,
    `status` ENUM('PENDING', 'PAID', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED', 'PARTIALLY_REFUNDED', 'SUCCEEDED', 'CANCELED', 'REQUIRES_ACTION') NOT NULL,
    `failure_reason` VARCHAR(255) NULL,
    `error_code` VARCHAR(100) NULL,
    `error_message` TEXT NULL,
    `card_last_four` VARCHAR(4) NULL,
    `card_brand` VARCHAR(50) NULL,
    `refundable` BOOLEAN NOT NULL DEFAULT false,
    `refund_amount` VARCHAR(20) NULL,
    `refund_reason` VARCHAR(255) NULL,
    `provider_data` JSON NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `processed_at` DATETIME NULL,
    `refunded_at` DATETIME NULL,
    `updatedat` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `payment_transactions_transaction_id_key`(`transaction_id`),
    INDEX `payment_transactions_booking_id_idx`(`booking_id`),
    INDEX `payment_transactions_user_id_idx`(`user_id`),
    INDEX `payment_transactions_status_idx`(`status`),
    INDEX `payment_transactions_transaction_id_idx`(`transaction_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(191) NOT NULL,
    `booking_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `transaction_id` VARCHAR(100) NOT NULL,
    `gateway_transaction_id` VARCHAR(255) NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `currency` ENUM('BRL', 'USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'THB', 'AED', 'MAD', 'NZD', 'DKK', 'CNY', 'INR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU') NOT NULL DEFAULT 'BRL',
    `payment_method` ENUM('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'PIX', 'PAYPAL', 'STRIPE', 'CASH', 'CRYPTO', 'GIFT_CARD') NOT NULL,
    `status` ENUM('PENDING', 'PAID', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED', 'PARTIALLY_REFUNDED', 'SUCCEEDED', 'CANCELED', 'REQUIRES_ACTION') NOT NULL,
    `failure_reason` VARCHAR(255) NULL,
    `error_code` VARCHAR(100) NULL,
    `error_message` TEXT NULL,
    `card_last_four` VARCHAR(4) NULL,
    `card_brand` VARCHAR(50) NULL,
    `refundable` BOOLEAN NOT NULL DEFAULT false,
    `refund_amount` VARCHAR(20) NULL,
    `refund_reason` VARCHAR(255) NULL,
    `provider_data` JSON NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `processed_at` DATETIME NULL,
    `refunded_at` DATETIME NULL,
    `updatedat` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `payments_transaction_id_key`(`transaction_id`),
    INDEX `payments_booking_id_idx`(`booking_id`),
    INDEX `payments_user_id_idx`(`user_id`),
    INDEX `payments_status_idx`(`status`),
    INDEX `payments_transaction_id_idx`(`transaction_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vouchers` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `code` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `discountType` VARCHAR(20) NOT NULL,
    `discount` DECIMAL(10, 2) NOT NULL,
    `maxDiscount` DECIMAL(10, 2) NULL,
    `validFrom` DATE NOT NULL,
    `validUntil` DATE NOT NULL,
    `maxUses` SMALLINT NULL,
    `currentUses` SMALLINT NOT NULL DEFAULT 0,
    `usesPerUser` SMALLINT NULL DEFAULT 1,
    `minPurchaseAmount` DECIMAL(10, 2) NULL,
    `applicableDestinations` JSON NOT NULL,
    `applicableCategories` JSON NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `vouchers_code_key`(`code`),
    INDEX `vouchers_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotions` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `code` VARCHAR(50) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `value` FLOAT NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `startDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expiresAt` DATETIME NOT NULL,
    `maxUses` INTEGER NULL,
    `usedCount` INTEGER NOT NULL DEFAULT 0,
    `minPurchase` FLOAT NULL,
    `packageIds` JSON NOT NULL,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedat` TIMESTAMP(0) NOT NULL,
    `deletedAt` DATETIME NULL,

    UNIQUE INDEX `promotions_code_key`(`code`),
    INDEX `promotions_active_expiresAt_idx`(`active`, `expiresAt`),
    INDEX `promotions_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_payment_methods` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `nameLocalized` JSON NULL,
    `description` TEXT NULL,
    `descriptionLocalized` JSON NULL,
    `type` VARCHAR(50) NOT NULL,
    `provider` VARCHAR(100) NOT NULL,
    `iconName` VARCHAR(100) NULL,
    `logoUrl` VARCHAR(500) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ativo',
    `fees` JSON NULL,
    `countriesAvailable` JSON NOT NULL,
    `currenciesAccepted` JSON NOT NULL,
    `isOnline` BOOLEAN NOT NULL DEFAULT true,
    `isInstant` BOOLEAN NOT NULL DEFAULT true,
    `requiresSetup` BOOLEAN NOT NULL DEFAULT false,
    `setupUrl` VARCHAR(500) NULL,
    `documentationUrl` VARCHAR(500) NULL,
    `config` JSON NULL,
    `limits` JSON NULL,
    `processingTime` JSON NULL,
    `metadata` JSON NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `isTestMode` BOOLEAN NOT NULL DEFAULT false,
    `createdat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedat` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voucher_usage` (
    `id` VARCHAR(191) NOT NULL,
    `voucherId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `usedat` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `voucher_usage_voucherId_userId_key`(`voucherId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trips` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `cover_image_url` VARCHAR(500) NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `duration_days` INTEGER NULL,
    `status` ENUM('DRAFT', 'PLANNING', 'BOOKING', 'TRAVELING', 'COMPLETED', 'CANCELLED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `is_private` BOOLEAN NOT NULL DEFAULT true,
    `is_draft` BOOLEAN NOT NULL DEFAULT true,
    `progress_percentage` SMALLINT NOT NULL DEFAULT 0,
    `total_budget` DECIMAL(12, 2) NULL,
    `total_spent` DECIMAL(12, 2) NULL DEFAULT 0,
    `budget_currency` ENUM('BRL', 'USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'THB', 'AED', 'MAD', 'NZD', 'DKK', 'CNY', 'INR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU') NOT NULL DEFAULT 'BRL',
    `accommodation_budget` DECIMAL(10, 2) NULL,
    `accommodation_spent` DECIMAL(10, 2) NULL DEFAULT 0,
    `transportation_budget` DECIMAL(10, 2) NULL,
    `transportation_spent` DECIMAL(10, 2) NULL DEFAULT 0,
    `food_budget` DECIMAL(10, 2) NULL,
    `food_spent` DECIMAL(10, 2) NULL DEFAULT 0,
    `activities_budget` DECIMAL(10, 2) NULL,
    `activities_spent` DECIMAL(10, 2) NULL DEFAULT 0,
    `entertainment_budget` DECIMAL(10, 2) NULL,
    `entertainment_spent` DECIMAL(10, 2) NULL DEFAULT 0,
    `other_budget` DECIMAL(10, 2) NULL,
    `other_spent` DECIMAL(10, 2) NULL DEFAULT 0,
    `origin_location` VARCHAR(255) NULL,
    `origin_latitude` DECIMAL(10, 8) NULL,
    `origin_longitude` DECIMAL(11, 8) NULL,
    `trip_type` VARCHAR(50) NULL,
    `travel_mode` VARCHAR(50) NULL,
    `companions_count` INTEGER NOT NULL DEFAULT 0,
    `companions` JSON NULL,
    `destinations_count` INTEGER NOT NULL DEFAULT 0,
    `bookings_count` INTEGER NOT NULL DEFAULT 0,
    `photos_count` INTEGER NOT NULL DEFAULT 0,
    `ai_itinerary_suggestions` JSON NULL,
    `estimated_total_cost` DECIMAL(12, 2) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,
    `started_at` DATETIME NULL,
    `ended_at` DATETIME NULL,
    `archived_at` DATETIME NULL,
    `deleted_at` DATETIME NULL,

    INDEX `trips_user_id_idx`(`user_id`),
    INDEX `trips_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itineraries` (
    `id` VARCHAR(191) NOT NULL,
    `tripId` VARCHAR(191) NOT NULL,
    `overview` TEXT NULL,
    `recommendations` JSON NULL,
    `optimizedRoute` JSON NULL,
    `metadata` JSON NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `itineraries_tripId_key`(`tripId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itinerary_days` (
    `id` VARCHAR(191) NOT NULL,
    `itineraryId` VARCHAR(191) NOT NULL,
    `dayNumber` SMALLINT NOT NULL,
    `date` DATE NOT NULL,
    `title` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `activities` JSON NOT NULL,
    `weather` JSON NULL,
    `budget` DECIMAL(10, 2) NULL,

    INDEX `itinerary_days_itineraryId_idx`(`itineraryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trip_destinations` (
    `id` VARCHAR(191) NOT NULL,
    `trip_id` VARCHAR(191) NOT NULL,
    `destination_id` VARCHAR(191) NOT NULL,
    `sequence_order` INTEGER NOT NULL,
    `arrival_date` DATE NULL,
    `departure_date` DATE NULL,
    `duration_days` INTEGER NULL,
    `budget` DECIMAL(10, 2) NULL,
    `spent` DECIMAL(10, 2) NULL DEFAULT 0,
    `notes` TEXT NULL,
    `itinerary_details` JSON NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `trip_destinations_trip_id_destination_id_sequence_order_key`(`trip_id`, `destination_id`, `sequence_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `saved_itineraries` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `destinationId` VARCHAR(191) NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `slug` VARCHAR(255) NULL,
    `itineraryData` JSON NOT NULL,
    `duration` SMALLINT NOT NULL,
    `budget` DECIMAL(10, 2) NULL,
    `currency` ENUM('BRL', 'USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'THB', 'AED', 'MAD', 'NZD', 'DKK', 'CNY', 'INR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU') NOT NULL DEFAULT 'BRL',
    `preferences` JSON NULL,
    `aiModel` VARCHAR(50) NULL,
    `version` SMALLINT NOT NULL DEFAULT 1,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,
    `shareCode` VARCHAR(50) NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `likes` INTEGER NOT NULL DEFAULT 0,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,
    `deletedAt` DATETIME NULL,

    UNIQUE INDEX `saved_itineraries_slug_key`(`slug`),
    UNIQUE INDEX `saved_itineraries_shareCode_key`(`shareCode`),
    INDEX `saved_itineraries_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `booking_id` VARCHAR(191) NULL,
    `destination_id` VARCHAR(191) NULL,
    `attraction_id` VARCHAR(191) NULL,
    `title` VARCHAR(255) NOT NULL,
    `comment` TEXT NOT NULL,
    `rating` SMALLINT NOT NULL,
    `cleanliness_rating` SMALLINT NULL,
    `comfort_rating` SMALLINT NULL,
    `location_rating` SMALLINT NULL,
    `value_rating` SMALLINT NULL,
    `service_rating` SMALLINT NULL,
    `reviewer_name` VARCHAR(255) NULL,
    `review_type` ENUM('POST_TRIP', 'DURING_TRIP', 'PRE_TRIP', 'FOLLOW_UP') NOT NULL DEFAULT 'POST_TRIP',
    `review_status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED') NOT NULL DEFAULT 'PENDING',
    `is_verified_booking` BOOLEAN NOT NULL DEFAULT false,
    `travel_type` VARCHAR(50) NULL,
    `helpful_count` INTEGER NOT NULL DEFAULT 0,
    `unhelpful_count` INTEGER NOT NULL DEFAULT 0,
    `flag_count` INTEGER NOT NULL DEFAULT 0,
    `photos` JSON NULL,
    `videos` JSON NULL,
    `moderation_notes` TEXT NULL,
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,
    `published_at` DATETIME NULL,
    `moderated_at` DATETIME NULL,
    `deleted_at` DATETIME NULL,

    INDEX `reviews_booking_id_idx`(`booking_id`),
    INDEX `reviews_user_id_idx`(`user_id`),
    INDEX `reviews_destination_id_idx`(`destination_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favorites` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `itemType` VARCHAR(50) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `favorites_userId_itemType_itemId_key`(`userId`, `itemType`, `itemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_favorites` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `destinationId` VARCHAR(191) NOT NULL,
    `priority` SMALLINT NOT NULL DEFAULT 0,
    `notes` TEXT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `user_favorites_userId_destinationId_key`(`userId`, `destinationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_conversations` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `title` VARCHAR(255) NULL,
    `conversationStatus` VARCHAR(20) NOT NULL DEFAULT 'active',
    `escalatedToEmail` BOOLEAN NOT NULL DEFAULT false,
    `escalatedAt` DATETIME NULL,
    `context` JSON NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `ai_conversations_userId_idx`(`userId`),
    INDEX `ai_conversations_conversationStatus_idx`(`conversationStatus`),
    INDEX `ai_conversations_updatedAt_idx`(`updatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_chat_messages` (
    `id` VARCHAR(191) NOT NULL,
    `aiConversationId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `role` VARCHAR(20) NOT NULL,
    `content` TEXT NOT NULL,
    `metadata` JSON NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `ai_chat_messages_aiConversationId_idx`(`aiConversationId`),
    INDEX `ai_chat_messages_userId_idx`(`userId`),
    INDEX `ai_chat_messages_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_messages` (
    `id` VARCHAR(191) NOT NULL,
    `conversationId` VARCHAR(191) NOT NULL,
    `role` VARCHAR(20) NOT NULL,
    `content` TEXT NOT NULL,
    `tokens` INTEGER NULL,
    `model` VARCHAR(50) NULL,
    `metadata` JSON NULL,
    `promptTokens` INTEGER NULL,
    `completionTokens` INTEGER NULL,
    `helpful` BOOLEAN NULL,
    `rating` SMALLINT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,
    `aiConversationId` VARCHAR(191) NOT NULL,

    INDEX `ai_messages_aiConversationId_idx`(`aiConversationId`),
    UNIQUE INDEX `ai_messages_conversationId_id_key`(`conversationId`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_rooms` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `name` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_participants` (
    `id` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `role` VARCHAR(20) NOT NULL,
    `joinedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `leftAt` DATETIME NULL,

    UNIQUE INDEX `chat_participants_roomId_userId_key`(`roomId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_messages` (
    `id` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `reactions` JSON NULL,
    `edited` BOOLEAN NOT NULL DEFAULT false,
    `editedAt` DATETIME NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedAt` DATETIME NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `chat_messages_roomId_createdAt_idx`(`roomId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loyalty_programs` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `points` INTEGER NOT NULL DEFAULT 0,
    `tier` ENUM('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND') NOT NULL DEFAULT 'BRONZE',
    `lifetimePoints` INTEGER NOT NULL DEFAULT 0,
    `tierExpiresAt` DATETIME NULL,
    `discountPercentage` FLOAT NOT NULL DEFAULT 0,
    `perks` JSON NULL,
    `nextTierPoints` INTEGER NULL,
    `pointsToExpire` JSON NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `loyalty_programs_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loyalty_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `loyaltyProgramId` VARCHAR(191) NOT NULL,
    `points` INTEGER NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `description` VARCHAR(500) NULL,
    `referenceType` VARCHAR(50) NULL,
    `referenceId` VARCHAR(191) NULL,
    `expiresAt` DATETIME NULL,
    `expired` BOOLEAN NOT NULL DEFAULT false,
    `balanceAfter` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `loyalty_transactions_loyaltyProgramId_createdAt_idx`(`loyaltyProgramId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articles` (
    `id` VARCHAR(191) NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `destination_id` VARCHAR(191) NULL,
    `title` VARCHAR(500) NOT NULL,
    `slug` VARCHAR(500) NOT NULL,
    `content` TEXT NOT NULL,
    `excerpt` VARCHAR(1000) NULL,
    `featured_image_url` VARCHAR(500) NULL,
    `featured_image_alt` TEXT NULL,
    `images` JSON NULL,
    `video_url` VARCHAR(500) NULL,
    `content_type` ENUM('article', 'guide', 'review', 'interview', 'opinion', 'tutorial', 'case_study', 'roundup') NOT NULL DEFAULT 'article',
    `category` ENUM('travel_guide', 'destination_tip', 'culture', 'adventure', 'food', 'accommodation', 'transport', 'budget_travel', 'luxury_travel', 'solo_travel', 'family_travel', 'sustainability', 'digital_nomad', 'photography', 'wellness', 'business_travel', 'news', 'interview', 'review', 'how_to', 'Roteiros', 'Dicas', 'Guias', 'Gastronomia', 'Notícias') NULL DEFAULT 'travel_guide',
    `tags` JSON NULL,
    `reading_time_minutes` INTEGER NULL,
    `word_count` INTEGER NULL,
    `status` ENUM('draft', 'scheduled', 'published', 'archived', 'deleted') NOT NULL DEFAULT 'draft',
    `published_at` DATETIME NULL,
    `scheduled_at` DATETIME NULL,
    `updated_at` TIMESTAMP(0) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `is_pinned` BOOLEAN NOT NULL DEFAULT false,
    `pin_until` DATETIME NULL,
    `visibility` VARCHAR(50) NOT NULL DEFAULT 'public',
    `sustainability_rating` SMALLINT NULL DEFAULT 0,
    `sustainability_category` ENUM('carbon_neutral', 'eco_friendly', 'sustainable', 'responsible', 'standard') NULL,
    `carbon_footprint_estimate` INTEGER NULL,
    `eco_certifications` JSON NULL,
    `security_level` ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'medium',
    `requires_authentication` BOOLEAN NOT NULL DEFAULT false,
    `content_warning` TEXT NULL,
    `views_count` INTEGER NOT NULL DEFAULT 0,
    `unique_views_count` INTEGER NOT NULL DEFAULT 0,
    `likes_count` INTEGER NOT NULL DEFAULT 0,
    `shares_count` INTEGER NOT NULL DEFAULT 0,
    `comments_count` INTEGER NOT NULL DEFAULT 0,
    `bookmark_count` INTEGER NOT NULL DEFAULT 0,
    `trend_score` SMALLINT NOT NULL DEFAULT 0,
    `trending_rank` INTEGER NULL,
    `ai_generated` BOOLEAN NOT NULL DEFAULT false,
    `ai_summary` TEXT NULL,
    `ai_keywords` JSON NULL,
    `meta_title` VARCHAR(160) NULL,
    `meta_description` VARCHAR(160) NULL,
    `meta_keywords` VARCHAR(500) NULL,
    `canonical_url` VARCHAR(500) NULL,
    `structured_data` JSON NULL,
    `related_articles` JSON NULL,
    `is_approved` BOOLEAN NOT NULL DEFAULT true,
    `moderation_notes` TEXT NULL,
    `moderated_by` VARCHAR(191) NULL,
    `moderated_at` DATETIME NULL,

    UNIQUE INDEX `articles_slug_key`(`slug`),
    INDEX `articles_slug_idx`(`slug`),
    INDEX `articles_is_featured_idx`(`is_featured`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `article_comments` (
    `id` VARCHAR(191) NOT NULL,
    `article_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `parent_comment_id` VARCHAR(191) NULL,
    `guest_name` VARCHAR(255) NULL,
    `guest_email` VARCHAR(255) NULL,
    `guest_verified` BOOLEAN NOT NULL DEFAULT false,
    `title` VARCHAR(500) NULL,
    `content` TEXT NOT NULL,
    `rating_given` SMALLINT NULL,
    `status` ENUM('pending', 'approved', 'rejected', 'spam', 'flagged') NOT NULL DEFAULT 'pending',
    `is_verified_purchase` BOOLEAN NOT NULL DEFAULT false,
    `is_pinned` BOOLEAN NOT NULL DEFAULT false,
    `content_warning` TEXT NULL,
    `likes_count` INTEGER NOT NULL DEFAULT 0,
    `dislikes_count` INTEGER NOT NULL DEFAULT 0,
    `helpful_count` INTEGER NOT NULL DEFAULT 0,
    `unhelpful_count` INTEGER NOT NULL DEFAULT 0,
    `moderation_notes` TEXT NULL,
    `moderated_by` VARCHAR(191) NULL,
    `moderated_at` DATETIME NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,
    `deleted_at` DATETIME NULL,
    `depth` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quizzes` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `type` VARCHAR(50) NOT NULL,
    `questions` JSON NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_attempts` (
    `id` VARCHAR(191) NOT NULL,
    `quizId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `answers` JSON NOT NULL,
    `score` FLOAT NULL,
    `result` TEXT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `quiz_attempts_quizId_userId_idx`(`quizId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('BOOKING_CONFIRMATION', 'REVIEW_REQUEST', 'PRICE_ALERT', 'DESTINATION_UPDATE', 'PROMOTIONAL', 'SYSTEM') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `icon` VARCHAR(50) NULL,
    `actionUrl` TEXT NULL,
    `actionText` VARCHAR(50) NULL,
    `metadata` JSON NULL,
    `channels` JSON NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `readAt` DATETIME NULL,
    `dismissed` BOOLEAN NOT NULL DEFAULT false,
    `priority` VARCHAR(20) NOT NULL DEFAULT 'normal',
    `expiresAt` DATETIME NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `notifications_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_notifications` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `template` VARCHAR(100) NOT NULL,
    `sentAt` DATETIME NULL,
    `openedAt` DATETIME NULL,
    `clickedAt` DATETIME NULL,
    `bounced` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `email_notifications_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification_settings` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `email_enabled` BOOLEAN NOT NULL DEFAULT true,
    `push_enabled` BOOLEAN NOT NULL DEFAULT true,
    `sms_enabled` BOOLEAN NOT NULL DEFAULT false,
    `in_app_enabled` BOOLEAN NOT NULL DEFAULT true,
    `booking_notifications` BOOLEAN NOT NULL DEFAULT true,
    `promotion_notifications` BOOLEAN NOT NULL DEFAULT true,
    `social_notifications` BOOLEAN NOT NULL DEFAULT true,
    `review_notifications` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `notification_settings_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `crm_events` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `customerId` VARCHAR(191) NULL,
    `payload` JSON NULL,
    `timestamp` DATETIME NOT NULL,
    `receivedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` TEXT NULL,
    `sessionId` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `crm_events_customerId_idx`(`customerId`),
    INDEX `crm_events_type_idx`(`type`),
    INDEX `crm_events_timestamp_idx`(`timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `crm_customers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `cpfCnpj` VARCHAR(20) NOT NULL,
    `birthDate` DATETIME NOT NULL,
    `street` VARCHAR(255) NOT NULL,
    `number` VARCHAR(10) NOT NULL,
    `complement` VARCHAR(50) NULL,
    `neighborhood` VARCHAR(50) NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(2) NOT NULL,
    `zipCode` VARCHAR(10) NOT NULL,
    `country` VARCHAR(3) NOT NULL,
    `documents` JSON NULL,
    `notes` TEXT NULL,
    `marketingConsent` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,
    `deletedAt` DATETIME NULL,

    UNIQUE INDEX `crm_customers_email_key`(`email`),
    INDEX `crm_customers_email_idx`(`email`),
    INDEX `crm_customers_cpfCnpj_idx`(`cpfCnpj`),
    INDEX `crm_customers_city_state_idx`(`city`, `state`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `crm_bookings` (
    `id` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(20) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `destinationId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `startDate` DATETIME NOT NULL,
    `endDate` DATETIME NOT NULL,
    `totalPrice` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `paymentMethod` VARCHAR(20) NULL,
    `paymentProof` TEXT NULL,
    `notes` TEXT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,
    `deletedAt` DATETIME NULL,

    UNIQUE INDEX `crm_bookings_reference_key`(`reference`),
    INDEX `crm_bookings_customerId_idx`(`customerId`),
    INDEX `crm_bookings_reference_idx`(`reference`),
    INDEX `crm_bookings_status_idx`(`status`),
    INDEX `crm_bookings_startDate_endDate_idx`(`startDate`, `endDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `crm_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,
    `deletedAt` DATETIME NULL,

    UNIQUE INDEX `crm_categories_slug_key`(`slug`),
    INDEX `crm_categories_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `crm_products` (
    `id` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(50) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `costPrice` DECIMAL(10, 2) NULL,
    `currency` ENUM('BRL', 'USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'THB', 'AED', 'MAD', 'NZD', 'DKK', 'CNY', 'INR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU') NOT NULL DEFAULT 'BRL',
    `categoryId` VARCHAR(191) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',
    `stock` INTEGER NOT NULL DEFAULT 0,
    `images` JSON NULL,
    `tags` JSON NOT NULL,
    `specifications` JSON NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,
    `deletedAt` DATETIME NULL,

    UNIQUE INDEX `crm_products_sku_key`(`sku`),
    INDEX `crm_products_sku_idx`(`sku`),
    INDEX `crm_products_categoryId_idx`(`categoryId`),
    INDEX `crm_products_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `embedding_cache` (
    `id` VARCHAR(191) NOT NULL,
    `cacheKey` VARCHAR(255) NOT NULL,
    `model` VARCHAR(100) NOT NULL,
    `text` VARCHAR(500) NOT NULL,
    `embedding` JSON NOT NULL,
    `tokens` INTEGER NOT NULL,
    `expiresAt` DATETIME NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `embedding_cache_cacheKey_key`(`cacheKey`),
    INDEX `embedding_cache_cacheKey_idx`(`cacheKey`),
    INDEX `embedding_cache_model_idx`(`model`),
    INDEX `embedding_cache_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `llm_cache` (
    `id` VARCHAR(191) NOT NULL,
    `cacheKey` VARCHAR(255) NOT NULL,
    `model` VARCHAR(100) NOT NULL,
    `content` TEXT NOT NULL,
    `role` VARCHAR(20) NOT NULL,
    `finishReason` VARCHAR(50) NOT NULL,
    `usage` JSON NOT NULL,
    `expiresAt` DATETIME NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `llm_cache_cacheKey_key`(`cacheKey`),
    INDEX `llm_cache_cacheKey_idx`(`cacheKey`),
    INDEX `llm_cache_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_runs` (
    `id` VARCHAR(191) NOT NULL,
    `queue` VARCHAR(50) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `durationMs` INTEGER NOT NULL DEFAULT 0,
    `error` TEXT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `metadata` JSON NULL,

    INDEX `job_runs_queue_type_status_createdAt_idx`(`queue`, `type`, `status`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_events` (
    `id` VARCHAR(191) NOT NULL,
    `campaign` VARCHAR(100) NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `messageId` VARCHAR(200) NULL,
    `extra` JSON NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `email_events_campaign_type_createdAt_idx`(`campaign`, `type`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emission_factors` (
    `id` VARCHAR(191) NOT NULL,
    `mode` VARCHAR(20) NOT NULL,
    `subcategory` VARCHAR(50) NULL,
    `country` VARCHAR(3) NULL,
    `factor` DECIMAL(10, 6) NOT NULL,
    `unit` VARCHAR(50) NOT NULL,
    `source` TEXT NULL,
    `validFrom` DATETIME NULL,
    `validTo` DATETIME NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `emission_factors_mode_subcategory_country_idx`(`mode`, `subcategory`, `country`),
    UNIQUE INDEX `mode_subcategory_country`(`mode`, `subcategory`, `country`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `airport_geo` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(10) NOT NULL,
    `name` VARCHAR(255) NULL,
    `city` VARCHAR(100) NULL,
    `country` VARCHAR(3) NULL,
    `lat` FLOAT NOT NULL,
    `lon` FLOAT NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `airport_geo_code_key`(`code`),
    INDEX `airport_geo_city_country_idx`(`city`, `country`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `model_versions` (
    `id` VARCHAR(191) NOT NULL,
    `modelName` VARCHAR(100) NOT NULL,
    `version` VARCHAR(50) NOT NULL,
    `weightPercent` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `model_versions_modelName_version_key`(`modelName`, `version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimonials` (
    `id` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `location` TEXT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `avatar` TEXT NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `local_guides` (
    `id` BIGINT NOT NULL,
    `name` TEXT NOT NULL,
    `photo` TEXT NULL,
    `photo_alt` TEXT NULL,
    `description` TEXT NULL,
    `specialties` JSON NULL,
    `languages` JSON NULL,
    `rating` DECIMAL(3, 1) NULL,
    `reviews` INTEGER NOT NULL DEFAULT 0,
    `availability` JSON NULL,
    `price` JSON NULL,
    `location` JSON NULL,
    `expertise` TEXT NULL,
    `bio` TEXT NULL,
    `years_experience` INTEGER NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `certifications` JSON NULL,
    `tag_line` TEXT NULL,
    `tours_highlighted` JSON NULL,
    `contact` JSON NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `insurance_products` (
    `id` VARCHAR(191) NOT NULL,
    `provider` TEXT NULL,
    `plan_code` VARCHAR(500) NOT NULL,
    `name_key` TEXT NULL,
    `description_key` TEXT NULL,
    `summary_key` TEXT NULL,
    `price_range_key` TEXT NULL,
    `icon` TEXT NULL,
    `badge_key` TEXT NULL,
    `coverages` JSON NULL,
    `benefits` JSON NULL,
    `fine_print_key` TEXT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `details` JSON NULL,

    UNIQUE INDEX `insurance_products_plan_code_key`(`plan_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoices` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(100) NOT NULL,
    `booking_id` VARCHAR(191) NULL,
    `status` VARCHAR(50) NULL,
    `issue_date` DATE NULL,
    `due_date` DATE NULL,
    `paid_date` DATE NULL,
    `customer` JSON NULL,
    `company` JSON NULL,
    `items` JSON NULL,
    `subtotal` DECIMAL(10, 2) NULL,
    `taxes` DECIMAL(10, 2) NULL,
    `discounts` DECIMAL(10, 2) NULL,
    `total` DECIMAL(10, 2) NULL,
    `currency` VARCHAR(10) NULL,
    `payment_method` VARCHAR(50) NULL,
    `payment_reference` VARCHAR(255) NULL,
    `notes` TEXT NULL,
    `terms` TEXT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `invoices_number_key`(`number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refund_requests` (
    `id` VARCHAR(191) NOT NULL,
    `booking_id` VARCHAR(191) NULL,
    `invoice_id` VARCHAR(191) NULL,
    `status` VARCHAR(50) NULL,
    `type` VARCHAR(50) NULL,
    `reason` TEXT NULL,
    `request_date` DATETIME NULL,
    `processed_date` DATETIME NULL,
    `completed_date` DATETIME NULL,
    `customer` JSON NULL,
    `booking` JSON NULL,
    `refund` JSON NULL,
    `original_payment` JSON NULL,
    `notes` TEXT NULL,
    `internal_notes` TEXT NULL,
    `customer_message` TEXT NULL,
    `attachments` JSON NULL,
    `processed_by` VARCHAR(191) NULL,
    `approved_by` VARCHAR(191) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME NULL,
    `name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `amount` DECIMAL(10, 2) NULL,
    `type` VARCHAR(50) NULL,
    `status` VARCHAR(50) NULL,
    `description` TEXT NULL,
    `payment_method` VARCHAR(50) NULL,
    `invoice_id` VARCHAR(191) NULL,
    `customer` JSON NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `newsletter_subscribers` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NULL,
    `status` VARCHAR(50) NULL,
    `subscribed_at` DATETIME NULL,
    `language` VARCHAR(10) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `newsletter_subscribers_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `newsletter_campaigns` (
    `id` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(255) NULL,
    `title` VARCHAR(255) NULL,
    `content` TEXT NULL,
    `status` VARCHAR(50) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `scheduled_at` DATETIME NULL,
    `sent_at` DATETIME NULL,
    `language` VARCHAR(10) NULL,
    `preview_text` VARCHAR(255) NULL,
    `recipients_count` INTEGER NULL,
    `stats` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transportations` (
    `id` VARCHAR(191) NOT NULL,
    `destination_id` VARCHAR(191) NULL,
    `type` TEXT NULL,
    `provider` TEXT NULL,
    `origin` TEXT NULL,
    `destination` TEXT NULL,
    `departure_time` TEXT NULL,
    `arrival_time` TEXT NULL,
    `duration_text` TEXT NULL,
    `price` DECIMAL(10, 2) NULL,
    `currency` TEXT NULL,
    `co2_emissions` DECIMAL(10, 2) NULL,
    `sustainability_score` DECIMAL(4, 1) NULL,
    `booking_url` TEXT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotel_images` (
    `id` VARCHAR(191) NOT NULL,
    `hotel_id` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `title` TEXT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cruise_details` (
    `id` VARCHAR(191) NOT NULL,
    `cruise_id` VARCHAR(191) NOT NULL,
    `overview` JSON NULL,
    `itineraries` JSON NULL,
    `route_weather` JSON NULL,
    `monthly_recommendations` JSON NULL,
    `sea_state` JSON NULL,
    `excursions` JSON NULL,
    `cabins` JSON NULL,
    `images` JSON NULL,
    `ratings` FLOAT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `cruise_details_cruise_id_key`(`cruise_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guide_details` (
    `id` VARCHAR(191) NOT NULL,
    `guide_id` BIGINT NOT NULL,
    `bio` JSON NULL,
    `specialties` JSON NULL,
    `certifications` JSON NULL,
    `availability` JSON NULL,
    `pricing` JSON NULL,
    `languages` JSON NULL,
    `images` JSON NULL,
    `ratings` FLOAT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `guide_details_guide_id_key`(`guide_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `article_destinations` (
    `id` VARCHAR(191) NOT NULL,
    `article_id` VARCHAR(191) NOT NULL,
    `destination_id` VARCHAR(191) NOT NULL,
    `mention_type` VARCHAR(100) NULL,
    `order_position` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `article_destinations_article_id_destination_id_mention_type_key`(`article_id`, `destination_id`, `mention_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `article_attractions` (
    `id` VARCHAR(191) NOT NULL,
    `article_id` VARCHAR(191) NOT NULL,
    `attraction_id` VARCHAR(191) NOT NULL,
    `mention_type` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `order_position` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `article_attractions_article_id_attraction_id_mention_type_key`(`article_id`, `attraction_id`, `mention_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `integrations` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `icon` VARCHAR(100) NOT NULL,
    `color` VARCHAR(50) NOT NULL,
    `bg_color` VARCHAR(50) NOT NULL,
    `logo` TEXT NULL,
    `is_premium` BOOLEAN NOT NULL DEFAULT false,
    `rating` DECIMAL(3, 1) NULL,
    `users` VARCHAR(50) NULL,
    `popular` BOOLEAN NOT NULL DEFAULT false,
    `coming_soon` BOOLEAN NOT NULL DEFAULT false,
    `features` JSON NOT NULL,
    `website` VARCHAR(500) NULL,
    `pricing` VARCHAR(50) NULL,
    `status` VARCHAR(50) NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `search_suggestions` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `category` VARCHAR(50) NOT NULL,
    `tags` JSON NOT NULL,
    `popularity` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `search_suggestions_popularity_idx`(`popularity`),
    INDEX `search_suggestions_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `popular_destinations` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `image_url` VARCHAR(500) NULL,
    `rating` DECIMAL(3, 2) NOT NULL,
    `review_count` INTEGER NOT NULL DEFAULT 0,
    `trending` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `popular_destinations_rating_idx`(`rating`),
    INDEX `popular_destinations_trending_idx`(`trending`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trending_searches` (
    `id` VARCHAR(191) NOT NULL,
    `query` VARCHAR(255) NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 0,
    `category` VARCHAR(50) NOT NULL,
    `last_searched` DATETIME NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `trending_searches_count_idx`(`count`),
    INDEX `trending_searches_last_searched_idx`(`last_searched`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_prompts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `template` VARCHAR(191) NOT NULL,
    `variables` JSON NULL,
    `service` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NULL,
    `tags` JSON NOT NULL,
    `enabled` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `ai_prompts_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_recommendations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `context_type` VARCHAR(191) NOT NULL,
    `context_id` VARCHAR(191) NOT NULL,
    `recommendation` JSON NOT NULL,
    `service` VARCHAR(191) NULL,
    `model` VARCHAR(191) NULL,
    `confidence` DECIMAL NULL,
    `created_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `ai_recommendations_context_type_context_id_key`(`context_type`, `context_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_workflows` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `steps` JSON NOT NULL,
    `enabled` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `ai_workflows_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suppliers` (
    `id` VARCHAR(50) NOT NULL,
    `type` ENUM('HOTEL', 'GUIDE', 'TRANSFER', 'ACTIVITY', 'CRUISE', 'INSURANCE', 'FLIGHT', 'CAR_RENTAL', 'OTHER') NOT NULL DEFAULT 'HOTEL',
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(50) NULL,
    `website` VARCHAR(500) NULL,
    `address` VARCHAR(255) NULL,
    `city` VARCHAR(100) NULL,
    `country` VARCHAR(100) NULL,
    `postal_code` VARCHAR(20) NULL,
    `tax_id` VARCHAR(50) NULL,
    `logo` VARCHAR(500) NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'ARCHIVED') NOT NULL DEFAULT 'PENDING',
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `verification_date` DATETIME NULL,
    `partnership_level` ENUM('BASIC', 'PREFERRED', 'PREMIUM', 'EXCLUSIVE') NOT NULL DEFAULT 'BASIC',
    `default_commission_rate` DECIMAL(5, 2) NOT NULL DEFAULT 15,
    `rating` DECIMAL(3, 2) NOT NULL DEFAULT 0,
    `total_reviews` INTEGER NOT NULL DEFAULT 0,
    `performance` JSON NULL,
    `categories` JSON NULL,
    `tags` JSON NULL,
    `serviceRegions` JSON NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,
    `last_booking_at` DATETIME NULL,

    UNIQUE INDEX `suppliers_slug_key`(`slug`),
    INDEX `suppliers_type_idx`(`type`),
    INDEX `suppliers_status_idx`(`status`),
    INDEX `suppliers_city_idx`(`city`),
    INDEX `suppliers_country_idx`(`country`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supplier_contacts` (
    `id` VARCHAR(50) NOT NULL,
    `supplier_id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `role` VARCHAR(100) NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(50) NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,

    INDEX `supplier_contacts_supplier_id_idx`(`supplier_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commission_records` (
    `id` VARCHAR(50) NOT NULL,
    `supplier_id` VARCHAR(50) NOT NULL,
    `booking_id` VARCHAR(50) NULL,
    `booking_reference` VARCHAR(50) NULL,
    `booking_date` DATETIME NULL,
    `gross_amount` DECIMAL(10, 2) NOT NULL,
    `commission_amount` DECIMAL(10, 2) NOT NULL,
    `commission_rate` DECIMAL(5, 2) NOT NULL,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'EUR',
    `status` ENUM('PENDING', 'PAID', 'CANCELLED', 'DISPUTED') NOT NULL DEFAULT 'PENDING',
    `paid_at` DATETIME NULL,
    `customer_name` VARCHAR(255) NULL,
    `destination` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `commission_records_supplier_id_idx`(`supplier_id`),
    INDEX `commission_records_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `destination_preferences` (
    `id` VARCHAR(191) NOT NULL,
    `destination_id` VARCHAR(50) NOT NULL,
    `destination_name` VARCHAR(255) NOT NULL,
    `destination_country` VARCHAR(100) NOT NULL,
    `subscriber_count` INTEGER NOT NULL DEFAULT 0,
    `last_campaign_sent` DATETIME NULL,
    `open_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `click_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `destination_preferences_destination_id_key`(`destination_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `segmented_campaigns` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(500) NOT NULL,
    `content` TEXT NULL,
    `destination_id` VARCHAR(50) NOT NULL,
    `destination_name` VARCHAR(255) NOT NULL,
    `status` ENUM('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'CANCELLED', 'FAILED') NOT NULL DEFAULT 'DRAFT',
    `scheduled_date` DATETIME NULL,
    `sent_at` DATETIME NULL,
    `recipient_count` INTEGER NOT NULL DEFAULT 0,
    `open_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `click_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `segmented_campaigns_destination_id_idx`(`destination_id`),
    INDEX `segmented_campaigns_status_idx`(`status`),
    INDEX `segmented_campaigns_scheduled_date_idx`(`scheduled_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_trip_follow_ups` (
    `id` VARCHAR(191) NOT NULL,
    `booking_id` VARCHAR(50) NOT NULL,
    `user_id` VARCHAR(50) NOT NULL,
    `user_name` VARCHAR(255) NOT NULL,
    `user_email` VARCHAR(255) NOT NULL,
    `destination_name` VARCHAR(255) NOT NULL,
    `check_out_date` DATETIME NOT NULL,
    `follow_up_type` ENUM('FEEDBACK_REQUEST', 'WELCOME_HOME', 'REVIEW_REMINDER', 'LOYALTY_OFFER', 'UPSELL') NOT NULL DEFAULT 'FEEDBACK_REQUEST',
    `status` ENUM('PENDING', 'SENT', 'OPENED', 'RESPONDED', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `scheduled_date` DATETIME NULL,
    `sent_at` DATETIME NULL,
    `opened_at` DATETIME NULL,
    `responded_at` DATETIME NULL,
    `feedback_rating` INTEGER NULL,
    `feedback_comment` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `post_trip_follow_ups_booking_id_idx`(`booking_id`),
    INDEX `post_trip_follow_ups_user_id_idx`(`user_id`),
    INDEX `post_trip_follow_ups_status_idx`(`status`),
    INDEX `post_trip_follow_ups_follow_up_type_idx`(`follow_up_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `birthday_alerts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(50) NOT NULL,
    `user_name` VARCHAR(255) NOT NULL,
    `user_email` VARCHAR(255) NOT NULL,
    `birth_date` DATE NOT NULL,
    `upcoming_birthday` DATE NOT NULL,
    `days_until_birthday` INTEGER NOT NULL DEFAULT 0,
    `age` INTEGER NOT NULL DEFAULT 0,
    `alert_status` ENUM('PENDING', 'NOTIFIED', 'VOUCHER_SENT', 'VOUCHER_USED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    `voucher_code` VARCHAR(50) NULL,
    `voucher_discount` INTEGER NULL,
    `voucher_expiry` DATETIME NULL,
    `voucher_used_at` DATETIME NULL,
    `last_notified_at` DATETIME NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `birthday_alerts_user_id_idx`(`user_id`),
    INDEX `birthday_alerts_alert_status_idx`(`alert_status`),
    INDEX `birthday_alerts_days_until_birthday_idx`(`days_until_birthday`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `follow_up_templates` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` ENUM('FEEDBACK_REQUEST', 'WELCOME_HOME', 'REVIEW_REMINDER', 'LOYALTY_OFFER', 'UPSELL') NOT NULL,
    `subject` VARCHAR(500) NOT NULL,
    `content` TEXT NOT NULL,
    `delay_days` INTEGER NOT NULL DEFAULT 2,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `follow_up_templates_type_key`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `birthday_voucher_configs` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `discount_percentage` INTEGER NOT NULL DEFAULT 15,
    `min_booking_value` DECIMAL(10, 2) NOT NULL DEFAULT 100,
    `valid_for_days` INTEGER NOT NULL DEFAULT 30,
    `max_uses` INTEGER NOT NULL DEFAULT 1000,
    `current_uses` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `preference_events` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `preference_type` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `oldValue` JSON NULL,
    `newValue` JSON NOT NULL,
    `timestamp` DATETIME NOT NULL,
    `context` JSON NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `preference_events_user_id_idx`(`user_id`),
    INDEX `preference_events_session_id_idx`(`session_id`),
    INDEX `preference_events_preference_type_idx`(`preference_type`),
    INDEX `preference_events_timestamp_idx`(`timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `preference_analytics` (
    `id` VARCHAR(191) NOT NULL,
    `analytics_type` VARCHAR(191) NOT NULL,
    `data` JSON NOT NULL,
    `computed_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expires_at` DATETIME NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `response_predictions` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `preference_hash` VARCHAR(191) NOT NULL,
    `predicted_response` JSON NOT NULL,
    `confidence_score` DECIMAL(3, 2) NOT NULL,
    `model_version` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expires_at` DATETIME NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_agency_id_fkey` FOREIGN KEY (`agency_id`) REFERENCES `agencies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `community_posts` ADD CONSTRAINT `community_posts_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `community_comments` ADD CONSTRAINT `community_comments_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `community_posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `community_comments` ADD CONSTRAINT `community_comments_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `community_comments` ADD CONSTRAINT `community_comments_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `community_comments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `community_reactions` ADD CONSTRAINT `community_reactions_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `community_posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `community_reactions` ADD CONSTRAINT `community_reactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clients` ADD CONSTRAINT `clients_agency_id_fkey` FOREIGN KEY (`agency_id`) REFERENCES `agencies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leads` ADD CONSTRAINT `leads_agency_id_fkey` FOREIGN KEY (`agency_id`) REFERENCES `agencies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `email_verification_tokens` ADD CONSTRAINT `email_verification_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `password_reset_tokens` ADD CONSTRAINT `password_reset_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `two_factor_devices` ADD CONSTRAINT `two_factor_devices_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification_tokens` ADD CONSTRAINT `notification_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_friends` ADD CONSTRAINT `user_friends_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_friends` ADD CONSTRAINT `user_friends_friend_id_fkey` FOREIGN KEY (`friend_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_preferences` ADD CONSTRAINT `user_preferences_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consent_records` ADD CONSTRAINT `consent_records_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attractions` ADD CONSTRAINT `attractions_destination_id_fkey` FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `packages` ADD CONSTRAINT `packages_agency_id_fkey` FOREIGN KEY (`agency_id`) REFERENCES `agencies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flights` ADD CONSTRAINT `flights_agency_id_fkey` FOREIGN KEY (`agency_id`) REFERENCES `agencies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flights` ADD CONSTRAINT `flights_airline_id_fkey` FOREIGN KEY (`airline_id`) REFERENCES `airlines`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flights` ADD CONSTRAINT `flights_departure_airport_id_fkey` FOREIGN KEY (`departure_airport_id`) REFERENCES `airports`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flights` ADD CONSTRAINT `flights_arrival_airport_id_fkey` FOREIGN KEY (`arrival_airport_id`) REFERENCES `airports`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flight_details` ADD CONSTRAINT `flight_details_flight_id_fkey` FOREIGN KEY (`flight_id`) REFERENCES `flights`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_details` ADD CONSTRAINT `service_details_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cruises` ADD CONSTRAINT `cruises_agency_id_fkey` FOREIGN KEY (`agency_id`) REFERENCES `agencies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cruise_ships` ADD CONSTRAINT `cruise_ships_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `cruise_providers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accommodations` ADD CONSTRAINT `accommodations_destination_id_fkey` FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotels` ADD CONSTRAINT `hotels_agency_id_fkey` FOREIGN KEY (`agency_id`) REFERENCES `agencies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_details` ADD CONSTRAINT `hotel_details_hotel_id_fkey` FOREIGN KEY (`hotel_id`) REFERENCES `hotels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_properties` ADD CONSTRAINT `hotel_properties_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `hotel_providers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_rooms` ADD CONSTRAINT `hotel_rooms_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activities` ADD CONSTRAINT `activities_destination_id_fkey` FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `services` ADD CONSTRAINT `services_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `providers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `services` ADD CONSTRAINT `services_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `destinations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_offerings` ADD CONSTRAINT `activity_offerings_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `activity_providers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gastronomy_restaurants` ADD CONSTRAINT `gastronomy_restaurants_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `gastronomy_providers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_offerings` ADD CONSTRAINT `event_offerings_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `event_providers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guide_offerings` ADD CONSTRAINT `guide_offerings_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `guide_providers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_images` ADD CONSTRAINT `service_images_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfers` ADD CONSTRAINT `transfers_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `providers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfer_vehicles` ADD CONSTRAINT `transfer_vehicles_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `transfer_providers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_agency_id_fkey` FOREIGN KEY (`agency_id`) REFERENCES `agencies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_destination_id_fkey` FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_trip_destination_id_fkey` FOREIGN KEY (`trip_destination_id`) REFERENCES `trip_destinations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flight_bookings` ADD CONSTRAINT `flight_bookings_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flight_bookings` ADD CONSTRAINT `flight_bookings_flightId_fkey` FOREIGN KEY (`flightId`) REFERENCES `flights`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_bookings` ADD CONSTRAINT `hotel_bookings_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_bookings` ADD CONSTRAINT `hotel_bookings_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_bookings` ADD CONSTRAINT `hotel_bookings_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `hotel_rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_bookings` ADD CONSTRAINT `service_bookings_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_bookings` ADD CONSTRAINT `service_bookings_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cruise_bookings` ADD CONSTRAINT `cruise_bookings_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cruise_bookings` ADD CONSTRAINT `cruise_bookings_cruiseId_fkey` FOREIGN KEY (`cruiseId`) REFERENCES `cruises`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfer_bookings` ADD CONSTRAINT `transfer_bookings_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfer_bookings` ADD CONSTRAINT `transfer_bookings_transferId_fkey` FOREIGN KEY (`transferId`) REFERENCES `transfers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_history` ADD CONSTRAINT `booking_history_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vouchers` ADD CONSTRAINT `vouchers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voucher_usage` ADD CONSTRAINT `voucher_usage_voucherId_fkey` FOREIGN KEY (`voucherId`) REFERENCES `vouchers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voucher_usage` ADD CONSTRAINT `voucher_usage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trips` ADD CONSTRAINT `trips_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itineraries` ADD CONSTRAINT `itineraries_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `trips`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itinerary_days` ADD CONSTRAINT `itinerary_days_itineraryId_fkey` FOREIGN KEY (`itineraryId`) REFERENCES `itineraries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_destinations` ADD CONSTRAINT `trip_destinations_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_destinations` ADD CONSTRAINT `trip_destinations_destination_id_fkey` FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `saved_itineraries` ADD CONSTRAINT `saved_itineraries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `saved_itineraries` ADD CONSTRAINT `saved_itineraries_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `destinations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_destination_id_fkey` FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_attraction_id_fkey` FOREIGN KEY (`attraction_id`) REFERENCES `attractions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_favorites` ADD CONSTRAINT `user_favorites_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_favorites` ADD CONSTRAINT `user_favorites_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `destinations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_conversations` ADD CONSTRAINT `ai_conversations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_chat_messages` ADD CONSTRAINT `ai_chat_messages_aiConversationId_fkey` FOREIGN KEY (`aiConversationId`) REFERENCES `ai_conversations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_chat_messages` ADD CONSTRAINT `ai_chat_messages_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_messages` ADD CONSTRAINT `ai_messages_aiConversationId_fkey` FOREIGN KEY (`aiConversationId`) REFERENCES `ai_conversations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_participants` ADD CONSTRAINT `chat_participants_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `chat_rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_participants` ADD CONSTRAINT `chat_participants_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `chat_rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_roomId_userId_fkey` FOREIGN KEY (`roomId`, `userId`) REFERENCES `chat_participants`(`roomId`, `userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loyalty_programs` ADD CONSTRAINT `loyalty_programs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loyalty_transactions` ADD CONSTRAINT `loyalty_transactions_loyaltyProgramId_fkey` FOREIGN KEY (`loyaltyProgramId`) REFERENCES `loyalty_programs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_moderated_by_fkey` FOREIGN KEY (`moderated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_destination_id_fkey` FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_comments` ADD CONSTRAINT `article_comments_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_comments` ADD CONSTRAINT `article_comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_comments` ADD CONSTRAINT `article_comments_parent_comment_id_fkey` FOREIGN KEY (`parent_comment_id`) REFERENCES `article_comments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_comments` ADD CONSTRAINT `article_comments_moderated_by_fkey` FOREIGN KEY (`moderated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_attempts` ADD CONSTRAINT `quiz_attempts_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `quizzes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_attempts` ADD CONSTRAINT `quiz_attempts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification_settings` ADD CONSTRAINT `notification_settings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `crm_bookings` ADD CONSTRAINT `crm_bookings_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `crm_customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `crm_products` ADD CONSTRAINT `crm_products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `crm_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transportations` ADD CONSTRAINT `transportations_destination_id_fkey` FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_images` ADD CONSTRAINT `hotel_images_hotel_id_fkey` FOREIGN KEY (`hotel_id`) REFERENCES `hotels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cruise_details` ADD CONSTRAINT `cruise_details_cruise_id_fkey` FOREIGN KEY (`cruise_id`) REFERENCES `cruises`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guide_details` ADD CONSTRAINT `guide_details_guide_id_fkey` FOREIGN KEY (`guide_id`) REFERENCES `local_guides`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_destinations` ADD CONSTRAINT `article_destinations_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_destinations` ADD CONSTRAINT `article_destinations_destination_id_fkey` FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_attractions` ADD CONSTRAINT `article_attractions_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_attractions` ADD CONSTRAINT `article_attractions_attraction_id_fkey` FOREIGN KEY (`attraction_id`) REFERENCES `attractions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supplier_contacts` ADD CONSTRAINT `supplier_contacts_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commission_records` ADD CONSTRAINT `commission_records_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `preference_events` ADD CONSTRAINT `preference_events_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `response_predictions` ADD CONSTRAINT `response_predictions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
