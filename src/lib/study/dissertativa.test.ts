import { describe, expect, it } from "vitest";
import { corrigirDissertativa } from ".";

const rubrica = [
  { criterio: "Tese", peso: 2 },
  { criterio: "Argumentos", peso: 3 },
];

describe("corrigirDissertativa", () => {
  it("calcula nota ponderada pela rubrica", async () => {
    const c = await corrigirDissertativa({
      resposta: "...",
      respostaEsperada: "...",
      rubrica,
      autoavaliacao: { Tese: 1, Argumentos: 0.5 },
    });
    expect(c.nota).toBeCloseTo(0.7);
    expect(c.porCriterio).toEqual([
      { criterio: "Tese", peso: 2, nota: 1 },
      { criterio: "Argumentos", peso: 3, nota: 0.5 },
    ]);
  });

  it("conta critério sem autoavaliação como zero", async () => {
    const c = await corrigirDissertativa({ resposta: "", respostaEsperada: "", rubrica, autoavaliacao: { Tese: 1 } });
    expect(c.nota).toBeCloseTo(0.4);
  });

  it("limita autoavaliação ao intervalo 0..1", async () => {
    const c = await corrigirDissertativa({
      resposta: "",
      respostaEsperada: "",
      rubrica,
      autoavaliacao: { Tese: 5, Argumentos: -1 },
    });
    expect(c.porCriterio.map((p) => p.nota)).toEqual([1, 0]);
  });

  it("rejeita rubrica vazia ou com peso total zero", async () => {
    await expect(
      corrigirDissertativa({ resposta: "", respostaEsperada: "", rubrica: [], autoavaliacao: {} }),
    ).rejects.toThrow();
    await expect(
      corrigirDissertativa({
        resposta: "",
        respostaEsperada: "",
        rubrica: [{ criterio: "Tese", peso: 0 }],
        autoavaliacao: {},
      }),
    ).rejects.toThrow();
  });
});
