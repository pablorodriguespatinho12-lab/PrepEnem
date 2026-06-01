import { DM_Sans, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { AppLayout } from '@/components/app-layout';
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });
const jakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

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
      <body className={`${dmSans.variable} ${jakartaSans.variable} ${jetbrainsMono.variable} font-sans`}>
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
