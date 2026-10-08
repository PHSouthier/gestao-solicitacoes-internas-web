import "server-only";
import type { Prioridade, Status } from "@/features/solicitacoes/solicitacao";
import { buscarDaApi } from "@/lib/api/servidor";

export interface ResumoDashboard {
  total: number;
  porStatus: Record<Status, number>;
  porPrioridade: Record<Prioridade, number>;
  porArea: { areaId: number; nome: string; total: number }[];
  taxaAprovacao: number | null;
}

export function buscarResumo() {
  return buscarDaApi<ResumoDashboard>("/dashboard/resumo");
}
