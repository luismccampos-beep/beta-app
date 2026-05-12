import type { SystemPaymentMethod } from '../types/payments.js';
export declare const createSystemPaymentMethod: (overrides?: Partial<SystemPaymentMethod>) => SystemPaymentMethod;
export declare const createManySystemPaymentMethods: (count: number) => SystemPaymentMethod[];
