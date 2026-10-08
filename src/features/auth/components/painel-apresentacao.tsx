import { CircleCheckIcon, CircleDotIcon, ClockIcon } from "lucide-react";
import { Marca } from "@/components/marca";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ETAPAS = [
  { status: "Aberta", detalhe: "02/10 por Sérgio, do Financeiro", icone: CircleDotIcon },
  { status: "Em análise", detalhe: "03/10 por Ana, da TI", icone: ClockIcon },
  {
    status: "Aprovada",
    detalhe: "03/10: compra liberada no orçamento do trimestre.",
    icone: CircleCheckIcon,
  },
];

export function PainelApresentacao() {
  return (
    <section className="hidden flex-col justify-between gap-12 bg-verde p-12 text-preto lg:flex xl:p-16">
      <Marca sobreVerde />

      <div className="max-w-xl">
        <h2 className="text-6xl leading-[0.95] font-black tracking-tight xl:text-7xl">
          Do pedido à decisão, sem nada se perder.
        </h2>
        <p className="mt-6 max-w-md text-lg font-medium">
          Abra solicitações, acompanhe a análise e registre cada decisão com comentário e data.
        </p>
      </div>

      <Card className="max-w-md shadow-2xl shadow-preto/30">
        <CardHeader>
          <CardDescription>SOL-000042</CardDescription>
          <CardTitle className="text-lg">Notebook para o time de design</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-col gap-4">
            {ETAPAS.map((etapa, indice) => {
              const atual = indice === ETAPAS.length - 1;
              const Icone = etapa.icone;
              return (
                <li key={etapa.status} className="flex gap-3">
                  <Icone
                    aria-hidden
                    className={cn(
                      "mt-0.5 size-5 shrink-0",
                      atual ? "text-green-700 dark:text-verde" : "text-muted-foreground",
                    )}
                  />
                  <div>
                    <p className={cn("font-semibold", atual && "text-green-700 dark:text-verde")}>
                      {etapa.status}
                    </p>
                    <p className="text-sm text-muted-foreground">{etapa.detalhe}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
    </section>
  );
}
