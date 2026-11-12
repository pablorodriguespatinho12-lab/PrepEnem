import { DM_Sans, Fraunces, Source_Serif_4, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import './globals.css';
import { Providers } from '@/components/providers';
import { FocoTeclado } from '@/components/foco-teclado';
import { AppLayout } from '@/components/app-layout';
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler';

/* Três famílias, três papéis — pareamento editorial.
   Fraunces (display): serifa variável de alto contraste, com personalidade.
     Só em título. É a voz da marca.
   Source Serif 4 (leitura): desenhada para leitura em tela, altura-x grande,
     itálico de verdade — importante porque enunciado de ENEM traz trecho
     literário citado. É onde o olho passa as horas.
   DM Sans (chrome): rótulo, botão, metadado. Serifa em 13px de interface
     lê datado; o sans separa "interface" de "conteúdo" sem precisar de caixa.
   JetBrains Mono permanece para código e dado tabular. */
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-reading', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });
/* Jersey 10 (pixel): só no mundo pixel (número grande, letra da alternativa, placa).
   Arquivo local porque o Next 14 não tem ela na lista do Google. A Pixelify Sans
   foi descartada: o "C" dela parece "O" ("Oafé", 12/11/2026). */
const jersey = localFont({ src: '../public/fonts/jersey-10-latin.woff2', variable: '--font-pixel', display: 'swap' });
/* Jersey 15 (texto em pixel, 12/11/2026: "até as letras e as palavras").
   Testada contra Pixelify Sans (o "C" vira "O" e o "5" vira "8" em negrito),
   Tiny5, VT323 e Silkscreen. Desenho pequeno: size-adjust de 125% para ler
   como o corpo de antes. Liga/desliga em Perfil > "Letras em pixel". */
const jerseyTexto = localFont({
  src: '../public/fonts/jersey-15-latin.woff2',
  variable: '--font-pixel-texto',
  display: 'swap',
  declarations: [{ prop: 'size-adjust', value: '125%' }],
});

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return {
    metadataBase: new URL(baseUrl),
    title: 'PrepEnem \u2014 Plataforma de Estudos para o ENEM',
    description: 'Estude para o ENEM com revis\u00e3o espa\u00e7ada, treino di\u00e1rio e acompanhamento inteligente do seu progresso.',
    icons: {
      icon: '/favicon.svg',
      shortcut: '/favicon.svg',
    },
    openGraph: {
      title: 'PrepEnem \u2014 Plataforma de Estudos para o ENEM',
      description: 'Estude para o ENEM com revis\u00e3o espa\u00e7ada, treino di\u00e1rio e acompanhamento inteligente do seu progresso.',
      images: ['/og-image.png'],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning data-letra-pixel="">
      <body className={`${dmSans.variable} ${fraunces.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} ${jersey.variable} ${jerseyTexto.variable} font-sans`}>
        <Providers nonce={headers().get('x-nonce') ?? undefined}>
          <AppLayout>
            {children}
          </AppLayout>
          <ChunkLoadErrorHandler />
          <FocoTeclado />
        </Providers>
      </body>
    </html>
  );
}
