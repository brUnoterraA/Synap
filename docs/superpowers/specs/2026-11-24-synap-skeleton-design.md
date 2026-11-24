# Synap: esqueleto do projeto

## Intenção
Projeto de portfólio: plataforma de estudos para vestibulares e concursos com teoria, questões reais (múltipla escolha e dissertativas) e repetição espaçada. Pode virar produto comercial depois (grátis com anúncios + planos pagos com tutor de IA).

## Objetivos
- Base pronta para construir as funcionalidades commit a commit.
- Custo zero: Vercel Hobby + Neon free + GitHub.
- Qualidade visível para recrutador: testes, CI, README.

## Não objetivos
- Telas de estudo funcionando, banco real de questões, deploy, IA.

## Abordagens
- **Esqueleto (escolhida):** infraestrutura + domínio mínimo + docs. O usuário constrói o resto e domina cada parte.
- **MVP funcionando:** fluxo completo de estudo. Descartado por ora: mais trabalho e menos autoria do usuário.

## Decisões
- Next.js 15 App Router + TypeScript, Tailwind + shadcn/ui.
- Neon + Drizzle; Better Auth (e-mail/senha e Google) com tabelas próprias.
- `ts-fsrs` (MIT) atrás de `src/lib/srs`; avaliações em português (errei/dificil/bom/facil).
- `analisarDesempenho()` e `corrigirDissertativa()` assíncronas, implementadas por regras, trocáveis por IA.
- Vitest + Playwright; GitHub Actions com lint, typecheck, testes, build e e2e.
- Repositório público `brUnoterraA/Synap`, licença MIT, README em português.
- Sem nada do Anki (código AGPL ou marca).
