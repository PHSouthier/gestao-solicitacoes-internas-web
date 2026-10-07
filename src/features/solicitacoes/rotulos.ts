import type { Prioridade, Status } from "./tipos";

export const STATUS: Status[] = ["ABERTA", "EM_ANALISE", "APROVADA", "REJEITADA"];
export const PRIORIDADES: Prioridade[] = ["ALTA", "MEDIA", "BAIXA"];

export const ROTULO_STATUS: Record<Status, string> = {
  ABERTA: "Aberta",
  EM_ANALISE: "Em análise",
  APROVADA: "Aprovada",
  REJEITADA: "Rejeitada",
};

export const ROTULO_PRIORIDADE: Record<Prioridade, string> = {
  ALTA: "Alta",
  MEDIA: "Média",
  BAIXA: "Baixa",
};

export const COR_STATUS: Record<Status, string> = {
  ABERTA: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  EM_ANALISE: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  APROVADA: "bg-verde/15 text-green-700 dark:text-verde",
  REJEITADA: "bg-red-500/15 text-red-700 dark:text-red-300",
};

export const COR_PRIORIDADE: Record<Prioridade, string> = {
  ALTA: "text-red-700 dark:text-red-300",
  MEDIA: "text-amber-700 dark:text-amber-300",
  BAIXA: "text-texto/60",
};
