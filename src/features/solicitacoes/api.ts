import { requisicao } from "@/lib/api/cliente";
import type { DadosSolicitacao, Decisao, SolicitacaoDetalhe } from "./tipos";

export function criarSolicitacao(dados: DadosSolicitacao) {
  return requisicao<SolicitacaoDetalhe>("/solicitacoes", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function atualizarSolicitacao(id: string, dados: DadosSolicitacao) {
  return requisicao<SolicitacaoDetalhe>(`/solicitacoes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dados),
  });
}

export function excluirSolicitacao(id: string) {
  return requisicao<void>(`/solicitacoes/${id}`, { method: "DELETE" });
}

export function iniciarAnalise(id: string) {
  return requisicao<SolicitacaoDetalhe>(`/solicitacoes/${id}/analise`, {
    method: "POST",
  });
}

export function decidir(id: string, decisao: Decisao, comentario: string) {
  return requisicao<SolicitacaoDetalhe>(`/solicitacoes/${id}/decisao`, {
    method: "POST",
    body: JSON.stringify({ decisao, comentario }),
  });
}
