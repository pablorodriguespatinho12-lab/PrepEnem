import { redirect } from 'next/navigation';

// Cadastro público desabilitado (site de uso pessoal, ver ALLOWED_USERS em
// lib/auth.ts). Rota mantida só pra não deixar link morto/404 em quem tinha
// a URL salva — redireciona pro login.
export default function SignupPage() {
  redirect('/login');
}
