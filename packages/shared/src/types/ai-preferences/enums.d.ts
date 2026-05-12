export declare enum AIProvider {
    OpenAI = "openai",
    Anthropic = "anthropic",
    Google = "google",
    Weather = "weather",
    Currency = "currency",
    Local = "local"
}
export declare const AI_PROVIDERS: {
    readonly OpenAI: AIProvider.OpenAI;
    readonly Anthropic: AIProvider.Anthropic;
    readonly Google: AIProvider.Google;
    readonly Weather: AIProvider.Weather;
    readonly Currency: AIProvider.Currency;
    readonly Local: AIProvider.Local;
};
export declare enum TravelStyle {
    Luxury = "Luxury",
    Comfort = "Comfort",
    Budget = "Budget",
    Adventure = "Adventure",
    Cultural = "Cultural",
    Relaxation = "Relaxation"
}
export declare const TRAVEL_STYLES: {
    readonly Luxury: TravelStyle.Luxury;
    readonly Comfort: TravelStyle.Comfort;
    readonly Budget: TravelStyle.Budget;
    readonly Adventure: TravelStyle.Adventure;
    readonly Cultural: TravelStyle.Cultural;
    readonly Relaxation: TravelStyle.Relaxation;
};
export declare enum SustainabilityLevel {
    Low = "Low",
    Medium = "Medium",
    High = "High"
}
export declare const SUSTAINABILITY_LEVELS: {
    readonly Low: SustainabilityLevel.Low;
    readonly Medium: SustainabilityLevel.Medium;
    readonly High: SustainabilityLevel.High;
};
export declare enum PersonalityType {
    Professional = "Professional",
    Friendly = "Friendly",
    Enthusiastic = "Enthusiastic",
    Detailed = "Detailed",
    Concise = "Concise",
    Casual = "Casual"
}
export declare const PERSONALITY_TYPES: {
    readonly Professional: PersonalityType.Professional;
    readonly Friendly: PersonalityType.Friendly;
    readonly Enthusiastic: PersonalityType.Enthusiastic;
    readonly Detailed: PersonalityType.Detailed;
    readonly Concise: PersonalityType.Concise;
    readonly Casual: PersonalityType.Casual;
};
export declare enum ResponseLength {
    Short = "Short",
    Medium = "Medium",
    Detailed = "Detailed",
    Brief = "Brief"
}
export declare const RESPONSE_LENGTHS: {
    readonly Short: ResponseLength.Short;
    readonly Medium: ResponseLength.Medium;
    readonly Detailed: ResponseLength.Detailed;
    readonly Brief: ResponseLength.Brief;
};
export declare enum NotificationType {
    Email = "email",
    Push = "push",
    SMS = "sms",
    InApp = "in-app"
}
export declare const NOTIFICATION_TYPES: {
    readonly Email: NotificationType.Email;
    readonly Push: NotificationType.Push;
    readonly SMS: NotificationType.SMS;
    readonly InApp: NotificationType.InApp;
};
export declare enum NotificationFrequency {
    Immediate = "Immediate",
    Daily = "Daily",
    Weekly = "Weekly",
    Monthly = "Monthly",
    Never = "Never"
}
export declare const NOTIFICATION_FREQUENCIES: {
    readonly Immediate: NotificationFrequency.Immediate;
    readonly Daily: NotificationFrequency.Daily;
    readonly Weekly: NotificationFrequency.Weekly;
    readonly Monthly: NotificationFrequency.Monthly;
    readonly Never: NotificationFrequency.Never;
};
/**
 * Budget level choices for AI preferences
 * 5 money options based on user spending preferences
 */
export declare enum BudgetLevel {
    /** Budget-friendly options, lowest cost */
    Economy = "Economy",
    /** Moderate spending, balanced value */
    Moderate = "Moderate",
    /** Comfortable spending, good value */
    Comfort = "Comfort",
    /** Higher spending, premium experience */
    Premium = "Premium",
    /** Maximum spending, luxury options only */
    Luxury = "Luxury"
}
export declare const BUDGET_LEVELS: {
    /** Budget-friendly options, lowest cost */
    readonly Economy: BudgetLevel.Economy;
    /** Moderate spending, balanced value */
    readonly Moderate: BudgetLevel.Moderate;
    /** Comfortable spending, good value */
    readonly Comfort: BudgetLevel.Comfort;
    /** Higher spending, premium experience */
    readonly Premium: BudgetLevel.Premium;
    /** Maximum spending, luxury options only */
    readonly Luxury: BudgetLevel.Luxury;
};
