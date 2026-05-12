// shared/src/models/index.ts
import { z } from 'zod';

// ============================================
// API Error Schemas
// ============================================

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
  field: z.string().optional(),
  stack: z.string().optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

// ============================================
// Auth Schemas
// ============================================

export const AuthRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  extra: z.object({
    state: z.string().optional(),
    enableCustomError: z.string().optional(),
  }).optional(),
});

export type AuthRequest = z.infer<typeof AuthRequestSchema>;

// ============================================
// Chat Message Schemas
// ============================================

const ChatMessageSchema = z.object({
  _id: z.string(),
  channel: z.string(),
  senderId: z.string(),
  text: z.string(),
  typeMeta: z.object({
    user: z.string(),
    channelID: z.string(),
    type: z.enum(['user', 'assistant', 'system']),
  }),
  metadata: z.object({
    sender: z.object({
      username: z.string(),
      avatar: z.string().optional(),
    }).optional(),
    timestamp: z.string(),
  }).optional(),
  timestamp: z.string(),
  addedBy: z.string(),
  deletedBy: z.string().optional(),
});


// ============================================
// Chat Session Schemas
// ============================================





// ============================================
// Chat Response Schemas
// ============================================

export const ChatSuccessResponseSchema = z.object({
  data: ChatMessageSchema,
  metadata: z.unknown().optional(),
});

export const ChatErrorResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  errorType: z.enum(['client_error', 'server_error', 'auth_error', 'unexpected']),
  source: z.object({
    stack: z.string(),
    error: z.string(),
  }).optional(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export const ChatMappingResponseSchema = z.union([
  ChatSuccessResponseSchema,
  ChatErrorResponseSchema,
]);

export type IChatMappingResponse = z.infer<typeof ChatMappingResponseSchema>;

// ============================================
// API Validation Schemas
// ============================================

export const ApiValidationSchema = z.object({
  query: z.object({
    min: z.number().default(0),
    max: z.number().default(50),
    type: z.enum(['all', 'new', 'old']),
  }),
  after: z.tuple([z.string(), z.string().optional()]).optional(),
});

export type ApiValidation = z.infer<typeof ApiValidationSchema>;

// ============================================
// User Utility Schemas
// ============================================

export const UserUtilitySchema = z.object({
  emailSpaces: z.boolean(),
  languageCode: z.object({
    allowed: z.enum(['en', 'es', 'fr', 'de', 'it']),
  }),
});

export type UserUtility = z.infer<typeof UserUtilitySchema>;

// ============================================
// Validators
// ============================================

export const emailValidator = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const uuidValidator = (value: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
};
