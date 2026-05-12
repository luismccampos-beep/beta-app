/**
 * Declared with `| undefined` on every optional field to satisfy
 * `exactOptionalPropertyTypes: true` in tsconfig.
 */
export interface GuideSummary {
    id: string;
    name: string;
    photo?: string | undefined;
    expertise?: string | undefined;
    bio?: string | undefined;
    rating?: number | undefined;
    location?: {
        name?: string | undefined;
    } | string | undefined;
    specialties?: string[] | undefined;
    certifications?: string[] | undefined;
    availability?: string[] | undefined;
    pricing?: unknown;
    languages?: string[] | undefined;
    images?: string[] | undefined;
}
declare class GuidesService {
    getAllGuides(): Promise<GuideSummary[]>;
}
declare const guidesService: GuidesService;
export default guidesService;
