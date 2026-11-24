import type { CorrigirDissertativa } from "./types";

const limitar = (n: number) => Math.min(1, Math.max(0, n));

export const corrigirPorRubrica: CorrigirDissertativa = async ({ rubrica, autoavaliacao }) => {
  const pesoTotal = rubrica.reduce((soma, c) => soma + c.peso, 0);
  if (pesoTotal <= 0) throw new Error("Rubrica precisa de ao menos um critério com peso positivo.");

  const porCriterio = rubrica.map((c) => ({ ...c, nota: limitar(autoavaliacao[c.criterio] ?? 0) }));
  const nota = porCriterio.reduce((soma, c) => soma + c.peso * c.nota, 0) / pesoTotal;

  return { nota, porCriterio };
};
