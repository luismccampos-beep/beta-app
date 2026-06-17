import Credentials from "next-auth/providers/credentials";
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
];
