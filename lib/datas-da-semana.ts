/* Dia do mês de cada dia desta semana (segunda a domingo), no horário de Brasília.
   Índices pelo dia civil: 0 = domingo. */
export function datasDaSemana(agora: Date): { datas: number[]; hoje: number } {
  const iso = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(agora);
  const base = new Date(`${iso}T12:00:00Z`);
  const hoje = base.getUTCDay();
  const desdeSegunda = (hoje + 6) % 7;
  const datas = Array.from({ length: 7 }, (_, diaCivil) => {
    const d = new Date(base);
    d.setUTCDate(base.getUTCDate() - desdeSegunda + ((diaCivil + 6) % 7));
    return d.getUTCDate();
  });
  return { datas, hoje };
}
