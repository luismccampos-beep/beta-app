import type { User } from '../types/auth';
export declare const createUser: (overrides?: Partial<User>) => User;
export declare const createManyUsers: (count?: number) => User[];
