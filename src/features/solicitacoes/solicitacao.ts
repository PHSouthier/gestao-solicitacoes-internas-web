import type { Usuario } from "@/features/auth/usuario";

export type Status = "ABERTA" | "EM_ANALISE" | "APROVADA" | "REJEITADA";
export type Prioridade = "BAIXA" | "MEDIA" | "ALTA";
export type Decisao = "APROVADA" | "REJEITADA";

export interface Area {
  id: number;
  nome: string;
  exigeComplemento: boolean;
}

export interface UsuarioResumo {
  id: string;
  nome: string;
}

export interface SolicitacaoResumo {
  id: string;
  codigo: string;
  titulo: string;
  nomeSolicitante: string;
  area: { id: number; nome: string };
  areaComplemento: string | null;
  prioridade: Prioridade;
  status: Status;
  dataSolicitacao: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface HistoricoStatus {
  id: string;
  statusAnterior: Status | null;
  statusNovo: Status;
  comentario: string | null;
  alteradoPor: UsuarioResumo | null;
  alteradoEm: string;
}

export interface SolicitacaoDetalhe extends SolicitacaoResumo {
  descricao: string;
  criadoPor: UsuarioResumo | null;
  historico: HistoricoStatus[];
}

export interface PaginaSolicitacoes {
  data: SolicitacaoResumo[];
  meta: {
    pagina: number;
    tamanhoPagina: number;
    total: number;
    totalPaginas: number;
  };
}

export interface DadosSolicitacao {
  titulo: string;
  descricao: string;
  nomeSolicitante: string;
  areaId: number;
  areaComplemento?: string;
  prioridade: Prioridade;
  dataSolicitacao: string;
}

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
  BAIXA: "text-muted-foreground",
};

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
