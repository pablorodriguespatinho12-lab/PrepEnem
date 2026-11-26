---
name: cume-lote-de-questao-real
description: Jeito que passou na conferência ao escrever questão real de ITA/Fuvest no molde do robô (arquivo fora do repositório)
metadata:
  type: feedback
---

- Ler a página do PDF renderizada com PyMuPDF (`python3 -P`, script fora da pasta do PDF); o Read de PDF falha sem pdftoppm e `python3 -I` não enxerga o PyMuPDF.
  **Why:** o .txt perde expoente e raiz; a resolução comentada também pode trazer "SEM RESPOSTA" (questão a descartar).
- Conta no `texto` do passo: uma por linha, até 12 termos; linha maior some da lousa sem aviso. Listar o texto de cada tela de `lousaDoRobo`, além de rodar `scripts/conferir-lousa-de-arquivo.ts`.
  **How to apply:** quebrar a conta em partes nomeadas; número novo aparece antes do lado direito de uma conta.
- Conferir gabarito por força bruta em Python puro (sem sympy); em domínio de função, usar folga 1e-6 para o ponto proibido.

Relacionado ao repositório público: enunciado e resolução de prova real não entram nesta memória.
