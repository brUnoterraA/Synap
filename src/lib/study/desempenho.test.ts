import { describe, expect, it } from "vitest";
import { analisarDesempenho } from ".";
import type { Tentativa } from "./types";

const agora = new Date("2026-03-01T12:00:00Z");
const diasAtras = (n: number) => new Date(agora.getTime() - n * 86_400_000);

function tentativas(materia: string, topico: string, acertos: number, erros: number, dias = 1): Tentativa[] {
  return [
    ...Array.from({ length: acertos }, () => ({ materia, topico, acertou: true, respondidaEm: diasAtras(dias) })),
    ...Array.from({ length: erros }, () => ({ materia, topico, acertou: false, respondidaEm: diasAtras(dias) })),
  ];
}

describe("analisarDesempenho", () => {
  it("retorna diagnóstico vazio sem tentativas", async () => {
    const d = await analisarDesempenho([], agora);
    expect(d).toEqual({ porTopico: [], pontosFracos: [], recomendacoes: [] });
  });

  it("calcula taxa de acerto por tópico", async () => {
    const d = await analisarDesempenho(tentativas("Matemática", "Funções", 3, 1), agora);
    expect(d.porTopico).toHaveLength(1);
    expect(d.porTopico[0]).toMatchObject({ total: 4, acertos: 3, taxaAcerto: 0.75 });
  });

  it("aponta como ponto fraco tópico com 5+ questões e menos de 60% de acerto, do pior para o melhor", async () => {
    const d = await analisarDesempenho(
      [
        ...tentativas("Matemática", "Geometria", 1, 4),
        ...tentativas("Física", "Óptica", 2, 3),
        ...tentativas("Biologia", "Genética", 5, 0),
      ],
      agora,
    );
    expect(d.pontosFracos.map((t) => t.topico)).toEqual(["Geometria", "Óptica"]);
    expect(d.recomendacoes[0]).toContain("Geometria");
  });

  it("não marca ponto fraco com poucas questões", async () => {
    const d = await analisarDesempenho(tentativas("Química", "Estequiometria", 0, 4), agora);
    expect(d.pontosFracos).toEqual([]);
  });

  it("conta só erros dos últimos 7 dias como recentes", async () => {
    const d = await analisarDesempenho(
      [...tentativas("Física", "Óptica", 0, 2, 2), ...tentativas("Física", "Óptica", 0, 3, 20)],
      agora,
    );
    expect(d.porTopico[0].errosRecentes).toBe(2);
  });

  it("recomenda retomar tópico sem prática há 10+ dias", async () => {
    const d = await analisarDesempenho(tentativas("História", "Brasil Colônia", 5, 0, 12), agora);
    expect(d.recomendacoes).toContain("Você não pratica Brasil Colônia (História) há 12 dias.");
  });

  it("separa tópicos de mesmo nome em matérias diferentes", async () => {
    const d = await analisarDesempenho(
      [...tentativas("Português", "Interpretação", 1, 0), ...tentativas("Inglês", "Interpretação", 1, 0)],
      agora,
    );
    expect(d.porTopico).toHaveLength(2);
  });
});
