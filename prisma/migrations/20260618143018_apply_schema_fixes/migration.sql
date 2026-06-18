-- DropForeignKey
ALTER TABLE "accommodations" DROP CONSTRAINT "accommodations_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "activity_offerings" DROP CONSTRAINT "activity_offerings_providerId_fkey";

-- DropForeignKey
ALTER TABLE "ai_chat_messages" DROP CONSTRAINT "ai_chat_messages_aiConversationId_fkey";

-- DropForeignKey
ALTER TABLE "ai_chat_messages" DROP CONSTRAINT "ai_chat_messages_userId_fkey";

-- DropForeignKey
ALTER TABLE "ai_conversations" DROP CONSTRAINT "ai_conversations_userId_fkey";

-- DropForeignKey
ALTER TABLE "ai_messages" DROP CONSTRAINT "ai_messages_aiConversationId_fkey";

-- DropForeignKey
ALTER TABLE "article_attractions" DROP CONSTRAINT "article_attractions_article_id_fkey";

-- DropForeignKey
ALTER TABLE "article_attractions" DROP CONSTRAINT "article_attractions_attraction_id_fkey";

-- DropForeignKey
ALTER TABLE "article_comments" DROP CONSTRAINT "article_comments_article_id_fkey";

-- DropForeignKey
ALTER TABLE "article_comments" DROP CONSTRAINT "article_comments_moderated_by_fkey";

-- DropForeignKey
ALTER TABLE "article_comments" DROP CONSTRAINT "article_comments_parent_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "article_comments" DROP CONSTRAINT "article_comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "article_destinations" DROP CONSTRAINT "article_destinations_article_id_fkey";

-- DropForeignKey
ALTER TABLE "article_destinations" DROP CONSTRAINT "article_destinations_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_author_id_fkey";

-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_moderated_by_fkey";

-- DropForeignKey
ALTER TABLE "attractions" DROP CONSTRAINT "attractions_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "booking_history" DROP CONSTRAINT "booking_history_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_agency_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_client_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_trip_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_trip_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_userId_fkey";

-- DropForeignKey
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_roomId_fkey";

-- DropForeignKey
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_roomId_userId_fkey";

-- DropForeignKey
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_userId_fkey";

-- DropForeignKey
ALTER TABLE "chat_participants" DROP CONSTRAINT "chat_participants_roomId_fkey";

-- DropForeignKey
ALTER TABLE "chat_participants" DROP CONSTRAINT "chat_participants_userId_fkey";

-- DropForeignKey
ALTER TABLE "clients" DROP CONSTRAINT "clients_agency_id_fkey";

-- DropForeignKey
ALTER TABLE "commission_records" DROP CONSTRAINT "commission_records_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "community_comments" DROP CONSTRAINT "community_comments_author_id_fkey";

-- DropForeignKey
ALTER TABLE "community_comments" DROP CONSTRAINT "community_comments_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "community_comments" DROP CONSTRAINT "community_comments_post_id_fkey";

-- DropForeignKey
ALTER TABLE "community_posts" DROP CONSTRAINT "community_posts_author_id_fkey";

-- DropForeignKey
ALTER TABLE "community_reactions" DROP CONSTRAINT "community_reactions_post_id_fkey";

-- DropForeignKey
ALTER TABLE "community_reactions" DROP CONSTRAINT "community_reactions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "consent_records" DROP CONSTRAINT "consent_records_userId_fkey";

-- DropForeignKey
ALTER TABLE "crm_bookings" DROP CONSTRAINT "crm_bookings_customerId_fkey";

-- DropForeignKey
ALTER TABLE "crm_products" DROP CONSTRAINT "crm_products_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "cruise_bookings" DROP CONSTRAINT "cruise_bookings_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "cruise_bookings" DROP CONSTRAINT "cruise_bookings_cruiseId_fkey";

-- DropForeignKey
ALTER TABLE "cruise_details" DROP CONSTRAINT "cruise_details_cruise_id_fkey";

-- DropForeignKey
ALTER TABLE "cruise_ships" DROP CONSTRAINT "cruise_ships_providerId_fkey";

-- DropForeignKey
ALTER TABLE "cruises" DROP CONSTRAINT "cruises_agency_id_fkey";

-- DropForeignKey
ALTER TABLE "email_verification_tokens" DROP CONSTRAINT "email_verification_tokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "event_offerings" DROP CONSTRAINT "event_offerings_providerId_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_userId_fkey";

-- DropForeignKey
ALTER TABLE "flight_bookings" DROP CONSTRAINT "flight_bookings_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "flight_bookings" DROP CONSTRAINT "flight_bookings_flightId_fkey";

-- DropForeignKey
ALTER TABLE "flight_details" DROP CONSTRAINT "flight_details_flight_id_fkey";

-- DropForeignKey
ALTER TABLE "flight_price_statistics" DROP CONSTRAINT "flight_price_statistics_route_id_fkey";

-- DropForeignKey
ALTER TABLE "flight_routes" DROP CONSTRAINT "flight_routes_dest_id_fkey";

-- DropForeignKey
ALTER TABLE "flight_routes" DROP CONSTRAINT "flight_routes_origin_id_fkey";

-- DropForeignKey
ALTER TABLE "flights" DROP CONSTRAINT "flights_agency_id_fkey";

-- DropForeignKey
ALTER TABLE "flights" DROP CONSTRAINT "flights_airline_id_fkey";

-- DropForeignKey
ALTER TABLE "flights" DROP CONSTRAINT "flights_arrival_airport_id_fkey";

-- DropForeignKey
ALTER TABLE "flights" DROP CONSTRAINT "flights_departure_airport_id_fkey";

-- DropForeignKey
ALTER TABLE "gastronomy_restaurants" DROP CONSTRAINT "gastronomy_restaurants_providerId_fkey";

-- DropForeignKey
ALTER TABLE "guide_details" DROP CONSTRAINT "guide_details_guide_id_fkey";

-- DropForeignKey
ALTER TABLE "guide_offerings" DROP CONSTRAINT "guide_offerings_providerId_fkey";

-- DropForeignKey
ALTER TABLE "hotel_bookings" DROP CONSTRAINT "hotel_bookings_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "hotel_bookings" DROP CONSTRAINT "hotel_bookings_hotelId_fkey";

-- DropForeignKey
ALTER TABLE "hotel_bookings" DROP CONSTRAINT "hotel_bookings_roomId_fkey";

-- DropForeignKey
ALTER TABLE "hotel_details" DROP CONSTRAINT "hotel_details_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "hotel_images" DROP CONSTRAINT "hotel_images_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "hotel_properties" DROP CONSTRAINT "hotel_properties_providerId_fkey";

-- DropForeignKey
ALTER TABLE "hotel_rooms" DROP CONSTRAINT "hotel_rooms_hotelId_fkey";

-- DropForeignKey
ALTER TABLE "hotels" DROP CONSTRAINT "hotels_agency_id_fkey";

-- DropForeignKey
ALTER TABLE "itineraries" DROP CONSTRAINT "itineraries_tripId_fkey";

-- DropForeignKey
ALTER TABLE "itinerary_days" DROP CONSTRAINT "itinerary_days_itineraryId_fkey";

-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_agency_id_fkey";

-- DropForeignKey
ALTER TABLE "loyalty_programs" DROP CONSTRAINT "loyalty_programs_userId_fkey";

-- DropForeignKey
ALTER TABLE "loyalty_transactions" DROP CONSTRAINT "loyalty_transactions_loyaltyProgramId_fkey";

-- DropForeignKey
ALTER TABLE "notification_settings" DROP CONSTRAINT "notification_settings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "notification_tokens" DROP CONSTRAINT "notification_tokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "packages" DROP CONSTRAINT "packages_agency_id_fkey";

-- DropForeignKey
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_tokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "payment_transactions" DROP CONSTRAINT "payment_transactions_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_transactions" DROP CONSTRAINT "payment_transactions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "preference_events" DROP CONSTRAINT "preference_events_user_id_fkey";

-- DropForeignKey
ALTER TABLE "quiz_attempts" DROP CONSTRAINT "quiz_attempts_quizId_fkey";

-- DropForeignKey
ALTER TABLE "quiz_attempts" DROP CONSTRAINT "quiz_attempts_userId_fkey";

-- DropForeignKey
ALTER TABLE "response_predictions" DROP CONSTRAINT "response_predictions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_attraction_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "saved_itineraries" DROP CONSTRAINT "saved_itineraries_destinationId_fkey";

-- DropForeignKey
ALTER TABLE "saved_itineraries" DROP CONSTRAINT "saved_itineraries_userId_fkey";

-- DropForeignKey
ALTER TABLE "service_bookings" DROP CONSTRAINT "service_bookings_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "service_bookings" DROP CONSTRAINT "service_bookings_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "service_details" DROP CONSTRAINT "service_details_service_id_fkey";

-- DropForeignKey
ALTER TABLE "service_images" DROP CONSTRAINT "service_images_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_destinationId_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_providerId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "supplier_contacts" DROP CONSTRAINT "supplier_contacts_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "transfer_bookings" DROP CONSTRAINT "transfer_bookings_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "transfer_bookings" DROP CONSTRAINT "transfer_bookings_transferId_fkey";

-- DropForeignKey
ALTER TABLE "transfer_vehicles" DROP CONSTRAINT "transfer_vehicles_providerId_fkey";

-- DropForeignKey
ALTER TABLE "transfers" DROP CONSTRAINT "transfers_providerId_fkey";

-- DropForeignKey
ALTER TABLE "transportations" DROP CONSTRAINT "transportations_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "trip_destinations" DROP CONSTRAINT "trip_destinations_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "trip_destinations" DROP CONSTRAINT "trip_destinations_trip_id_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_user_id_fkey";

-- DropForeignKey
ALTER TABLE "two_factor_devices" DROP CONSTRAINT "two_factor_devices_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_favorites" DROP CONSTRAINT "user_favorites_destinationId_fkey";

-- DropForeignKey
ALTER TABLE "user_favorites" DROP CONSTRAINT "user_favorites_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_friends" DROP CONSTRAINT "user_friends_friend_id_fkey";

-- DropForeignKey
ALTER TABLE "user_friends" DROP CONSTRAINT "user_friends_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_preferences" DROP CONSTRAINT "user_preferences_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_agency_id_fkey";

-- DropForeignKey
ALTER TABLE "voucher_usage" DROP CONSTRAINT "voucher_usage_userId_fkey";

-- DropForeignKey
ALTER TABLE "voucher_usage" DROP CONSTRAINT "voucher_usage_voucherId_fkey";

-- DropForeignKey
ALTER TABLE "vouchers" DROP CONSTRAINT "vouchers_userId_fkey";

-- DropForeignKey
ALTER TABLE "wv_flights" DROP CONSTRAINT "wv_flights_destino_id_fkey";

-- DropForeignKey
ALTER TABLE "wv_hotel_reviews" DROP CONSTRAINT "wv_hotel_reviews_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "wv_hotels" DROP CONSTRAINT "wv_hotels_destino_id_fkey";

-- DropForeignKey
ALTER TABLE "wv_listings" DROP CONSTRAINT "wv_listings_destino_id_fkey";

-- DropIndex
DROP INDEX "agencies_slug_idx";

-- CreateIndex
CREATE INDEX "article_comments_article_id_idx" ON "article_comments"("article_id");

-- CreateIndex
CREATE INDEX "article_comments_user_id_idx" ON "article_comments"("user_id");

-- CreateIndex
CREATE INDEX "article_comments_parent_comment_id_idx" ON "article_comments"("parent_comment_id");

-- CreateIndex
CREATE INDEX "article_comments_moderated_by_idx" ON "article_comments"("moderated_by");

-- CreateIndex
CREATE INDEX "articles_author_id_idx" ON "articles"("author_id");

-- CreateIndex
CREATE INDEX "articles_destination_id_idx" ON "articles"("destination_id");

-- CreateIndex
CREATE INDEX "articles_moderated_by_idx" ON "articles"("moderated_by");

-- CreateIndex
CREATE INDEX "bookings_trip_destination_id_idx" ON "bookings"("trip_destination_id");

-- CreateIndex
CREATE INDEX "community_comments_parent_id_idx" ON "community_comments"("parent_id");

-- CreateIndex
CREATE INDEX "flights_departure_airport_id_idx" ON "flights"("departure_airport_id");

-- CreateIndex
CREATE INDEX "flights_arrival_airport_id_idx" ON "flights"("arrival_airport_id");

-- CreateIndex
CREATE INDEX "transfer_bookings_transferId_idx" ON "transfer_bookings"("transferId");

-- CreateIndex
CREATE INDEX "wv_destinations_slug_idx" ON "wv_destinations"("slug");

-- CreateIndex
CREATE INDEX "wv_flights_origem_destino_iata_idx" ON "wv_flights"("origem", "destino_iata");
