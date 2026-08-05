import { DM_Sans, Fraunces, Source_Serif_4, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" />
      </head>
      <body className={`${dmSans.variable} ${fraunces.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} font-sans`}>
        <Providers>
          <AppLayout>
            {children}
          </AppLayout>
          <ChunkLoadErrorHandler />
        </Providers>
      </body>
    </html>
  );
}
