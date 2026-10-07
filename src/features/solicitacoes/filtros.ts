import { PRIORIDADES, STATUS } from "./rotulos";
import type { Prioridade, Status } from "./tipos";

export const ORDENACOES = {
  recentes: { rotulo: "Mais recentes", ordenarPor: "dataSolicitacao", ordem: "desc" },
  antigas: { rotulo: "Mais antigas", ordenarPor: "dataSolicitacao", ordem: "asc" },
  prioridade: { rotulo: "Maior prioridade", ordenarPor: "prioridade", ordem: "desc" },
  titulo: { rotulo: "Título (A a Z)", ordenarPor: "titulo", ordem: "asc" },
} as const;

export type Ordenacao = keyof typeof ORDENACOES;

export interface Filtros {
  busca: string;
  status: Status[];
  prioridade: Prioridade[];
  areaId: string;
  dataInicio: string;
  dataFim: string;
  ordenacao: Ordenacao;
  pagina: number;
}

type Parametros = Record<string, string | string[] | undefined>;

function texto(valor: string | string[] | undefined): string {
  return (Array.isArray(valor) ? valor[0] : valor)?.trim() ?? "";
}

function listaDe<T extends string>(valor: string | string[] | undefined, validos: T[]): T[] {
  return texto(valor)
    .split(",")
    .filter((item): item is T => validos.includes(item as T));
}

const DATA = /^(\d{4})-(\d{2})-(\d{2})$/;

export function dataValida(valor: string): boolean {
  const partes = DATA.exec(valor);
  if (!partes) return false;
  const [ano, mes, dia] = partes.slice(1).map(Number);
  if (ano < 1900) return false;
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  return data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia;
}

export function lerFiltros(parametros: Parametros): Filtros {
  const ordenacao = texto(parametros.ordenacao);
  const pagina = Number(texto(parametros.pagina));
  const dataInicio = texto(parametros.dataInicio);
  const dataFim = texto(parametros.dataFim);

  return {
    busca: texto(parametros.busca).slice(0, 100),
    status: listaDe(parametros.status, STATUS),
    prioridade: listaDe(parametros.prioridade, PRIORIDADES),
    areaId: /^\d+$/.test(texto(parametros.areaId)) ? texto(parametros.areaId) : "",
    dataInicio: dataValida(dataInicio) ? dataInicio : "",
    dataFim: dataValida(dataFim) ? dataFim : "",
    ordenacao: ordenacao in ORDENACOES ? (ordenacao as Ordenacao) : "recentes",
    pagina: Number.isInteger(pagina) && pagina > 0 ? pagina : 1,
  };
}

export function paraUrl(filtros: Filtros): string {
  const url = new URLSearchParams();
  if (filtros.busca) url.set("busca", filtros.busca);
  if (filtros.status.length) url.set("status", filtros.status.join(","));
  if (filtros.prioridade.length) url.set("prioridade", filtros.prioridade.join(","));
  if (filtros.areaId) url.set("areaId", filtros.areaId);
  if (filtros.dataInicio) url.set("dataInicio", filtros.dataInicio);
  if (filtros.dataFim) url.set("dataFim", filtros.dataFim);
  if (filtros.ordenacao !== "recentes") url.set("ordenacao", filtros.ordenacao);
  if (filtros.pagina > 1) url.set("pagina", String(filtros.pagina));
  return url.toString();
}

export function paraConsultaApi(filtros: Filtros, tamanhoPagina = 10): string {
  const { ordenarPor, ordem } = ORDENACOES[filtros.ordenacao];
  const url = new URLSearchParams({
    ordenarPor,
    ordem,
    pagina: String(filtros.pagina),
    tamanhoPagina: String(tamanhoPagina),
  });
  if (filtros.busca) url.set("busca", filtros.busca);
  if (filtros.status.length) url.set("status", filtros.status.join(","));
  if (filtros.prioridade.length) url.set("prioridade", filtros.prioridade.join(","));
  if (filtros.areaId) url.set("areaId", filtros.areaId);
  if (filtros.dataInicio) url.set("dataInicio", filtros.dataInicio);
  if (filtros.dataFim) url.set("dataFim", filtros.dataFim);
  return url.toString();
}

export function temFiltroAtivo(filtros: Filtros): boolean {
  return Boolean(
    filtros.busca ||
      filtros.status.length ||
      filtros.prioridade.length ||
      filtros.areaId ||
      filtros.dataInicio ||
      filtros.dataFim,
  );
}
