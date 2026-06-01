import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { createS3Client, getBucketConfig } from '@/lib/aws-config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const url = request.nextUrl.searchParams.get('url');
    if (!url) {
      return NextResponse.json({ error: 'URL não fornecida' }, { status: 400 });
    }

    // Only allow S3 URLs for security
    if (!url.includes('.s3.') && !url.includes('s3.amazonaws.com')) {
      return NextResponse.json({ error: 'URL não permitida' }, { status: 403 });
    }

    // Extract bucket and key from S3 URL
    const { bucketName } = getBucketConfig();
    let key = '';
    
    // Parse S3 URL formats:
    // https://bucket.s3.region.amazonaws.com/key
    // https://s3.region.amazonaws.com/bucket/key
    try {
      const urlObj = new URL(url);
      const host = urlObj.hostname;
      if (host.startsWith(bucketName)) {
        // Format: bucket.s3.region.amazonaws.com/key
        key = urlObj.pathname.slice(1); // Remove leading /
      } else {
        // Format: s3.region.amazonaws.com/bucket/key
        const pathParts = urlObj.pathname.slice(1).split('/');
        pathParts.shift(); // Remove bucket name
        key = pathParts.join('/');
      }
    } catch {
      return NextResponse.json({ error: 'URL inválida' }, { status: 400 });
    }

    if (!key) {
      return NextResponse.json({ error: 'Chave S3 não encontrada' }, { status: 400 });
    }

    const s3 = createS3Client();
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await s3.send(command);
    const bodyStream = response.Body;
    
    if (!bodyStream) {
      return NextResponse.json({ error: 'PDF não encontrado' }, { status: 404 });
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    // @ts-ignore - Body is a Readable stream
    for await (const chunk of bodyStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error: any) {
    console.error('PDF proxy error:', error?.message || error);
    return NextResponse.json({ error: 'Erro ao buscar PDF' }, { status: 500 });
  }
}
