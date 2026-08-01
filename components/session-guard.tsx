'use client';
import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

// A sessão JWT sobrevive à conta ser deletada do banco (ver lib/auth.ts).
// Quando o callback `session` detecta isso, marca `session.error`; este
// componente derruba a sessão no cliente em vez de deixar a UI num estado
// ambíguo de "logado mas sem dado nenhum".
export function SessionGuard() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === 'UserNotFound') {
      signOut({ callbackUrl: '/login' });
    }
  }, [session]);

  return null;
}
