import { FileTextIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ICONE_STATUS } from "@/features/solicitacoes/components/badges";
import { ROTULO_STATUS, STATUS, type Status } from "@/features/solicitacoes/solicitacao";
import { cn } from "@/lib/utils";
import type { ResumoDashboard } from "../servidor";

const COR_ICONE: Record<Status, string> = {
  ABERTA: "text-sky-600 dark:text-sky-400",
  EM_ANALISE: "text-amber-600 dark:text-amber-400",
  APROVADA: "text-green-700 dark:text-verde",
  REJEITADA: "text-red-600 dark:text-red-400",
};

const porcentagem = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

export function Indicadores({ resumo }: { resumo: ResumoDashboard }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_2fr]">
      <Card className="justify-between border-transparent bg-primary text-primary-foreground">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Total de solicitações</CardTitle>
          <FileTextIcon aria-hidden className="size-5" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-6xl leading-none font-bold tracking-tight tabular-nums">{resumo.total}</p>
          <p className="font-medium">
            {resumo.taxaAprovacao === null
              ? "Nenhuma solicitação foi decidida ainda."
              : `${porcentagem.format(resumo.taxaAprovacao)} das decididas foram aprovadas.`}
          </p>
        </CardContent>
      </Card>

      <ul className="grid grid-cols-2 gap-4">
        {STATUS.map((status) => {
          const Icone = ICONE_STATUS[status];
          return (
            <li key={status}>
              <Link
                href={`/solicitacoes?status=${status}`}
                className="block h-full rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <Card className="h-full transition-colors hover:bg-accent/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {ROTULO_STATUS[status]}
                    </CardTitle>
                    <Icone aria-hidden className={cn("size-5", COR_ICONE[status])} />
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold tracking-tight tabular-nums">
                      {resumo.porStatus[status]}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
