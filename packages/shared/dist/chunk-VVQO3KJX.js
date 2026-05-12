import {
  f
} from "./chunk-QUALQIBR.js";

// src/factories/payment.factory.ts
var createSystemPaymentMethod = (overrides = {}) => {
  return {
    id: f.string.uuid(),
    name: f.finance.transactionType(),
    description: f.lorem.sentence(),
    type: f.helpers.arrayElement(["credit_card", "bank_transfer", "e-wallet", "crypto"]),
    provider: f.company.name(),
    iconName: f.helpers.arrayElement(["CreditCard", "Bank", "Wallet", "Bitcoin"]),
    status: f.helpers.arrayElement(["ativo", "inativo", "em_configuracao"]),
    fees: {
      percentage: f.number.float({ min: 0, max: 5, fractionDigits: 2 }),
      fixed: f.number.float({ min: 0, max: 1, fractionDigits: 2 })
    },
    countriesAvailable: [f.location.countryCode()],
    currenciesAccepted: [f.finance.currencyCode()],
    isOnline: f.datatype.boolean(),
    isInstant: f.datatype.boolean(),
    requiresSetup: f.datatype.boolean(),
    priority: f.number.int({ min: 1, max: 100 }),
    isDefault: false,
    isTestMode: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
    ...overrides
  };
};
var createManySystemPaymentMethods = (count) => {
  return Array.from({ length: count }, () => createSystemPaymentMethod());
};

export {
  createSystemPaymentMethod,
  createManySystemPaymentMethods
};
//# sourceMappingURL=chunk-VVQO3KJX.js.map