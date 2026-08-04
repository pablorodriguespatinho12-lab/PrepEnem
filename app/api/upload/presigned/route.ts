export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generatePresignedUploadUrl } from '@/lib/s3';
import { isS3Configured, s3UnavailableResponse } from '@/lib/aws-client';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    if (!isS3Configured()) {
      return s3UnavailableResponse();
    }
    const { fileName, contentType, isPublic } = await req.json();
    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'Campos obrigatórios' }, { status: 400 });
    }
    const result = await generatePresignedUploadUrl(fileName, contentType, isPublic ?? false);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Presigned URL error:', error);
    return NextResponse.json({ error: 'Erro ao gerar URL' }, { status: 500 });
  }
}
