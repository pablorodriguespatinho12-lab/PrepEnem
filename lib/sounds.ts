import { getSoundEnabled } from '@/lib/use-sound-preference';

export type SoundKey = 'acerto' | 'erro' | 'cardSalvo' | 'sessaoConcluida';

// Arquivos ficam em public/sounds/ — curtos, volume baixo, sem nada áspero
// (uso em sessão longa de estudo). Royalty-free (Pixabay/Uppbeat).
const SOUND_FILES: Record<SoundKey, string> = {
  acerto: '/sounds/acerto.mp3',
  erro: '/sounds/erro.mp3',
  cardSalvo: '/sounds/card-salvo.mp3',
  sessaoConcluida: '/sounds/sessao-concluida.mp3',
};

const VOLUME = 0.35;

// Cache de instância por som — evita recriar o Howl (e re-decodificar o
// arquivo) a cada play().
const cache = new Map<SoundKey, import('howler').Howl>();

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Toca um som curto se o usuário tiver som ligado e não pedir menos
 * estímulo (prefers-reduced-motion). Nunca lança — som é sempre um canal
 * extra, nunca pode quebrar o app nem travar um fluxo (ex.: salvar um
 * card) por causa de um arquivo de áudio ausente ou corrompido.
 */
export async function playSound(key: SoundKey): Promise<void> {
  try {
    if (typeof window === 'undefined') return;
    if (!getSoundEnabled()) return;
    if (prefersReducedMotion()) return;

    let howl = cache.get(key);
    if (!howl) {
      const { Howl } = await import('howler');
      howl = new Howl({
        src: [SOUND_FILES[key]],
        volume: VOLUME,
        preload: true,
        onloaderror: () => {
          // Arquivo ausente/corrompido — som é só um canal extra, nunca
          // deve quebrar o fluxo que o disparou.
        },
        onplayerror: (_id, _err) => {
          // Autoplay bloqueado ou falha de decodificação em mobile — idem.
        },
      });
      cache.set(key, howl);
    }
    howl.play();
  } catch {
    // play() nunca deve derrubar quem chamou.
  }
}
