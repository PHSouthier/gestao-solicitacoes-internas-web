import "server-only";
import { notFound } from "next/navigation";
import { cache } from "react";
import { buscarDaApi } from "@/lib/api/servidor";
import { type Filtros, paraConsultaApi } from "./filtros";
import type { Area, PaginaSolicitacoes, SolicitacaoDetalhe } from "./solicitacao";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function listarSolicitacoes(filtros: Filtros, tamanhoPagina?: number) {
  return buscarDaApi<PaginaSolicitacoes>(
    `/solicitacoes?${paraConsultaApi(filtros, tamanhoPagina)}`,
  );
}

export const buscarSolicitacao = cache((id: string) => {
  if (!UUID.test(id)) notFound();
  return buscarDaApi<SolicitacaoDetalhe>(`/solicitacoes/${id}`);
});

export function listarUltimasSolicitacoes(quantidade = 5) {
  return buscarDaApi<PaginaSolicitacoes>(
    `/solicitacoes?ordenarPor=criadoEm&ordem=desc&tamanhoPagina=${quantidade}`,
  );
}

export function listarAreas() {
  return buscarDaApi<Area[]>("/areas");
}
