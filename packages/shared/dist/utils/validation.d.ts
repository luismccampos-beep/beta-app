import { z } from 'zod';
export declare const emailSchema: z.ZodString;
export declare const passwordSchema: z.ZodString;
export declare const phoneSchema: z.ZodString;
export declare const dateSchema: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDate>;
export declare const requiredString: (message?: string) => z.ZodString;
export declare const optionalString: () => z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
export declare const positiveNumber: (message?: string) => z.ZodNumber;
export declare const urlSchema: z.ZodString;
export declare const validateWithSchema: <T>(schema: z.ZodSchema<T>, data: unknown) => {
    success: boolean;
    data?: T;
    errors?: Record<string, string>;
};
export declare const nonEmptyString: (message?: string) => z.ZodString;
export declare const optionalDate: () => z.ZodUnion<[z.ZodOptional<z.ZodDate>, z.ZodLiteral<"">]>;
export declare const uuidSchema: () => z.ZodString;
