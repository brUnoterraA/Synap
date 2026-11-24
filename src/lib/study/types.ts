import type { RubricCriterion } from "@/db/schema/study";

export type Tentativa = {
  materia: string;
  topico: string;
  acertou: boolean;
  respondidaEm: Date;
};

export type DesempenhoTopico = {
  materia: string;
  topico: string;
  total: number;
  acertos: number;
  taxaAcerto: number;
  errosRecentes: number;
  ultimaPratica: Date;
};

export type Diagnostico = {
  porTopico: DesempenhoTopico[];
  pontosFracos: DesempenhoTopico[];
  recomendacoes: string[];
};

export type AnalisarDesempenho = (tentativas: Tentativa[], agora?: Date) => Promise<Diagnostico>;

export type CorrecaoEntrada = {
  resposta: string;
  respostaEsperada: string;
  rubrica: RubricCriterion[];
  autoavaliacao: Record<string, number>;
};

export type Correcao = {
  nota: number;
  porCriterio: (RubricCriterion & { nota: number })[];
};

export type CorrigirDissertativa = (entrada: CorrecaoEntrada) => Promise<Correcao>;
