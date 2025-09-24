import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const email = creds?.email?.toString().toLowerCase();
        const password = creds?.password?.toString() ?? "";
        if (!email || !password) return null;

        const user = await prisma.members.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
        };
      },
    }),
  ],
};

// ⬇️ v5: expose a single NextAuth instance with helpers
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);