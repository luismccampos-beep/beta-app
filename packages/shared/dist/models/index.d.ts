import { z } from 'zod';
export declare const ApiErrorSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    field: z.ZodOptional<z.ZodString>;
    stack: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export declare const AuthRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    extra: z.ZodOptional<z.ZodObject<{
        state: z.ZodOptional<z.ZodString>;
        enableCustomError: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type AuthRequest = z.infer<typeof AuthRequestSchema>;
export declare const ChatSuccessResponseSchema: z.ZodObject<{
    data: z.ZodObject<{
        _id: z.ZodString;
        channel: z.ZodString;
        senderId: z.ZodString;
        text: z.ZodString;
        typeMeta: z.ZodObject<{
            user: z.ZodString;
            channelID: z.ZodString;
            type: z.ZodEnum<{
                system: "system";
                user: "user";
                assistant: "assistant";
            }>;
        }, z.core.$strip>;
        metadata: z.ZodOptional<z.ZodObject<{
            sender: z.ZodOptional<z.ZodObject<{
                username: z.ZodString;
                avatar: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            timestamp: z.ZodString;
        }, z.core.$strip>>;
        timestamp: z.ZodString;
        addedBy: z.ZodString;
        deletedBy: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    metadata: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>;
export declare const ChatErrorResponseSchema: z.ZodObject<{
    code: z.ZodNumber;
    message: z.ZodString;
    errorType: z.ZodEnum<{
        client_error: "client_error";
        server_error: "server_error";
        auth_error: "auth_error";
        unexpected: "unexpected";
    }>;
    source: z.ZodOptional<z.ZodObject<{
        stack: z.ZodString;
        error: z.ZodString;
    }, z.core.$strip>>;
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const ChatMappingResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
    data: z.ZodObject<{
        _id: z.ZodString;
        channel: z.ZodString;
        senderId: z.ZodString;
        text: z.ZodString;
        typeMeta: z.ZodObject<{
            user: z.ZodString;
            channelID: z.ZodString;
            type: z.ZodEnum<{
                system: "system";
                user: "user";
                assistant: "assistant";
            }>;
        }, z.core.$strip>;
        metadata: z.ZodOptional<z.ZodObject<{
            sender: z.ZodOptional<z.ZodObject<{
                username: z.ZodString;
                avatar: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            timestamp: z.ZodString;
        }, z.core.$strip>>;
        timestamp: z.ZodString;
        addedBy: z.ZodString;
        deletedBy: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    metadata: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>, z.ZodObject<{
    code: z.ZodNumber;
    message: z.ZodString;
    errorType: z.ZodEnum<{
        client_error: "client_error";
        server_error: "server_error";
        auth_error: "auth_error";
        unexpected: "unexpected";
    }>;
    source: z.ZodOptional<z.ZodObject<{
        stack: z.ZodString;
        error: z.ZodString;
    }, z.core.$strip>>;
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>]>;
export type IChatMappingResponse = z.infer<typeof ChatMappingResponseSchema>;
export declare const ApiValidationSchema: z.ZodObject<{
    query: z.ZodObject<{
        min: z.ZodDefault<z.ZodNumber>;
        max: z.ZodDefault<z.ZodNumber>;
        type: z.ZodEnum<{
            all: "all";
            new: "new";
            old: "old";
        }>;
    }, z.core.$strip>;
    after: z.ZodOptional<z.ZodTuple<[z.ZodString, z.ZodOptional<z.ZodString>], null>>;
}, z.core.$strip>;
export type ApiValidation = z.infer<typeof ApiValidationSchema>;
export declare const UserUtilitySchema: z.ZodObject<{
    emailSpaces: z.ZodBoolean;
    languageCode: z.ZodObject<{
        allowed: z.ZodEnum<{
            en: "en";
            es: "es";
            fr: "fr";
            de: "de";
            it: "it";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UserUtility = z.infer<typeof UserUtilitySchema>;
export declare const emailValidator: (value: string) => boolean;
export declare const uuidValidator: (value: string) => boolean;
