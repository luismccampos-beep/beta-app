export interface Trip {
    id: string;
    userId: string;
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    destination: string;
    status: 'planned' | 'active' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}
export type TripStatus = 'planned' | 'active' | 'completed' | 'cancelled';
