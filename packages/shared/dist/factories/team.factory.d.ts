export interface TeamMember {
    name: string;
    role: string;
    bio: string;
    avatar: string;
    linkedin: string;
    email: string;
}
export declare const createTeamMember: (overrides?: Partial<TeamMember>) => TeamMember;
export declare const createManyTeamMembers: (count?: number) => TeamMember[];
export interface Partnership {
    name: string;
    logo: string;
    description: string;
}
export declare const createPartnership: (overrides?: Partial<Partnership>) => Partnership;
export declare const createManyPartnerships: (count?: number) => Partnership[];
