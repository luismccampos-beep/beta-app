import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
export function escapeJsonForScript(jsonString) {
    return jsonString
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/<\/script/gi, "<\\/script");
}
const StructuredData = ({ data }) => {
    const jsonString = React.useMemo(() => {
        const isProduction = typeof globalThis
            .process !== "undefined"
            ? globalThis.process
                ?.env?.NODE_ENV === "production"
            : (import.meta.env?.PROD ?? false);
        return JSON.stringify(data, null, isProduction ? 0 : 2);
    }, [data]);
    return (_jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
            __html: escapeJsonForScript(jsonString),
        } }));
};
export { StructuredData };
export default StructuredData;
//# sourceMappingURL=StructuredData.js.map