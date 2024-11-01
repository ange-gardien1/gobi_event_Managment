import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import type { DefaultSession } from "next-auth";
import { db } from "./app/db";
import { accounts, sessions, users, verificationTokens } from "./app/db/schema";

declare module "next-auth" {
  interface Session {
    user: {
      roleId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    roleId?: string | null;
  }
}

const providers: Provider[] = [
  google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),

  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user.roleId = user.roleId;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.roleId = user.roleId;
      }
      return token;
    },
  },
});
