import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Readable } from 'node:stream';
import { fetchInepUpstream, isAllowedInepUrl, type UpstreamResponse } from '@/lib/inep-pdf-fetch';

export const dynamic = 'force-dynamic';

const FETCH_TIMEOUT_MS = 20_000;

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

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'URL inválida' }, { status: 400 });
    }

    if (!isAllowedInepUrl(parsedUrl)) {
      return NextResponse.json({ error: 'URL não permitida' }, { status: 403 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let upstream: UpstreamResponse;
    try {
      upstream = await fetchInepUpstream(parsedUrl, controller.signal);
    } catch (fetchError: any) {
      const isTimeout = fetchError?.name === 'AbortError';
      console.error('PDF proxy fetch error:', fetchError?.message || fetchError);
      return NextResponse.json(
        { error: isTimeout ? 'Tempo esgotado ao buscar o PDF' : 'Erro ao buscar PDF na fonte' },
        { status: 502 }
      );
    } finally {
      clearTimeout(timeout);
    }

    return new NextResponse(Readable.toWeb(upstream.stream) as ReadableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'public, max-age=604800, immutable',
      },
    });
  } catch (error: any) {
    console.error('PDF proxy error:', error?.message || error);
    return NextResponse.json({ error: 'Erro ao buscar PDF' }, { status: 500 });
  }
}
