export interface Candidate {
    destinationId: number;
    destinationName: string;
    score: number;
    reasons: string[];
    budgetCategory: 'low' | 'medium' | 'high';
    tags: string[];
    travelDates?: {
        start: string;
        end: string;
    };
}
export declare const createCandidate: (overrides?: Partial<Candidate>) => Candidate;
export declare const createManyCandidates: (count?: number) => Candidate[];
