---
name: verificacao-local
description: "Use ao verificar comportamento real da UI no navegador com Playwright, ou ao precisar de sessão autenticada local no PrepEnem. Evita redescobrir o formato do cookie/JWT do NextAuth — isso custou ~8 chamadas de ferramenta uma vez."
---

# Verificação local no navegador — PrepEnem

Ler código não prova comportamento. Duas vezes neste projeto o diagnóstico
"óbvio" pelo código estava errado e só o navegador mostrou a verdade (o flip
do flashcard sob reduced-motion; o dashboard "mostrando 0%" que na verdade
renderizava certo). Mas autenticar custa caro se for redescoberto — este
documento existe para isso não acontecer de novo.

## Subir o dev server

```bash
nohup npm run dev > /tmp/.../scratchpad/dev-server.log 2>&1 &
disown
sleep 8 && tail -5 /tmp/.../scratchpad/dev-server.log
```

Sempre em background com log em arquivo. Ao terminar:
`kill $(lsof -t -i:3000)`.

### Antes de acreditar em qualquer medição: um servidor só

Três sintomas custaram uma hora numa sessão e todos tinham a mesma causa —
**servidores de dev órfãos acumulados**. Página renderizando em branco, rota
respondendo 404 sem compilar, `_next/static/chunks/main-app.js` em 404.

`lsof -t -i:3000` **mente** aqui: ele não enxergou os processos. Use `ss`:

```bash
ss -ltnp | grep -E ':300[0-9]'      # mostra PID real de cada porta
kill -9 <pids>
```

O que gera os órfãos: cada `npm run dev` que acha a porta ocupada sobe na
seguinte (3001, 3002...) e o log diz `⚠ Port 3000 is in use`. **Sempre
confira a linha `- Local:` do log** — se não for `:3000`, você está medindo
um servidor e testando outro.

Duas regras que evitam tudo isso:

1. **Nunca rode `npm run build` com o dev server no ar.** O build sobrescreve
   `.next/` e o dev passa a servir chunks que não existem mais. Pare o dev,
   rode o build, suba o dev de novo.
2. **Rota nova criada com o dev já rodando pode ficar 404 pra sempre** — o
   watcher não a registra. Resolve com `touch app/<rota>/page.tsx`. E **um
   `touch` em lote (`find ... -exec touch {} +`) não funciona**: o watcher
   debounce e ignora. Toque um arquivo por vez, com pausa.

## Sessão autenticada — sem tocar na senha de ninguém

Não tente fazer login pela tela nem peça a senha ao usuário. Gere um JWT
válido direto, com o mesmo segredo que o app usa:

```js
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());
const { PrismaClient } = require('@prisma/client');
const { encode } = require('next-auth/jwt');
const prisma = new PrismaClient();
const user = await prisma.user.findUnique({ where: { username: 'pablo123' } });
const token = await encode({
  token: {
    name: user.name, email: user.email ?? user.username, sub: user.id,
    id: user.id, role: user.role, themeColor: user.themeColor,
    lastValidated: Date.now(),          // senão o callback jwt revalida na hora
  },
  secret: process.env.NEXTAUTH_SECRET,
  maxAge: 86400,                        // NÃO use 3600 — expira no meio da sessão
});
```

### As duas pegadinhas que custaram tempo

1. **Nome do cookie.** `NEXTAUTH_URL` deste projeto é `https://...`, então o
   NextAuth espera o prefixo seguro. Usar `next-auth.session-token` retorna
   `{"error":"Não autenticado"}` sem explicar nada. O certo:

   ```js
   await context.addCookies([{
     name: '__Secure-next-auth.session-token',   // com o prefixo!
     value: token, domain: 'localhost', path: '/',
     httpOnly: true, secure: true, sameSite: 'Lax',
   }]);
   ```

2. **`maxAge` curto expira no meio do trabalho.** O sintoma é `JWTExpired`
   no log do dev server e a página voltando a renderizar deslogada — parece
   bug da aplicação e não é. Use 86400.

Grave o token num arquivo do scratchpad e **apague ao terminar** — não deixe
credencial de sessão sobrando no disco.

## Playwright

Já está em `node_modules` (não precisa instalar). Rode via `node -e`.

### Simular estados sem mexer no banco

Para testar estado vazio, conta nova, ou qualquer cenário que não existe nos
dados reais, intercepte a resposta da API em vez de escrever no Neon
(lembre: [[prisma-neon-safety]] — o Neon é o mesmo banco de produção):

```js
await page.route('**/api/stats', async (route) => {
  const res = await route.fetch();
  const body = await res.json();
  body.dominadas = []; body.reforcar = [];    // força o estado vazio
  await route.fulfill({ response: res, json: body });
});
```

### Conteúdo que nasce invisível é bug, não teste mal feito

Até 05/10/2026 o dashboard usava `.gsap-reveal` (opacity 0 no CSS, revelado
pelo ScrollTrigger). No navegador do Pablo o efeito rodava antes de os dados
chegarem e o cartão "Estudo Atual", com o botão Iniciar Treino, ficava
invisível para sempre: o "buraco" que ele viu. No headless a corrida caía
para o outro lado e o cartão aparecia. Foi removido. Se algo some só no
navegador dele, procure `opacity: 0` à espera de animação antes de qualquer
outra causa.

### Playwright

Está em `devDependencies` desde 05/10/2026 (antes estava instalado solto e o
`npm install` o removeu). Se reclamar de "Executable doesn't exist", rode
`npx playwright install chromium-headless-shell`. Para não gravar nada na
conta durante o teste, intercepte o POST com `page.route(...).fulfill(...)`.

### Medir em vários instantes revela corrida

Snapshots em `t=200ms / 700ms / 1700ms` mostram o valor subindo conforme os
dados chegam (`[] → 4 → 18`). Um snapshot único no instante errado vira
diagnóstico falso de "mostra 0".

## Regra que veio disso tudo

Antes de afirmar que um bug existe ou foi corrigido, reproduza no navegador.
E se não reproduzir localmente, considere que produção pode estar rodando
código anterior ao último push antes de sair caçando causa no código atual.
Ver [[decisoes-prepenem]] (validar em produção depois do push).
