import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Edge-compatible auth() export for middleware and Edge Runtime.
 * Uses JWT strategy only — no PrismaAdapter, no bcryptjs, no database imports.
 * Use this in middleware.ts and any Edge Runtime routes.
 */
export const { auth } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  // Empty providers array required by NextAuth type — auth() only verifies JWT
  providers: [],
});
