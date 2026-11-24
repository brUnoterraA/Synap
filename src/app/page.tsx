import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const recursos = [
  { titulo: "Questões reais", descricao: "Vestibulares, ENEM e concursos, com múltipla escolha e dissertativas." },
  { titulo: "Repetição espaçada", descricao: "Revisões agendadas pelo algoritmo FSRS no momento certo de lembrar." },
  { titulo: "Diagnóstico", descricao: "Veja seus pontos fracos por matéria e assunto e o que estudar a seguir." },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-12 px-4 py-16">
      <section className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-5xl font-bold tracking-tight">Synap</h1>
        <p className="text-muted-foreground max-w-xl text-lg">
          Estude para vestibulares e concursos com questões reais, teoria e repetição espaçada.
        </p>
        <Button size="lg" disabled>
          Em breve
        </Button>
      </section>
      <section className="grid w-full gap-4 sm:grid-cols-3">
        {recursos.map((r) => (
          <Card key={r.titulo}>
            <CardHeader>
              <CardTitle>{r.titulo}</CardTitle>
              <CardDescription>{r.descricao}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </main>
  );
}
