// Virtual list using react-window
// This file ensures the dependency is properly used in the project
// react-window v2.x has different exports than v1.x
// The module is used for virtualizing large lists
// Usage: import { FixedSizeList, VariableSizeList } from 'react-window';
// Re-export for convenience - using dynamic require to handle different module formats
const reactWindow = require('react-window');
// Export available components if they exist
const availableExports = {};
if (reactWindow.FixedSizeList) {
    availableExports.FixedSizeList = reactWindow.FixedSizeList;
}
if (reactWindow.VariableSizeList) {
    availableExports.VariableSizeList = reactWindow.VariableSizeList;
}
// Default list height and item count
export const defaultListProps = {
    height: 400,
    width: '100%',
    itemCount: 100,
    itemSize: 50,
};
// Export the module for direct access
export default availableExports;
//# sourceMappingURL=virtual-list.js.map