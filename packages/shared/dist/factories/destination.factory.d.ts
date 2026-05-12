import type { DestinationDetail } from '../types/trip';
export declare const createDestination: (overrides?: Partial<DestinationDetail>) => DestinationDetail;
export declare const createManyDestinations: (count?: number) => DestinationDetail[];
