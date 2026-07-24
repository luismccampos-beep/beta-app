"use client";

import { ThemeProvider } from "./ThemeProvider";
import { QueryProvider } from "../../lib/query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <QueryProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryProvider>
  );
}
