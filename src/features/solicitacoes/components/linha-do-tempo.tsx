import { formatarDataHora, juntarClasses } from "@/lib/utils";
import { type HistoricoStatus, ROTULO_STATUS } from "../solicitacao";

const COR_PONTO = {
  ABERTA: "bg-sky-500",
  EM_ANALISE: "bg-amber-500",
  APROVADA: "bg-verde",
  REJEITADA: "bg-red-500",
} as const;

function descricaoDoEvento(evento: HistoricoStatus): string {
  if (evento.statusAnterior === null) return "Solicitação cadastrada";
  if (evento.statusNovo === "EM_ANALISE") return "Análise iniciada";
  return ROTULO_STATUS[evento.statusNovo];
}

export function LinhaDoTempo({ historico }: { historico: HistoricoStatus[] }) {
  return (
    <ol className="flex flex-col">
      {historico.map((evento, indice) => {
        const ultimo = indice === historico.length - 1;
        return (
          <li key={evento.id} className="relative flex gap-4 pb-8 last:pb-0">
            {!ultimo && (
              <span aria-hidden className="absolute top-5 bottom-0 left-[7px] w-0.5 bg-texto/15" />
            )}
            <span
              aria-hidden
              className={juntarClasses(
                "relative mt-1 size-4 shrink-0 rounded-full ring-4 ring-fundo",
                COR_PONTO[evento.statusNovo],
              )}
            />
            <div className="flex flex-col gap-1">
              <p className="font-bold">{descricaoDoEvento(evento)}</p>
              <p className="text-sm text-texto/60">
                {formatarDataHora(evento.alteradoEm)}
                {evento.alteradoPor && ` por ${evento.alteradoPor.nome}`}
              </p>
              {evento.comentario && (
                <blockquote className="mt-1 rounded-md bg-texto/5 px-4 py-3 text-texto/90">
                  {evento.comentario}
                </blockquote>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
