---
name: transcrever-universo-narrado
description: "Transformar vídeo longo do Universo Narrado (ou qualquer aula do YouTube) em transcrição, resumo de COMO ele ensina e fotos do quadro, sem deixar erro de legenda chegar ao site. Usar quando o Pablo mandar vídeo do canal, ao comparar o jeito deles com as aulas do PrepEnem, e antes de copiar número, fórmula ou frase de uma legenda para aula ou questão."
---

# Transcrever o Universo Narrado

Feito em 20/11/2026 (13 + 16 lotes, 9 vídeos, 129 pedaços de capítulo). Cada passo abaixo existe porque algo
falhou ou quase falhou naquele dia.

## Receita (scripts em `scripts/`, saída em `docs/universo-narrado/`)
1. `baixar-legendas.py ID...` (yt-dlp está em `~/.local/bin`; ffmpeg em `/usr/bin`). Legenda
   automática pt, sem baixar o vídeo. Whisper local não serve: 4 CPU, sem GPU, 40 h de áudio.
2. `cortar-novos.py` (capítulos; sem capítulo = janelas de 40 min) e lotes de ~30 mil palavras.
3. Resumir com agentes **Haiku**, levas de 4 em segundo plano (mais que 4 arrisca 429),
   instruções em `RESUMIR.md`. Comparar com o site: 1 agente **Sonnet**.
4. `tirar-quadros.py LOTE...`: foto por horário, direto da transmissão (`ffmpeg -ss` na URL).

## Medidas preventivas (cada uma vem de um aviso real)
- **Legenda erra** (número, unidade, sinal, nome). Nada numérico vai ao site só porque está
  na legenda: conferir na **foto do quadro** ou refazendo a conta, e passar pelo
  `revisor-de-fatos`. Dois casos vistos: chuveiro 600 × 300 Ω; 1 cal = 4 ou 4,2 J.
- **Agente que "leu" pode ter só olhado o começo.** Pedir sempre uma tabela de cobertura
  (capítulo → li inteiro / só o gancho). Em 20/11 o comparador só abriu D, E, F pelo gancho e
  marcou "?". Capítulo "só gancho" volta para um 2º agente antes de virar decisão.
- **Contagem zero é alarme.** Todo script imprime quantos itens achou; 0 = parar. (A 1ª
  busca de horários de quadro deu 0 e eu só notei lendo a amostra.)
- **Foto do vídeo certo.** Cada horário de quadro guarda o vídeo da SUA seção (lote com vários
  vídeos). Eu guardei só o da última seção e 35 fotos saíram do vídeo errado; achei pelo nome
  do arquivo. Conferir: o id no nome da foto bate com o prefixo (`fuv`, `sim`, `tri`, `cin`).
- **Formato do resumo muda por agente** (`7. **Quadro**` x `**7. Quadro**`): o script de
  fotos acha os itens por nome e avisa no fim "ATENÇÃO: lotes com 0 horários".
- **Número no texto vem de comando**, não de cabeça (ver `licoes.md`).
- **Criar o arquivo de instruções ANTES de chamar o agente que o lê** (disparei na ordem errada).
- **Comando comprido com `$(...)` e laço o guarda de segurança não lê**: escrever um script
  em arquivo (Write) e rodar o script.
- **Horário é `h:mm:ss`**, não `mm:ss`: `2:15:00` = 2 h 15 min. Capítulo de 28 h só se acha assim.
- **Dado bruto fora do git** (`bruto/` 44 MB+): só texto, resumos e fotos entram no commit.
- **Citação literal**: se não está certa, marcar "?". Frase do canal não vira texto do aluno
  sem o Pablo ver (regra `texto-do-aluno-so-com-o-que-ele-sabe`).
- **Ler foto custa token**: ver folha de contato (12 fotos numa imagem), não foto a foto.

## O que o Pablo pediu para imitar (visual, não leitura)
Quadro-branco com canetas coloridas, um fator por cor, caixa amarela na fórmula-chave,
tabela que cresce linha a linha, o desenho vem ANTES da conta (geometria começa pela figura).
Treino com o difícil primeiro (FUVEST/ITA) para o ENEM parecer leve. Curso é só para ele.
