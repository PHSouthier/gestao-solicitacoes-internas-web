import Link from "next/link";
import { BadgeStatus } from "@/features/solicitacoes/components/badges";
import type { SolicitacaoResumo } from "@/features/solicitacoes/tipos";
import { formatarData } from "@/lib/datas";

export function UltimasSolicitacoes({
  solicitacoes,
}: {
  solicitacoes: SolicitacaoResumo[];
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-bold">Últimas solicitações</h2>
        <Link href="/solicitacoes" className="text-sm font-bold text-texto/70 hover:text-texto hover:underline underline-offset-4">
          Ver todas
        </Link>
      </div>
      {solicitacoes.length === 0 ? (
        <p className="text-texto/60">Nenhuma solicitação cadastrada ainda.</p>
      ) : (
        <ul className="divide-y divide-texto/10 rounded-xl ring-1 ring-texto/10">
          {solicitacoes.map((s) => (
            <li key={s.id}>
              <Link
                href={`/solicitacoes/${s.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-texto/5 focus-visible:outline-2 focus-visible:outline-texto"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold">{s.titulo}</p>
                  <p className="text-sm text-texto/60">
                    {s.codigo}, {formatarData(s.dataSolicitacao)}
                  </p>
                </div>
                <BadgeStatus status={s.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
