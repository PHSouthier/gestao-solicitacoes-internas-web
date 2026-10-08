import { juntarClasses } from "@/lib/utils";
import {
  COR_PRIORIDADE,
  COR_STATUS,
  type Prioridade,
  ROTULO_PRIORIDADE,
  ROTULO_STATUS,
  type Status,
} from "../solicitacao";

export function BadgeStatus({ status }: { status: Status }) {
  return (
    <span
      className={juntarClasses(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap",
        COR_STATUS[status],
      )}
    >
      {ROTULO_STATUS[status]}
    </span>
  );
}

const BARRAS: Record<Prioridade, number> = { BAIXA: 1, MEDIA: 2, ALTA: 3 };

export function BadgePrioridade({ prioridade }: { prioridade: Prioridade }) {
  return (
    <span
      className={juntarClasses(
        "inline-flex items-center gap-1.5 text-sm font-bold whitespace-nowrap",
        COR_PRIORIDADE[prioridade],
      )}
    >
      <span aria-hidden className="flex items-end gap-0.5">
        {[1, 2, 3].map((nivel) => (
          <span
            key={nivel}
            className={juntarClasses(
              "w-1 rounded-full bg-current",
              nivel === 1 ? "h-1.5" : nivel === 2 ? "h-2.5" : "h-3.5",
              nivel > BARRAS[prioridade] && "opacity-25",
            )}
          />
        ))}
      </span>
      {ROTULO_PRIORIDADE[prioridade]}
    </span>
  );
}
