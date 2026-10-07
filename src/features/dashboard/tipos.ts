import type { Prioridade, Status } from "@/features/solicitacoes/tipos";

export interface ResumoDashboard {
  total: number;
  porStatus: Record<Status, number>;
  porPrioridade: Record<Prioridade, number>;
  porArea: { areaId: number; nome: string; total: number }[];
  taxaAprovacao: number | null;
}
