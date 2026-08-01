import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: string;
      // Add custom fields here
    } & DefaultSession['user']; // includes name, email, image
    // Setado pelo callback `session` quando o usuário do token não existe mais
    // no banco (conta deletada). Ver lib/auth.ts.
    error?: 'UserNotFound';
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
    // Mirror any fields added to Session['user'] above
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: string;
  }
}
