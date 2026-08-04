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

### Animação com ScrollTrigger não revela sozinha

Elementos com `.gsap-section`/`.gsap-reveal` começam em `opacity: 0` e só
revelam quando o scroll cruza o trigger. Num teste headless a página não
rola, então medir `opacity` logo após o `goto` dá `0` e parece bug. Force o
scroll real antes de medir:

```js
await section.scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
const opacity = await section.evaluate(el =>
  getComputedStyle(el.closest('.gsap-section')).opacity);   // agora dá "1"
```

### Medir em vários instantes revela corrida

Snapshots em `t=200ms / 700ms / 1700ms` mostram o valor subindo conforme os
dados chegam (`[] → 4 → 18`). Um snapshot único no instante errado vira
diagnóstico falso de "mostra 0".

## Regra que veio disso tudo

Antes de afirmar que um bug existe ou foi corrigido, reproduza no navegador.
E se não reproduzir localmente, considere que produção pode estar rodando
código anterior ao último push antes de sair caçando causa no código atual.
Ver [[decisoes-prepenem]] (validar em produção depois do push).
