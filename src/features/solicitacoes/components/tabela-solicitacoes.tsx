import Link from "next/link";
import { juntarClasses } from "@/lib/classes";
import { formatarData } from "@/lib/datas";
import type { SolicitacaoResumo } from "../tipos";
import { BadgePrioridade, BadgeStatus } from "./badges";

const COLUNAS = "grid grid-cols-[minmax(0,2.2fr)_minmax(0,1.3fr)_7rem_7rem_6rem] gap-4";

function nomeArea(s: SolicitacaoResumo): string {
  return s.areaComplemento ? `${s.area.nome}: ${s.areaComplemento}` : s.area.nome;
}

export function TabelaSolicitacoes({
  solicitacoes,
}: {
  solicitacoes: SolicitacaoResumo[];
}) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl ring-1 ring-texto/10 md:block">
        <div
          aria-hidden
          className={juntarClasses(COLUNAS, "bg-texto/5 px-4 py-3 text-sm font-bold text-texto/60")}
        >
          <span>Solicitação</span>
          <span>Área</span>
          <span>Prioridade</span>
          <span>Status</span>
          <span className="text-right">Data</span>
        </div>
        <ul className="divide-y divide-texto/10">
          {solicitacoes.map((s) => (
            <li key={s.id}>
              <Link
                href={`/solicitacoes/${s.id}`}
                className={juntarClasses(
                  COLUNAS,
                  "items-center px-4 py-4 text-sm transition hover:bg-texto/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-texto",
                )}
              >
                <span className="min-w-0">
                  <span className="block font-bold">{s.titulo}</span>
                  <span className="mt-0.5 block text-texto/60">
                    {s.codigo}, de {s.nomeSolicitante}
                  </span>
                </span>
                <span className="text-texto/80">{nomeArea(s)}</span>
                <span>
                  <BadgePrioridade prioridade={s.prioridade} />
                </span>
                <span>
                  <BadgeStatus status={s.status} />
                </span>
                <span className="text-right whitespace-nowrap text-texto/80 tabular-nums">
                  {formatarData(s.dataSolicitacao)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {solicitacoes.map((s) => (
          <li key={s.id}>
            <Link
              href={`/solicitacoes/${s.id}`}
              className="flex flex-col gap-3 rounded-xl bg-texto/5 p-4 transition hover:bg-texto/10 focus-visible:outline-2 focus-visible:outline-texto"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{s.titulo}</p>
                  <p className="mt-0.5 text-sm text-texto/60">
                    {s.codigo}, de {s.nomeSolicitante}
                  </p>
                </div>
                <BadgeStatus status={s.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-texto/70">
                <BadgePrioridade prioridade={s.prioridade} />
                <span>{nomeArea(s)}</span>
                <span className="tabular-nums">{formatarData(s.dataSolicitacao)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
