/* Ambiente isolado da bateria: banco inexistente, sem chaves de IA ou de
   armazenamento. Variável já definida vence o arquivo de ambiente do Next. */
export const PORTA = 3123;

export const AMBIENTE = {
  DATABASE_URL: 'postgresql://qa:qa@127.0.0.1:1/qa?connect_timeout=2',
  NEXTAUTH_SECRET: 'segredo-so-de-teste',
  NEXTAUTH_URL: `http://localhost:${PORTA}`,
  ALLOWED_USERS: '',
  GROQ_API_KEY: '', GEMINI_API_KEY: '', MISTRAL_API_KEY: '', ABACUSAI_API_KEY: '',
  AWS_ACCESS_KEY_ID: '', AWS_SECRET_ACCESS_KEY: '', AWS_BUCKET_NAME: '',
};
