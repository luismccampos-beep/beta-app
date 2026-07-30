CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `accounts_user_id_idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_provider_idx` ON `accounts` (`provider`,`provider_account_id`);--> statement-breakpoint
CREATE TABLE `destinations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`country` text,
	`country_code` text,
	`city` text,
	`region` text,
	`description` text,
	`short_description` text,
	`image_url` text,
	`images` text,
	`latitude` real,
	`longitude` real,
	`price_per_day` real,
	`price_per_night` real,
	`currency` text DEFAULT 'EUR',
	`rating` real DEFAULT 0,
	`reviews_count` integer DEFAULT 0,
	`category` text DEFAULT 'CITY',
	`tags` text DEFAULT '[]',
	`continent` text,
	`meta_title` text,
	`meta_description` text,
	`climate_info` text,
	`best_time_to_visit` text,
	`visa_requirements` text,
	`primary_language` text,
	`is_verified` integer DEFAULT false,
	`is_published` integer DEFAULT true,
	`is_featured` integer DEFAULT false,
	`is_popular` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `destinations_slug_unique` ON `destinations` (`slug`);--> statement-breakpoint
CREATE INDEX `dest_slug_idx` ON `destinations` (`slug`);--> statement-breakpoint
CREATE INDEX `dest_continent_idx` ON `destinations` (`continent`);--> statement-breakpoint
CREATE INDEX `dest_country_idx` ON `destinations` (`country`);--> statement-breakpoint
CREATE INDEX `dest_published_idx` ON `destinations` (`is_published`);--> statement-breakpoint
CREATE TABLE `email_verification_tokens` (
	`token_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`email` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_verification_tokens_token_unique` ON `email_verification_tokens` (`token`);--> statement-breakpoint
CREATE INDEX `evt_user_id_idx` ON `email_verification_tokens` (`user_id`);--> statement-breakpoint
CREATE INDEX `evt_token_idx` ON `email_verification_tokens` (`token`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`refresh_token` text,
	`device_info` text,
	`device_fingerprint` text,
	`ip_address` text,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`last_used_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`is_revoked` integer DEFAULT false,
	`revoked_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_refresh_token_unique` ON `sessions` (`refresh_token`);--> statement-breakpoint
CREATE INDEX `sessions_user_id_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `sessions_token_idx` ON `sessions` (`token`);--> statement-breakpoint
CREATE TABLE `trips` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`slug` text,
	`name` text,
	`description` text,
	`destination_id` text,
	`start_date` text,
	`end_date` text,
	`budget` real,
	`currency` text DEFAULT 'EUR',
	`status` text DEFAULT 'DRAFT',
	`itinerary` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE INDEX `trips_user_id_idx` ON `trips` (`user_id`);--> statement-breakpoint
CREATE INDEX `trips_slug_idx` ON `trips` (`slug`);--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`travel_styles` text DEFAULT '[]',
	`budget_range` text DEFAULT '[2000,5000]',
	`preferred_destinations` text DEFAULT '[]',
	`daily_budget_profile` text DEFAULT 'conforto',
	`cabin_class` text DEFAULT 'economy',
	`ai_settings` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_preferences_user_id_unique` ON `user_preferences` (`user_id`);--> statement-breakpoint
CREATE INDEX `upref_user_id_idx` ON `user_preferences` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text,
	`name` text,
	`username` text,
	`avatar` text,
	`avatar_url` text,
	`phone` text,
	`birth_date` text,
	`role` text DEFAULT 'USER' NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`email_verified` integer DEFAULT false,
	`terms_accepted` integer DEFAULT false,
	`accepted_terms_date` text,
	`is_verified` integer DEFAULT false,
	`is_active` integer DEFAULT true,
	`permissions` text DEFAULT '[]',
	`two_factor_enabled` integer DEFAULT false,
	`two_factor_secret` text,
	`email_verification_token` text,
	`password_reset_token` text,
	`password_reset_expires` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text,
	`last_login` text,
	`preferred_language` text DEFAULT 'pt'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_phone_idx` ON `users` (`phone`);