import React from 'react';
let registeredLinkComponent = null;
export const registerLinkComponent = (component) => {
    registeredLinkComponent = component;
};
export const getRegisteredLinkComponent = () => registeredLinkComponent;
//# sourceMappingURL=LinkRegistry.js.map