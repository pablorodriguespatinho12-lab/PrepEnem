import { NextResponse } from 'next/server';

// As credenciais AWS eram do bucket da Abacus (não do usuário) e o bucket já
// responde 403 — não serão reconfiguradas. Import de PDF fica indisponível
// por design (as questões existentes já vieram todas importadas e usam
// public/questoes-imagens/ + pdf-proxy do INEP, que não dependem disso).
export const S3_UNAVAILABLE_MESSAGE = 'Upload de PDF indisponível nesta instalação.';

export function isS3Configured(): boolean {
  return !!(
    process.env.AWS_BUCKET_NAME &&
    process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY
  );
}

export function s3UnavailableResponse() {
  return NextResponse.json({ error: S3_UNAVAILABLE_MESSAGE }, { status: 503 });
}
