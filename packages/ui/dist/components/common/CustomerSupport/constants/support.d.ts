export declare const WHATSAPP_NUMBER = "+351912345678";
export declare const PHONE_NUMBER = "+351221234567";
export declare const QUICK_REPLY_CATEGORIES: {
    title: string;
    replies: string[];
}[];
export declare const QUICK_REPLIES: string[];
export declare const getBotResponse: (message: string, context?: {
    followUp?: {
        options: string[];
    };
}) => {
    response: string;
    followUp?: {
        question: string;
        options: string[];
    } | null;
};
