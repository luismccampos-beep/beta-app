// Common types used across frontend and backend
// Re-exporting all types from individual modules to avoid conflicts

export * from './auth';
export * from './notifications';
export * from './resolver';
export * from './bookings';
export * from './package';
export * from './payments';
export * from './ai-preferences';
// export * from './user'; // Removed to avoid circularity and conflicts
export * from './settings';
export * from './security';
export * from './maintenance';
export * from './newsletters';
export * from './systemLogs';
export { type User, type UserPreferences, type UserAddress, type SocialMedia, type UserRole, type ProfileVisibility } from './auth';
export { type DestinationDetail } from './trip';
export * from './traveler-profile';


