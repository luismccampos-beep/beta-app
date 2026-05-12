import { z } from 'zod';
export declare const aiMessageSchema: z.ZodObject<{
    id: z.ZodString;
    role: z.ZodEnum<["user", "assistant", "system"]>;
    content: z.ZodString;
    createdAt: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    role: "user" | "system" | "assistant";
    content: string;
    createdAt: number;
}, {
    id: string;
    role: "user" | "system" | "assistant";
    content: string;
    createdAt: number;
}>;
