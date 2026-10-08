import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ItemGrafico {
  rotulo: string;
  valor: number;
}

export function GraficoBarras({
  titulo,
  icone: Icone,
  itens,
  vazio,
}: {
  titulo: string;
  icone: LucideIcon;
  itens: ItemGrafico[];
  vazio: string;
}) {
  const maior = Math.max(...itens.map((item) => item.valor), 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{titulo}</CardTitle>
        <Icone aria-hidden className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {maior === 0 ? (
          <p className="text-sm text-muted-foreground">{vazio}</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {itens.map((item) => (
              <li key={item.rotulo} className="flex flex-col gap-1.5" title={`${item.rotulo}: ${item.valor}`}>
                <div className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">{item.rotulo}</span>
                  <span className="font-semibold tabular-nums">{item.valor}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(item.valor / maior) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
