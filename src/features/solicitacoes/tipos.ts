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
