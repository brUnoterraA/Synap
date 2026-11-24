import type { AnalisarDesempenho, DesempenhoTopico } from "./types";

const DIA_MS = 86_400_000;
const MIN_QUESTOES = 5;
const TAXA_FRACA = 0.6;
const JANELA_RECENTE_DIAS = 7;
const DIAS_SEM_PRATICA = 10;

export const analisarPorRegras: AnalisarDesempenho = async (tentativas, agora = new Date()) => {
  const grupos = new Map<string, DesempenhoTopico>();

  for (const t of tentativas) {
    const chave = `${t.materia}\u0000${t.topico}`;
    const g = grupos.get(chave) ?? {
      materia: t.materia,
      topico: t.topico,
      total: 0,
      acertos: 0,
      taxaAcerto: 0,
      errosRecentes: 0,
      ultimaPratica: t.respondidaEm,
    };
    g.total++;
    if (t.acertou) g.acertos++;
    else if (agora.getTime() - t.respondidaEm.getTime() <= JANELA_RECENTE_DIAS * DIA_MS) g.errosRecentes++;
    if (t.respondidaEm > g.ultimaPratica) g.ultimaPratica = t.respondidaEm;
    grupos.set(chave, g);
  }

  const porTopico = [...grupos.values()].map((g) => ({ ...g, taxaAcerto: g.acertos / g.total }));

  const pontosFracos = porTopico
    .filter((g) => g.total >= MIN_QUESTOES && g.taxaAcerto < TAXA_FRACA)
    .sort((a, b) => a.taxaAcerto - b.taxaAcerto);

  const recomendacoes = pontosFracos
    .slice(0, 3)
    .map(
      (g) =>
        `Revise ${g.topico} (${g.materia}): ${Math.round(g.taxaAcerto * 100)}% de acerto em ${g.total} questões.`,
    );

  for (const g of porTopico) {
    const dias = Math.floor((agora.getTime() - g.ultimaPratica.getTime()) / DIA_MS);
    if (dias >= DIAS_SEM_PRATICA) recomendacoes.push(`Você não pratica ${g.topico} (${g.materia}) há ${dias} dias.`);
  }

  return { porTopico, pontosFracos, recomendacoes };
};
