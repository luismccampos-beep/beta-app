import { faker } from '@faker-js/faker';
export const createSystemPaymentMethod = (overrides = {}) => {
    return {
        id: faker.string.uuid(),
        name: faker.finance.transactionType(),
        description: faker.lorem.sentence(),
        type: faker.helpers.arrayElement(['credit_card', 'bank_transfer', 'e-wallet', 'crypto']),
        provider: faker.company.name(),
        iconName: faker.helpers.arrayElement(['CreditCard', 'Bank', 'Wallet', 'Bitcoin']),
        status: faker.helpers.arrayElement(['ativo', 'inativo', 'em_configuracao']),
        fees: {
            percentage: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
            fixed: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
        },
        countriesAvailable: [faker.location.countryCode()],
        currenciesAccepted: [faker.finance.currencyCode()],
        isOnline: faker.datatype.boolean(),
        isInstant: faker.datatype.boolean(),
        requiresSetup: faker.datatype.boolean(),
        priority: faker.number.int({ min: 1, max: 100 }),
        isDefault: false,
        isTestMode: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        ...overrides,
    };
};
export const createManySystemPaymentMethods = (count) => {
    return Array.from({ length: count }, () => createSystemPaymentMethod());
};
//# sourceMappingURL=payment.factory.js.map