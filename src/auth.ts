import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import { authConfig } from "./auth.config";
import { authProviders } from "./auth.providers";

/**
 * Full auth instance for API routes and server components.
 * Includes PrismaAdapter, Credentials provider, and all auth features.
 * Do NOT import this in middleware or Edge Runtime — use @/auth-edge instead.
 */
const isBuild = process.env.NEXT_PHASE === 'build';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...(isBuild ? {} : { adapter: PrismaAdapter(prisma) }),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: authProviders,
});
