import { z } from 'zod';
// Enhanced email validation with common format checks
export const emailSchema = z
    .string()
    .email({ message: 'Invalid email address format' })
    .refine((val) => val.trim().includes('@') && val.trim().includes('.'), {
    message: 'Email must contain @ and . characters',
})
    .trim();
// Strengthened password validation with special characters requirement
export const passwordSchema = z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' })
    .refine((val) => !/[<>{}|\\^~[\]`]/g.test(val), {
    message: 'Password contains invalid characters',
});
// More flexible international phone number validation
export const phoneSchema = z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,}$/, {
    message: 'Invalid phone number format. Must be 7+ digits with optional country code',
})
    .refine((val) => val.trim().length >= 7, { message: 'Phone number must be at least 7 digits' });
// Robust date validation with preprocessing
export const dateSchema = z.preprocess((arg) => {
    if (typeof arg === 'string')
        return new Date(arg);
    if (arg instanceof Date)
        return arg;
    if (typeof arg === 'number')
        return new Date(arg);
    return arg;
}, z.date().refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid date format',
}));
// Helper functions
export const requiredString = (message = 'This field is required') => z
    .string()
    .min(1, { message })
    .trim()
    .refine((val) => val.length > 0, { message });
export const optionalString = () => z.string().optional().or(z.literal(''));
export const positiveNumber = (message = 'Must be a positive number') => z.number().min(0, { message }).int({ message: 'Must be an integer' });
export const urlSchema = z
    .string()
    .url({ message: 'Invalid URL format' })
    .refine((val) => val.startsWith('http://') || val.startsWith('https://'), {
    message: 'URL must start with http:// or https://',
});
// Enhanced validation helper with detailed error messages
export const validateWithSchema = (schema, data) => {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    // Format errors as an object with field paths as keys
    const errors = {};
    result.error.issues.forEach((err) => {
        const path = err.path.join('.');
        // eslint-disable-next-line security/detect-object-injection
        errors[path] = err.message;
    });
    return {
        success: false,
        errors,
    };
};
// Additional helper schemas
export const nonEmptyString = (message = 'This field cannot be empty') => z
    .string()
    .min(1, { message })
    .trim()
    .refine((val) => val.length > 0, { message });
export const optionalDate = () => z.date().optional().or(z.literal(''));
export const uuidSchema = () => z.string().uuid({ message: 'Invalid UUID format' }).trim();
// ============================================
// Tax ID / NIF validation
// ============================================
export const isValidNIF = (input) => {
    if (typeof input !== 'string')
        return false;
    const nif = input.replace(/[\s-]/g, '');
    if (!/^\d{9}$/.test(nif))
        return false;
    const validFirstDigits = new Set(['1', '2', '3', '5', '6', '7', '8', '9']);
    if (!validFirstDigits.has(nif[0]))
        return false;
    let checksum = 0;
    for (let i = 0; i < 8; i += 1) {
        checksum += Number(nif[i]) * (9 - i);
    }
    const remainder = checksum % 11;
    const expected = remainder < 2 ? 0 : 11 - remainder;
    return expected === Number(nif[8]);
};
export const nifSchema = z
    .string()
    .trim()
    .refine((val) => val === '' || isValidNIF(val), {
    message: 'Invalid NIF (must be 9 digits with a valid check digit)',
});
export const isValidTaxId = (input) => {
    if (typeof input !== 'string')
        return false;
    const trimmed = input.replace(/[\s-]/g, '');
    return /^[A-Za-z0-9]{5,20}$/.test(trimmed);
};
export const taxIdSchema = z
    .string()
    .trim()
    .refine((val) => val === '' || isValidTaxId(val), {
    message: 'Invalid tax identification number',
});
//# sourceMappingURL=validation.js.map