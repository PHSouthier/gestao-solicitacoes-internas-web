import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeStatus } from "@/features/solicitacoes/components/badges";
import type { SolicitacaoResumo } from "@/features/solicitacoes/solicitacao";
import { formatarData } from "@/lib/utils";

export function UltimasSolicitacoes({ solicitacoes }: { solicitacoes: SolicitacaoResumo[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimas solicitações</CardTitle>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/solicitacoes">
              Ver todas
              <ArrowRightIcon />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {solicitacoes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma solicitação cadastrada ainda.</p>
        ) : (
          <ul className="-mx-2 divide-y">
            {solicitacoes.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/solicitacoes/${s.id}`}
                  className="flex items-center justify-between gap-4 rounded-md px-2 py-3 transition-colors outline-none hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{s.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {s.codigo}, {formatarData(s.dataSolicitacao)}
                    </p>
                  </div>
                  <BadgeStatus status={s.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
