import { analisarPorRegras } from "./desempenho";
import { corrigirPorRubrica } from "./dissertativa";
import type { AnalisarDesempenho, CorrigirDissertativa } from "./types";

export type * from "./types";

// Trocar por implementações com IA no futuro, mantendo as mesmas assinaturas.
export const analisarDesempenho: AnalisarDesempenho = analisarPorRegras;
export const corrigirDissertativa: CorrigirDissertativa = corrigirPorRubrica;
