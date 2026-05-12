// src/utils/validation.ts
import { z } from "zod";
var emailSchema = z.string().email({ message: "Invalid email address format" }).refine((val) => val.trim().includes("@") && val.trim().includes("."), {
  message: "Email must contain @ and . characters"
}).trim();
var passwordSchema = z.string().min(8, { message: "Password must be at least 8 characters" }).regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }).regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" }).regex(/[0-9]/, { message: "Password must contain at least one number" }).regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }).refine((val) => !/[<>{}|\\^~[\]`]/g.test(val), {
  message: "Password contains invalid characters"
});
var phoneSchema = z.string().regex(/^\+?[0-9\s\-()]{7,}$/, {
  message: "Invalid phone number format. Must be 7+ digits with optional country code"
}).refine((val) => val.trim().length >= 7, { message: "Phone number must be at least 7 digits" });
var dateSchema = z.preprocess(
  (arg) => {
    if (typeof arg === "string") return new Date(arg);
    if (arg instanceof Date) return arg;
    if (typeof arg === "number") return new Date(arg);
    return arg;
  },
  z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Invalid date format"
  })
);
var requiredString = (message = "This field is required") => z.string().min(1, { message }).trim().refine((val) => val.length > 0, { message });
var optionalString = () => z.string().optional().or(z.literal(""));
var positiveNumber = (message = "Must be a positive number") => z.number().min(0, { message }).int({ message: "Must be an integer" });
var urlSchema = z.string().url({ message: "Invalid URL format" }).refine((val) => val.startsWith("http://") || val.startsWith("https://"), {
  message: "URL must start with http:// or https://"
});
var validateWithSchema = (schema, data) => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors = {};
  result.error.issues.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });
  return {
    success: false,
    errors
  };
};
var nonEmptyString = (message = "This field cannot be empty") => z.string().min(1, { message }).trim().refine((val) => val.length > 0, { message });
var optionalDate = () => z.date().optional().or(z.literal(""));
var uuidSchema = () => z.string().uuid({ message: "Invalid UUID format" }).trim();

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
  uuidSchema
};
//# sourceMappingURL=chunk-RP6JGCEK.js.map