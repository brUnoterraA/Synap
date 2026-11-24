import { describe, expect, it } from "vitest";
import { estaVencido, notaParaAvaliacao, novoCard, revisar } from ".";

const agora = new Date("2026-01-10T12:00:00Z");

describe("srs", () => {
  it("cria card novo vencido imediatamente", () => {
    const card = novoCard(agora);
    expect(card.reps).toBe(0);
    expect(estaVencido(card, agora)).toBe(true);
  });

  it("agenda mais longe quanto melhor a avaliação", () => {
    const card = novoCard(agora);
    const errei = revisar(card, "errei", agora).card.due.getTime();
    const bom = revisar(card, "bom", agora).card.due.getTime();
    const facil = revisar(card, "facil", agora).card.due.getTime();
    expect(errei).toBeLessThan(bom);
    expect(bom).toBeLessThan(facil);
  });

  it("conta lapso ao errar card já revisado", () => {
    let card = revisar(novoCard(agora), "facil", agora).card;
    card = revisar(card, "errei", card.due).card;
    expect(card.lapses).toBe(1);
  });

  it("card revisado não fica vencido logo depois", () => {
    const { card } = revisar(novoCard(agora), "facil", agora);
    expect(estaVencido(card, agora)).toBe(false);
  });

  it("converte nota 0..1 em avaliação", () => {
    expect(notaParaAvaliacao(0)).toBe("errei");
    expect(notaParaAvaliacao(0.49)).toBe("errei");
    expect(notaParaAvaliacao(0.5)).toBe("dificil");
    expect(notaParaAvaliacao(0.7)).toBe("bom");
    expect(notaParaAvaliacao(0.9)).toBe("facil");
    expect(notaParaAvaliacao(1)).toBe("facil");
  });

  it("rejeita nota fora de 0..1", () => {
    expect(() => notaParaAvaliacao(-0.1)).toThrow();
    expect(() => notaParaAvaliacao(1.5)).toThrow();
    expect(() => notaParaAvaliacao(Number.NaN)).toThrow();
  });
});
