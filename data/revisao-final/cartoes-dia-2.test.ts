import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { runInNewContext } from 'node:vm'
import { describe, expect, it } from 'vitest'

// A página do dia 2 (docs/revisao-final/revisao-dia-2.html) lê estes arquivos no navegador.
// O teste lê os mesmos arquivos, para o conteúdo ter uma fonte só.
const PASTA = join(process.cwd(), 'docs/revisao-final/dia-2')
const CARTOES_POR_CONTEUDO = 5
const MAX_FRENTE = 300
const MAX_VERSO = 200

interface Cartao { f: string; v: string }
interface Questao { e: string; a: string[]; g: number; r: string; o?: string }
interface Conteudo { m: string; t: string; n: number; aula: string[]; q: Questao[] }

function carregar(): { conteudos: Conteudo[]; cartoes: Record<string, Cartao[]> } {
  const janela: { DIA2?: Conteudo[]; DIA2_CARTOES?: Record<string, Cartao[]> } = {}
  for (const arquivo of ['matematica', 'biologia', 'quimica', 'fisica', 'cartoes']) {
    runInNewContext(readFileSync(join(PASTA, `${arquivo}.js`), 'utf8'), { window: janela })
  }
  return { conteudos: janela.DIA2 ?? [], cartoes: janela.DIA2_CARTOES ?? {} }
}

const { conteudos, cartoes } = carregar()

describe('revisão do dia 2: questões', () => {
  it('tem 22 conteúdos, cada um com 4 questões de 5 alternativas', () => {
    expect(conteudos).toHaveLength(22)
    for (const c of conteudos) {
      expect(c.q, c.t).toHaveLength(4)
      for (const q of c.q) {
        expect(q.a, c.t).toHaveLength(5)
        expect(new Set(q.a).size, `${c.t}: alternativa repetida`).toBe(5)
        expect(q.g).toBeGreaterThanOrEqual(0)
        expect(q.g).toBeLessThanOrEqual(4)
        expect(q.r.length, `${c.t}: sem resolução`).toBeGreaterThan(0)
      }
    }
  })

  it('só a 4ª questão é real do ENEM, e nenhuma traz marca crua de imagem', () => {
    for (const c of conteudos) {
      c.q.forEach((q, i) => {
        expect(Boolean(q.o), `${c.t} questão ${i + 1}`).toBe(i === 3)
        expect(q.e).not.toContain('[IMAGEM]')
      })
    }
  })
})

// O site serve uma cópia em public/revisao/ (cartão "Revisão do dia 2" do Treino).
// Mudou o original e esqueceu a cópia? Este teste falha. Para igualar:
//   cp docs/revisao-final/dia-2/*.js public/revisao/dia-2/
//   e remontar public/revisao/dia-2.html (cabeçalho HTML + docs/revisao-final/revisao-dia-2.html).
describe('revisão do dia 2: cópia do site', () => {
  const PUBLICA = join(process.cwd(), 'public/revisao')

  it('os dados em public/ são iguais aos de docs/', () => {
    for (const arquivo of ['matematica', 'biologia', 'quimica', 'fisica', 'cartoes']) {
      const original = readFileSync(join(PASTA, `${arquivo}.js`), 'utf8')
      const copia = readFileSync(join(PUBLICA, 'dia-2', `${arquivo}.js`), 'utf8')
      expect(copia === original, `${arquivo}.js difere`).toBe(true)
    }
  })

  it('a página em public/ contém a página de docs/ inteira', () => {
    const original = readFileSync(join(process.cwd(), 'docs/revisao-final/revisao-dia-2.html'), 'utf8')
    const copia = readFileSync(join(PUBLICA, 'dia-2.html'), 'utf8')
    expect(copia.startsWith('<!doctype html>')).toBe(true)
    expect(copia.includes(original), 'public/revisao/dia-2.html está atrás do original').toBe(true)
  })
})

describe('revisão do dia 2: cartões', () => {
  it('todo conteúdo tem 5 cartões, e não sobra cartão sem conteúdo', () => {
    const temas = conteudos.map((c) => c.t)
    expect(Object.keys(cartoes).sort()).toEqual([...temas].sort())
    for (const tema of temas) expect(cartoes[tema], tema).toHaveLength(CARTOES_POR_CONTEUDO)
  })

  it('frente e verso são curtos (um fato por cartão)', () => {
    for (const [tema, lista] of Object.entries(cartoes)) {
      for (const cartao of lista) {
        expect(cartao.f.length, `${tema}: frente vazia`).toBeGreaterThan(0)
        expect(cartao.f.length, `${tema}: "${cartao.f}"`).toBeLessThanOrEqual(MAX_FRENTE)
        expect(cartao.v.length, `${tema}: "${cartao.f}"`).toBeGreaterThan(0)
        expect(cartao.v.length, `${tema}: "${cartao.f}"`).toBeLessThanOrEqual(MAX_VERSO)
      }
    }
  })

  it('nenhuma frente se repete', () => {
    const frentes = Object.values(cartoes).flat().map((c) => c.f)
    expect(new Set(frentes).size).toBe(frentes.length)
  })
})
