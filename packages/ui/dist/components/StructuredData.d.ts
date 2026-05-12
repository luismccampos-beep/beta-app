import * as React from "react";
export interface StructuredDataProps {
    data: object;
}
export declare function escapeJsonForScript(jsonString: string): string;
declare const StructuredData: React.FC<StructuredDataProps>;
export { StructuredData };
export default StructuredData;
