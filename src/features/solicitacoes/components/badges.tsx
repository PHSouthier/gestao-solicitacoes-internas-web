import {
  CircleCheckIcon,
  CircleDotIcon,
  CircleXIcon,
  ClockIcon,
  type LucideIcon,
  SignalHighIcon,
  SignalLowIcon,
  SignalMediumIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  COR_PRIORIDADE,
  COR_STATUS,
  type Prioridade,
  ROTULO_PRIORIDADE,
  ROTULO_STATUS,
  type Status,
} from "../solicitacao";

export const ICONE_STATUS: Record<Status, LucideIcon> = {
  ABERTA: CircleDotIcon,
  EM_ANALISE: ClockIcon,
  APROVADA: CircleCheckIcon,
  REJEITADA: CircleXIcon,
};

const ICONE_PRIORIDADE: Record<Prioridade, LucideIcon> = {
  ALTA: SignalHighIcon,
  MEDIA: SignalMediumIcon,
  BAIXA: SignalLowIcon,
};

export function BadgeStatus({ status }: { status: Status }) {
  const Icone = ICONE_STATUS[status];
  return (
    <Badge className={cn("border-transparent", COR_STATUS[status])}>
      <Icone />
      {ROTULO_STATUS[status]}
    </Badge>
  );
}

export function BadgePrioridade({ prioridade }: { prioridade: Prioridade }) {
  const Icone = ICONE_PRIORIDADE[prioridade];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium whitespace-nowrap",
        COR_PRIORIDADE[prioridade],
      )}
    >
      <Icone aria-hidden className="size-4" />
      {ROTULO_PRIORIDADE[prioridade]}
    </span>
  );
}
