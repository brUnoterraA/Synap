import { type Card, createEmptyCard, fsrs, type Grade, Rating, type ReviewLog } from "ts-fsrs";

export type Avaliacao = "errei" | "dificil" | "bom" | "facil";

const ratings: Record<Avaliacao, Grade> = {
  errei: Rating.Again,
  dificil: Rating.Hard,
  bom: Rating.Good,
  facil: Rating.Easy,
};

const scheduler = fsrs();

export function novoCard(agora: Date = new Date()): Card {
  return createEmptyCard(agora);
}

export function revisar(card: Card, avaliacao: Avaliacao, agora: Date = new Date()): { card: Card; log: ReviewLog } {
  return scheduler.next(card, agora, ratings[avaliacao]);
}

export function estaVencido(card: Card, agora: Date = new Date()): boolean {
  return card.due.getTime() <= agora.getTime();
}

export function notaParaAvaliacao(nota: number): Avaliacao {
  if (!(nota >= 0 && nota <= 1)) throw new RangeError(`Nota deve estar entre 0 e 1: ${nota}`);
  if (nota < 0.5) return "errei";
  if (nota < 0.7) return "dificil";
  if (nota < 0.9) return "bom";
  return "facil";
}
