import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authOptions: NextAuthConfig = {
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const email = creds?.email?.toString().toLowerCase();
        const password = creds?.password?.toString() ?? '';
        if (!email || !password) return null;

        const user = await prisma.member.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        };
      },
    }),
  ],
};

// ⬇️ v5: expose a single NextAuth instance with helpers
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
