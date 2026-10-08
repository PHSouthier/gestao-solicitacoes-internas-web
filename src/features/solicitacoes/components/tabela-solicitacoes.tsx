"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatarData } from "@/lib/utils";
import type { SolicitacaoResumo } from "../solicitacao";
import { BadgePrioridade, BadgeStatus } from "./badges";

function nomeArea(s: SolicitacaoResumo): string {
  return s.areaComplemento ? `${s.area.nome}: ${s.areaComplemento}` : s.area.nome;
}

export function TabelaSolicitacoes({ solicitacoes }: { solicitacoes: SolicitacaoResumo[] }) {
  const router = useRouter();

  return (
    <>
      <Card className="hidden py-0 md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Solicitação</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4 text-right">Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {solicitacoes.map((s) => (
              <TableRow
                key={s.id}
                onClick={() => router.push(`/solicitacoes/${s.id}`)}
                className="cursor-pointer"
              >
                <TableCell className="max-w-md py-3 pl-4 whitespace-normal">
                  <Link
                    href={`/solicitacoes/${s.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {s.titulo}
                  </Link>
                  <p className="text-muted-foreground">
                    {s.codigo}, de {s.nomeSolicitante}
                  </p>
                </TableCell>
                <TableCell className="text-muted-foreground">{nomeArea(s)}</TableCell>
                <TableCell>
                  <BadgePrioridade prioridade={s.prioridade} />
                </TableCell>
                <TableCell>
                  <BadgeStatus status={s.status} />
                </TableCell>
                <TableCell className="pr-4 text-right text-muted-foreground tabular-nums">
                  {formatarData(s.dataSolicitacao)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <ul className="flex flex-col gap-3 md:hidden">
        {solicitacoes.map((s) => (
          <li key={s.id}>
            <Link
              href={`/solicitacoes/${s.id}`}
              className="block rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <Card className="gap-3 py-4 transition-colors hover:bg-accent/50">
                <CardContent className="flex flex-col gap-3 px-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{s.titulo}</p>
                      <p className="text-sm text-muted-foreground">
                        {s.codigo}, de {s.nomeSolicitante}
                      </p>
                    </div>
                    <BadgeStatus status={s.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <BadgePrioridade prioridade={s.prioridade} />
                    <span>{nomeArea(s)}</span>
                    <span className="tabular-nums">{formatarData(s.dataSolicitacao)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
