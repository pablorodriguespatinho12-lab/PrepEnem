import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Intervalo mínimo entre revalidações do usuário contra o banco no callback
// jwt. Evita bater no Neon (serverless, cobra compute por conexão) a cada
// request — só paga o custo de detectar uma conta deletada com esse atraso.
const SESSION_REVALIDATE_INTERVAL_MS = 60_000;

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
        // Login inicial: popula o token e marca como validado agora.
        token.id = user.id;
        token.role = user.role;
        token.themeColor = user.themeColor;
        token.lastValidated = Date.now();
        delete token.error;
        return token;
      }
      if (trigger === 'update' && session) {
        token.themeColor = session.themeColor ?? token.themeColor;
        token.name = session.name ?? token.name;
      }

      // Revalida contra o banco periodicamente (não a cada request — Neon é
      // serverless e cobra compute por conexão). Se o usuário do token não
      // existir mais (conta deletada por reset admin ou, no futuro,
      // auto-exclusão), marca o token como órfão; o callback `session` usa
      // isso pra derrubar a sessão em vez de deixá-la "zumbi".
      const needsRevalidation =
        !token.lastValidated || Date.now() - token.lastValidated > SESSION_REVALIDATE_INTERVAL_MS;
      if (needsRevalidation) {
        const stillExists = await prisma.user.findUnique({
          where: { id: token.id },
          select: { id: true },
        });
        if (!stillExists) {
          token.error = 'UserNotFound';
        } else {
          delete token.error;
        }
        token.lastValidated = Date.now();
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token?.error === 'UserNotFound') {
        // Usuário sumiu do banco: não propaga session.user. Todas as rotas já
        // fazem `if (!session?.user) return 401`, então isso as unifica sem
        // precisar tocar rota por rota.
        return { ...session, user: undefined, error: token.error };
      }
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
