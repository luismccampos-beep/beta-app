import * as React from "react";

export interface StructuredDataProps {
  data: object;
}

export function escapeJsonForScript(jsonString: string): string {
  return jsonString
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/<\/script/gi, "<\\/script");
}

const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  const jsonString = React.useMemo(() => {
    const isProduction =
      typeof (globalThis as { process?: { env?: { NODE_ENV?: string } } })
        .process !== "undefined"
        ? (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process
            ?.env?.NODE_ENV === "production"
        : ((import.meta as { env?: { PROD?: boolean } }).env?.PROD ?? false);

    return JSON.stringify(data, null, isProduction ? 0 : 2);
  }, [data]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: escapeJsonForScript(jsonString),
      }}
    />
  );
};

export { StructuredData };
export default StructuredData;
