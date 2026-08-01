import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import https from 'node:https';
import tls from 'node:tls';
import { Readable } from 'node:stream';

export const dynamic = 'force-dynamic';

// Allowlist estrita de hostnames — nunca aceitar URL arbitrária do cliente (SSRF).
// Comparação por hostname exato (new URL().hostname), não por substring.
const ALLOWED_HOSTS = ['download.inep.gov.br'];

const FETCH_TIMEOUT_MS = 20_000;

// download.inep.gov.br não envia o intermediário na cadeia TLS (bug do servidor,
// confirmado via `openssl s_client -showcerts` e `curl -v`: só manda o leaf).
// O fetch() nativo do Node (undici) valida estrito e não faz AIA chasing, então
// falha com "unable to verify the first certificate" para todo mundo que não seja
// um browser (que resolve isso via cache/AIA). Baixamos o intermediário que falta
// direto da CA Issuer URL do próprio certificado leaf (AIA extension) e validamos
// com `openssl verify` que ele fecha a cadeia até a raiz GlobalSign R46 (já confiável
// por padrão). Certificado público, sem risco de expor nada sensível ao embutir aqui.
const RNP_ICPEDU_INTERMEDIATE_CA = `-----BEGIN CERTIFICATE-----
MIIGnjCCBIagAwIBAgIRAISsNxNp8rOJbBB1nGV+D9EwDQYJKoZIhvcNAQEMBQAw
RjELMAkGA1UEBhMCQkUxGTAXBgNVBAoTEEdsb2JhbFNpZ24gbnYtc2ExHDAaBgNV
BAMTE0dsb2JhbFNpZ24gUm9vdCBSNDYwHhcNMjUxMTE5MDMyNzU1WhcNMzAxMTE5
MDAwMDAwWjBpMQswCQYDVQQGEwJCUjExMC8GA1UEChMoUkVERSBOQUNJT05BTCBE
RSBFTlNJTk8gRSBQRVNRVUlTQSAtIFJOUDEnMCUGA1UEAxMeUk5QIElDUEVkdSBH
UjQ2IE9WIFRMUyBDQSAyMDI1MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKC
AgEAqBd4pyjCSQPAFcGq8km8PmRE/BoAJdPvYWKz6gr6x4sXfY40iCWxWLgZkGuN
+OwfXRmCXC1hIb2/WWf8Nl92SSfTb/J0D7KVSksnTrXtxyxXSaEnlKEVKltoTVSC
yEop+pZf6SwuK0l66xvmM9dt/xGgngIvpeaxIIMAAgNDp52PlSrJh5IKzD/FJ4s0
Rq9Aiz3bXLYXCMCa+8WSSVfxJWYgK9IdrTAsu1T24c+xj9TvMcbUgzTDZLhvsRwj
FcY332r9XszFkDqZxCSnjb/ztYa5jFrNGGHlmygMUmBCHGqcsqet/trLKjtaGoqO
JwD0Kk/FAsqF4aGUH7hwIwRuD6ce4BjmPbv870jGdhlRyaMITLbP1YwPDOuoRkrI
utjL30dyHZWiJq1WuYbcgWODH8QwF5BUyxdHpGsv/QL2GXn/Z+GFgdO+4dBnGz7S
AokPYKmMQwKdyn3hzNgShDSFq0sj+vhT3fAXSlth1xjCvdDz+ttccinn71FV5Ahu
S4n9gw8RmSlJoYhr1pzn4Aryi6+31gJVPA8UyTfVh9MbBi7BqPmMnYeZYj7Pr6o0
k8wsz5RA+HL5AbS1QouWcFFe4LEKWqXh67xFONVfi1bO/Y31mDU3fhSzW8tx6bkm
s7N2YunWsPgrOGTcBKbrQTseAShEamJoenImGL4fbP8zZF8CAwEAAaOCAWIwggFe
MA4GA1UdDwEB/wQEAwIBhjATBgNVHSUEDDAKBggrBgEFBQcDATASBgNVHRMBAf8E
CDAGAQH/AgEAMB0GA1UdDgQWBBSUsMlPweBs787GK2yztMsiinZJtzAfBgNVHSME
GDAWgBQDXKtzgYeozLCm1ZTiNpZJ/wWZLDB7BggrBgEFBQcBAQRvMG0wLgYIKwYB
BQUHMAGGImh0dHA6Ly9vY3NwLmdsb2JhbHNpZ24uY29tL3Jvb3RyNDYwOwYIKwYB
BQUHMAKGL2h0dHA6Ly9zZWN1cmUuZ2xvYmFsc2lnbi5jb20vY2FjZXJ0L3Jvb3Ry
NDYuY3J0MDYGA1UdHwQvMC0wK6ApoCeGJWh0dHA6Ly9jcmwuZ2xvYmFsc2lnbi5j
b20vcm9vdHI0Ni5jcmwwLgYDVR0gBCcwJTAIBgZngQwBAgIwDAYKKwYBBAGgMgoB
AjALBgkrBgEEAaAyARQwDQYJKoZIhvcNAQEMBQADggIBABAGOWuTA3iFMqABnBPR
rb1YNwcRqQE1Tvz+9f7a0YUWk+wNH3yPVAqd3i9abWtRT6nNBpu49XNAqWSebXpR
9J5Im5NJruhYxqtd5c6Y04GdoS/JSh6HmJxiBS2Tv5E+Z9yqkBgt41VhxszYEbus
qL/56foMry+EWvXRJ0nA9P0GxdFmbTD4DkLFq++E15FBeRf7uRGUe46bZN345OQ7
jhN2eZwpHzIwTrfaPwHxkFThXU8KPgClmq77JJ/NzlAAPEjpr+TF6K17lzBZS1o1
Lrk+EFDOGVGc0Ncad7JcFldwmLd0C9B73jq0t5opQcl/u1wdIanosZ418vCJp25K
QW1BCDCHenf+6mA2VptyuywHcDqM75rSGi5wxbE4IxkMxrl89HsQKfRSJbDT/0v5
gGlMw/UaCMP6O/4nwHrmXQJ2CVS7M4ucbUbm+ZSqOWgkDCTVvXyyIzWFpWxMk7UH
XBTei1qG19/PbShKTgYcgod0ReTr4osyARZ5T7jZqe8UKW1DUXcVasukATKryagk
NRRjRmM9YasyVMO3SVhTFp49aqAe173TKd2yatDmxlvB9s5fZ5pz5ptdyQFTyv+N
yLDZd5PHiO/JWBFL3g2XVFgKmDVlKsBkqLs/NR18/RWv0d7YKTVVfhc64gdXQAMt
Lyso4S/KfU1hV0inHITEfil4
-----END CERTIFICATE-----`;

const trustedCa = [...tls.rootCertificates, RNP_ICPEDU_INTERMEDIATE_CA];

interface UpstreamResponse {
  statusCode: number;
  stream: Readable;
}

function fetchUpstream(url: URL, signal: AbortSignal): Promise<UpstreamResponse> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      { ca: trustedCa, signal },
      (res) => {
        if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
          res.resume(); // descarta o corpo, evita socket pendurado
          reject(new Error(`Fonte retornou ${res.statusCode}`));
          return;
        }
        resolve({ statusCode: res.statusCode, stream: res });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

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

    if (parsedUrl.protocol !== 'https:' || !ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
      return NextResponse.json({ error: 'URL não permitida' }, { status: 403 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let upstream: UpstreamResponse;
    try {
      upstream = await fetchUpstream(parsedUrl, controller.signal);
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
