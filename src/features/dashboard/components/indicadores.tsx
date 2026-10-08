import Link from "next/link";
import { ROTULO_STATUS, STATUS, type Status } from "@/features/solicitacoes/solicitacao";
import { juntarClasses } from "@/lib/utils";
import type { ResumoDashboard } from "../servidor";

const COR_STATUS: Record<Status, string> = {
  ABERTA: "bg-sky-500",
  EM_ANALISE: "bg-amber-500",
  APROVADA: "bg-verde",
  REJEITADA: "bg-red-500",
};

const porcentagem = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

export function Indicadores({ resumo }: { resumo: ResumoDashboard }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_2fr]">
      <div className="flex flex-col justify-between gap-6 rounded-xl bg-verde p-6 text-preto">
        <div>
          <p className="font-bold">Total de solicitações</p>
          <p className="mt-1 text-7xl leading-none font-black tracking-tight tabular-nums">
            {resumo.total}
          </p>
        </div>
        <p className="font-medium">
          {resumo.taxaAprovacao === null
            ? "Nenhuma solicitação foi decidida ainda."
            : `${porcentagem.format(resumo.taxaAprovacao)} das decididas foram aprovadas.`}
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-4">
        {STATUS.map((status) => (
          <li key={status}>
            <Link
              href={`/solicitacoes?status=${status}`}
              className="flex h-full flex-col gap-3 rounded-xl bg-texto/5 p-5 transition hover:bg-texto/10 focus-visible:outline-2 focus-visible:outline-texto"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-texto/70">
                <span aria-hidden className={juntarClasses("size-2.5 rounded-full", COR_STATUS[status])} />
                {ROTULO_STATUS[status]}
              </span>
              <span className="text-4xl font-black tracking-tight tabular-nums">
                {resumo.porStatus[status]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
