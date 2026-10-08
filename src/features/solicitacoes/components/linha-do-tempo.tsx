import { cn, formatarDataHora } from "@/lib/utils";
import { type HistoricoStatus, ROTULO_STATUS, type Status } from "../solicitacao";
import { ICONE_STATUS } from "./badges";

const COR: Record<Status, string> = {
  ABERTA: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  EM_ANALISE: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  APROVADA: "bg-verde/15 text-green-700 dark:text-verde",
  REJEITADA: "bg-red-500/15 text-red-700 dark:text-red-300",
};

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
        const Icone = ICONE_STATUS[evento.statusNovo];
        return (
          <li key={evento.id} className="relative flex gap-3 pb-6 last:pb-0">
            {!ultimo && <span aria-hidden className="absolute top-9 bottom-1 left-[15px] w-px bg-border" />}
            <span
              aria-hidden
              className={cn("grid size-8 shrink-0 place-items-center rounded-full", COR[evento.statusNovo])}
            >
              <Icone className="size-4" />
            </span>
            <div className="flex flex-col gap-1 pt-1">
              <p className="text-sm font-medium">{descricaoDoEvento(evento)}</p>
              <p className="text-xs text-muted-foreground">
                {formatarDataHora(evento.alteradoEm)}
                {evento.alteradoPor && ` por ${evento.alteradoPor.nome}`}
              </p>
              {evento.comentario && (
                <blockquote className="mt-1 rounded-md border-l-2 bg-muted px-3 py-2 text-sm">
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
