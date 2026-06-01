import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Usuário', type: 'text' },
        email: { label: 'Email', type: 'text' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const loginId = credentials?.username || credentials?.email || '';
        if (!loginId || !credentials?.password) return null;
        try {
          // Try username first, then email fallback
          let user = await prisma.user.findUnique({
            where: { username: loginId },
          });
          if (!user) {
            user = await prisma.user.findFirst({
              where: { email: loginId },
            });
          }
          if (!user) return null;
          const valid = await bcrypt.compare(credentials.password, user.password);
          if (!valid) return null;
          return {
            id: user.id,
            email: user.email ?? user.username,
            name: user.name,
            role: user.role,
            themeColor: user.themeColor,
          } as any;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.themeColor = user.themeColor;
      }
      if (trigger === 'update' && session) {
        token.themeColor = session.themeColor ?? token.themeColor;
        token.name = session.name ?? token.name;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.themeColor = token.themeColor;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
