import type { Usuario } from "@/features/auth/tipos";
import type { SolicitacaoDetalhe, Status } from "./tipos";

const FINALIZADOS: Status[] = ["APROVADA", "REJEITADA"];

function ehDonoOuNaoSolicitante(usuario: Usuario, s: SolicitacaoDetalhe) {
  return usuario.perfil !== "SOLICITANTE" || s.criadoPor?.id === usuario.id;
}

export function podeEditar(usuario: Usuario, s: SolicitacaoDetalhe): boolean {
  return !FINALIZADOS.includes(s.status) && ehDonoOuNaoSolicitante(usuario, s);
}

export function podeExcluir(usuario: Usuario, s: SolicitacaoDetalhe): boolean {
  return (
    usuario.perfil !== "ANALISTA" &&
    s.status === "ABERTA" &&
    ehDonoOuNaoSolicitante(usuario, s)
  );
}

export function podeIniciarAnalise(usuario: Usuario, s: SolicitacaoDetalhe): boolean {
  return usuario.perfil !== "SOLICITANTE" && s.status === "ABERTA";
}

export function podeDecidir(usuario: Usuario, s: SolicitacaoDetalhe): boolean {
  return usuario.perfil !== "SOLICITANTE" && !FINALIZADOS.includes(s.status);
}
