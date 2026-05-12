// shared/src/validation/index.ts
// Centralized exports for Zod schemas and validation helpers

export {
  ActivitySchema,
  AccommodationSchema,
  TransportationSchema,
  BudgetInfoSchema,
  TripFeedbackSchema,
  ActivitySchemaForFeedback,
  AccommodationSchemaForFeedback,
  TransportationSchemaForFeedback,
  ActivityBaseSchema,
  AccommodationBaseSchema,
  TransportationBaseSchema,
  TripFeedbackBaseSchema,
} from '../types/trip';

export {
  emailSchema,
  passwordSchema,
  phoneSchema,
  dateSchema,
  requiredString,
  optionalString,
  positiveNumber,
  urlSchema,
  validateWithSchema,
  nonEmptyString,
  optionalDate,
  uuidSchema,
} from '../utils/validation';
