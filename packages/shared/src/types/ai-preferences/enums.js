// packages/shared/src/types/ai-preferences/enums.ts
export var AIProvider;
(function (AIProvider) {
    AIProvider["OpenAI"] = "openai";
    AIProvider["Anthropic"] = "anthropic";
    AIProvider["Google"] = "google";
    AIProvider["Weather"] = "weather";
    AIProvider["Currency"] = "currency";
    AIProvider["Local"] = "local";
})(AIProvider || (AIProvider = {}));
export const AI_PROVIDERS = { ...AIProvider };
export var TravelStyle;
(function (TravelStyle) {
    TravelStyle["Luxury"] = "Luxury";
    TravelStyle["Comfort"] = "Comfort";
    TravelStyle["Budget"] = "Budget";
    TravelStyle["Adventure"] = "Adventure";
    TravelStyle["Cultural"] = "Cultural";
    TravelStyle["Relaxation"] = "Relaxation";
})(TravelStyle || (TravelStyle = {}));
export const TRAVEL_STYLES = { ...TravelStyle };
export var SustainabilityLevel;
(function (SustainabilityLevel) {
    SustainabilityLevel["Low"] = "Low";
    SustainabilityLevel["Medium"] = "Medium";
    SustainabilityLevel["High"] = "High";
})(SustainabilityLevel || (SustainabilityLevel = {}));
export const SUSTAINABILITY_LEVELS = { ...SustainabilityLevel };
export var PersonalityType;
(function (PersonalityType) {
    PersonalityType["Professional"] = "Professional";
    PersonalityType["Friendly"] = "Friendly";
    PersonalityType["Enthusiastic"] = "Enthusiastic";
    PersonalityType["Detailed"] = "Detailed";
    PersonalityType["Concise"] = "Concise";
    PersonalityType["Casual"] = "Casual";
})(PersonalityType || (PersonalityType = {}));
export const PERSONALITY_TYPES = { ...PersonalityType };
export var ResponseLength;
(function (ResponseLength) {
    ResponseLength["Short"] = "Short";
    ResponseLength["Medium"] = "Medium";
    ResponseLength["Detailed"] = "Detailed";
    ResponseLength["Brief"] = "Brief";
})(ResponseLength || (ResponseLength = {}));
export const RESPONSE_LENGTHS = { ...ResponseLength };
export var NotificationType;
(function (NotificationType) {
    NotificationType["Email"] = "email";
    NotificationType["Push"] = "push";
    NotificationType["SMS"] = "sms";
    NotificationType["InApp"] = "in-app";
})(NotificationType || (NotificationType = {}));
export const NOTIFICATION_TYPES = { ...NotificationType };
export var NotificationFrequency;
(function (NotificationFrequency) {
    NotificationFrequency["Immediate"] = "Immediate";
    NotificationFrequency["Daily"] = "Daily";
    NotificationFrequency["Weekly"] = "Weekly";
    NotificationFrequency["Monthly"] = "Monthly";
    NotificationFrequency["Never"] = "Never";
})(NotificationFrequency || (NotificationFrequency = {}));
export const NOTIFICATION_FREQUENCIES = { ...NotificationFrequency };
/**
 * Budget level choices for AI preferences
 * 5 money options based on user spending preferences
 */
export var BudgetLevel;
(function (BudgetLevel) {
    /** Budget-friendly options, lowest cost */
    BudgetLevel["Economy"] = "Economy";
    /** Moderate spending, balanced value */
    BudgetLevel["Moderate"] = "Moderate";
    /** Comfortable spending, good value */
    BudgetLevel["Comfort"] = "Comfort";
    /** Higher spending, premium experience */
    BudgetLevel["Premium"] = "Premium";
    /** Maximum spending, luxury options only */
    BudgetLevel["Luxury"] = "Luxury";
})(BudgetLevel || (BudgetLevel = {}));
export const BUDGET_LEVELS = { ...BudgetLevel };
//# sourceMappingURL=enums.js.map