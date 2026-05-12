/** -------------------------
 * Tipos Globais de Eventos
 * ------------------------- */
export type AnalyticsEventType = 'navigation' | 'pageview' | 'performance' | 'session' | 'javascript_error' | 'promise_rejection' | 'form_interaction' | 'click' | 'interaction' | 'ai_interaction' | 'ml_metrics' | 'trust_metrics';
export interface NavigationEventDetail {
    path: string;
    search?: string;
    timestamp: string;
}
export interface PerformanceEventDetail {
    loadTime: number;
    domContentLoaded: number;
    userAgent: string;
    path: string;
}
export interface SessionEventDetail {
    duration: number;
    path: string;
    endReason?: 'page_unload' | 'tab_close' | 'visibility_change';
}
export interface JavaScriptErrorDetail {
    message: string;
    stack?: string;
    filename?: string;
    lineno?: number;
    colno?: number;
    path: string;
}
export interface PromiseRejectionDetail {
    reason?: unknown;
    stack?: string;
    path: string;
}
export interface FormInteractionDetail {
    formId: string;
    formClass: string;
    eventType: string;
    path: string;
}
export interface ClickDetail {
    id?: string;
    className?: string;
    text?: string;
    href?: string;
    path: string;
}
export type AIEventType = 'suggestion_shown' | 'suggestion_accepted' | 'filter_applied' | 'prompt_sent' | 'completion_received';
export interface AIEventDetail {
    type: AIEventType;
    payload?: Record<string, unknown>;
}
export interface AnalyticsEventMap {
    navigation: NavigationEventDetail;
    pageview: NavigationEventDetail;
    performance: PerformanceEventDetail;
    session: SessionEventDetail;
    javascript_error: JavaScriptErrorDetail;
    promise_rejection: PromiseRejectionDetail;
    form_interaction: FormInteractionDetail;
    click: ClickDetail;
    interaction: ClickDetail;
    ai_interaction: AIEventDetail;
    ml_metrics: MLAnalytics;
    trust_metrics: TrustAnalytics;
}
export type LogAnalyticsEvent = <T extends AnalyticsEventType>(type: T, name: string, data: AnalyticsEventMap[T]) => void;
/** -------------------------
 * Click & Funnel Analytics
 * ------------------------- */
export interface ClickAnalytics {
    total: number;
    byArea: Record<string, number>;
    conversionFunnel: {
        stages: {
            search: number;
            results: number;
            booking: number;
        };
        conversionRates: {
            searchToResults: number;
            overallConversion: number;
        };
    };
    searchInteractions: {
        popularSearchTerms: Array<{
            term: string;
            count: number;
        }>;
    };
}
/** -------------------------
 * ML Analytics & Metrics
 * ------------------------- */
export interface MLModel {
    modelName: string;
    accuracy: number;
    predictions: {
        [x: string]: string | number | boolean | Date | Record<string, unknown> | Array<unknown>;
        averageConfidence: number;
    };
}
export interface MLFeatureMetadata {
    method: string;
    timestamp: string;
    version: string;
}
export interface MLModelMetrics {
    datasetSize: number;
    totalPredictions: number;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    trainingDate: string;
    version: string;
    features: {
        scores: number[];
        names: string[];
        metadata: MLFeatureMetadata;
    };
}
export interface MLSummary {
    totalModels: number;
    activeModels: number;
    totalPredictions: number;
    averageAccuracy: number;
}
export interface MLDashboardData {
    summary: MLSummary;
    modelMetrics: Record<string, MLModelMetrics>;
    dataQuality: {
        completeness: number;
        accuracy: number;
        timeliness: number;
    };
    performanceMetrics: {
        inferenceTime: number;
        memoryUsage: number;
        throughput: number;
    };
    trainingHistory: Array<{
        modelName: string;
        accuracy: number;
        trainingDate: string;
        datasetSize: number;
    }>;
}
export interface MLAnalytics {
    summary: {
        [x: string]: string | number | Date;
        totalModels: number;
        averageAccuracy: number;
        totalPredictions: number;
        overallConfidence: number;
    };
    models: MLModel[];
    trainingHistory: Array<{
        modelName: string;
        accuracy: number;
        trainingDate: string;
        datasetSize: number;
    }>;
}
/** -------------------------
 * Trust & Compliance Analytics
 * ------------------------- */
export interface TrustDashboardData {
    [x: string]: unknown;
    overallScore: number;
    components: {
        securityPosture: number;
        mlAccuracy: number;
        responseTime: number;
        userSatisfaction: number;
        systemReliability: number;
        dataQuality: number;
    };
    certifications: string[];
    testimonials: {
        count: number;
        averageRating: number;
        recentFeedback: Array<{
            rating: number;
            comment: string;
            date: string;
            verified: boolean;
        }>;
    };
}
export interface TrustAnalytics {
    currentScore: number;
    components: Record<string, number>;
    badges: Array<{
        name: string;
        description: string;
        earned: boolean;
    }>;
    testimonials: {
        count: number;
        averageRating: number;
        recentFeedback: Array<{
            author: string;
            rating: number;
            comment: string;
            date: string;
            verified: boolean;
        }>;
    };
    improvements: string[];
}
/** -------------------------
 * Log Analytics (erros gerais)
 * ------------------------- */
export interface LogAnalytics {
    total: number;
    errorRate: number;
    byLevel: Record<string, number>;
    timeline: Record<string, number>;
    topErrors: Array<{
        message: string;
        count: number;
        lastOccurrence: string;
    }>;
}
