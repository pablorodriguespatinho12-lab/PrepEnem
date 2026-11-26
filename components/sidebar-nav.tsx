'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Settings, ShieldCheck, LogOut, Library, Moon, Sun, Sigma, BarChart3, Compass } from 'lucide-react';

/* Menu da opção A (26/11/2026): trilho flutuante no computador e barra embaixo
   no celular. Ficam à vista os itens do estudo diário; o resto abre em "Mais". */
const DESENHOS = {
  inicio: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  estudar: 'M3 5h6a3 3 0 0 1 3 3v12a3 3 0 0 0-3-2H3zM21 5h-6a3 3 0 0 0-3 3v12a3 3 0 0 1 3-2h6z',
  cartoes: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  redacao: 'M4 20l4-1L20 7l-3-3L5 16zM14 7l3 3',
  calculo: 'M17 5H7l6 7-6 7h10',
  progresso: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  mais: 'M5 12h.01M12 12h.01M19 12h.01',
} as const;

type ItemNav = { href: string; label: string; desenho: keyof typeof DESENHOS; tambem?: string[]; soNoTrilho?: boolean };

const principais: ItemNav[] = [
  { href: '/dashboard', label: 'Início', desenho: 'inicio' },
  // Treino = Provas (Pablo, 02/11/2026). O treino do dia segue pelo "Começar" do Início.
  { href: '/provas', label: 'Estudar', desenho: 'estudar', tambem: ['/treino', '/simulado', '/caderno-erros'] },
  { href: '/flashcards', label: 'Cartões', desenho: 'cartoes' },
  { href: '/redacao', label: 'Redação', desenho: 'redacao' },
  { href: '/calculo', label: 'Cálculo', desenho: 'calculo', soNoTrilho: true },
  { href: '/progresso', label: 'Progresso', desenho: 'progresso', soNoTrilho: true },
];
const secundarios = [
  // Aulas no jeito do Universo Narrado: de onde vem a equação (Pablo, 17/11/2026).
  { href: '/descobrir', label: 'Descobrir', Icone: Compass },
  { href: '/banco-questoes', label: 'Banco de Questões', Icone: Library },
  { href: '/perfil', label: 'Perfil', Icone: Settings },
];
const noCelular = [
  { href: '/calculo', label: 'Cálculo', Icone: Sigma },
  { href: '/progresso', label: 'Progresso', Icone: BarChart3 },
];

const Desenho = ({ nome }: { nome: keyof typeof DESENHOS }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={DESENHOS[nome]} /></svg>
);

export function SidebarNav() {
  const pathname = usePathname();
  const { data: session } = useSession() || {};
  const { resolvedTheme, setTheme } = useTheme();
  const [mais, setMais] = useState(false);
  const isAdmin = (session?.user as any)?.role === 'admin';
  const nome = session?.user?.name ?? 'Estudante';
  const estaEm = (href: string) => pathname === href || !!pathname?.startsWith(href + '/');
  const ativo = (item: ItemNav) => [item.href, ...(item.tambem ?? [])].some(estaEm);
  const emSecundario = secundarios.some((i) => estaEm(i.href)) || estaEm('/admin');
  const emSoNoTrilho = noCelular.some((i) => estaEm(i.href));

  useEffect(() => setMais(false), [pathname]);
  useEffect(() => {
    if (!mais) return;
    const fechar = (e: KeyboardEvent) => { if (e.key === 'Escape') setMais(false); };
    window.addEventListener('keydown', fechar);
    return () => window.removeEventListener('keydown', fechar);
  }, [mais]);

  const itens = (lista: ItemNav[]) => lista.map((item) => (
    <Link key={item.href} href={item.href} className="m-item" aria-current={ativo(item) ? 'page' : undefined}>
      <Desenho nome={item.desenho} />
      <span>{item.label}</span>
    </Link>
  ));
  const botaoMais = (marcado: boolean) => (
    <button
      type="button"
      className="m-item"
      aria-expanded={mais}
      aria-current={marcado ? 'true' : undefined}
      onClick={() => setMais((v) => !v)}
    >
      <Desenho nome="mais" />
      <span>Mais</span>
    </button>
  );
  const opcao = ({ href, label, Icone }: (typeof secundarios)[number], extra = '') => (
    <Link key={href} href={href} onClick={() => setMais(false)} className={`m-opcao ${extra}`} aria-current={estaEm(href) ? 'page' : undefined}>
      <Icone className="w-4 h-4" aria-hidden /> {label}
    </Link>
  );

  return (
    <>
      <nav data-menu-lateral aria-label="Menu" className="moderno m-trilho">
        <div className="m-logo px" aria-label="PrepEnem">PE</div>
        {itens(principais)}
        {botaoMais(emSecundario)}
        <button type="button" className="m-eu" aria-label={`Conta de ${nome}`} onClick={() => setMais((v) => !v)}>
          {nome[0]?.toUpperCase() ?? 'U'}
        </button>
      </nav>

      <nav data-menu-lateral aria-label="Menu no celular" className="moderno m-doca">
        {itens(principais.filter((i) => !i.soNoTrilho))}
        {botaoMais(emSecundario || emSoNoTrilho)}
      </nav>

      {mais && (
        <div data-menu-lateral>
          <div className="m-veu-menu" onClick={() => setMais(false)} aria-hidden />
          <div className="moderno m-mais" role="dialog" aria-label="Mais opções">
            {noCelular.map((i) => opcao(i, 'm-so-celular'))}
            {secundarios.map((i) => opcao(i))}
            {isAdmin && opcao({ href: '/admin/questoes', label: 'Admin Questões', Icone: ShieldCheck })}
            <button type="button" className="m-opcao" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" aria-hidden /> : <Moon className="w-4 h-4" aria-hidden />}
              {resolvedTheme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            </button>
            <button type="button" className="m-opcao" onClick={() => signOut({ callbackUrl: '/login' })}>
              <LogOut className="w-4 h-4" aria-hidden /> Sair ({nome})
            </button>
          </div>
        </div>
      )}
    </>
  );
}
