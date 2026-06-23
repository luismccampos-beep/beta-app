import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";
import type { NextAuthConfig } from "next-auth";

export const authProviders: NextAuthConfig["providers"] = [
  Credentials({
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const email = (credentials.email as string).toLowerCase();
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.password) return null;

      const passwordsMatch = await bcrypt.compare(
        credentials.password as string,
        user.password
      );

      if (passwordsMatch) return user;
      
      return null;
    },
  }),
  Google({
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,
  }),
  Facebook({
    clientId: process.env.AUTH_FACEBOOK_ID!,
    clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
  }),
];
