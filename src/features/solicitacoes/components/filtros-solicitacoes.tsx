"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { juntarClasses } from "@/lib/classes";
import {
  dataValida,
  type Filtros,
  ORDENACOES,
  type Ordenacao,
  paraUrl,
  temFiltroAtivo,
} from "../filtros";
import { PRIORIDADES, ROTULO_PRIORIDADE, ROTULO_STATUS, STATUS } from "../rotulos";
import type { Area } from "../tipos";

const ESPERA_DIGITACAO_MS = 400;

const classesControle =
  "h-10 rounded-full border border-texto/20 bg-fundo px-4 text-sm text-texto outline-none transition hover:border-texto/50 focus:border-texto focus:ring-1 focus:ring-texto";

function alternar<T>(lista: T[], item: T): T[] {
  return lista.includes(item) ? lista.filter((i) => i !== item) : [...lista, item];
}

function Chip({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      className={juntarClasses(
        "h-8 rounded-full px-3 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-texto",
        ativo
          ? "bg-texto text-fundo"
          : "bg-texto/10 text-texto hover:bg-texto/20",
      )}
    >
      {children}
    </button>
  );
}

export function FiltrosSolicitacoes({
  filtros,
  areas,
}: {
  filtros: Filtros;
  areas: Area[];
}) {
  const router = useRouter();
  const [carregando, iniciarTransicao] = useTransition();
  const [atuais, setAtuais] = useState(filtros);
  const [busca, setBusca] = useState(filtros.busca);
  const [datas, setDatas] = useState({
    dataInicio: filtros.dataInicio,
    dataFim: filtros.dataFim,
  });
  const primeiraVez = useRef(true);

  function aplicar(novos: Partial<Filtros>) {
    const proximos = { ...atuais, ...novos, pagina: 1 };
    setAtuais(proximos);
    const consulta = paraUrl(proximos);
    iniciarTransicao(() => {
      router.replace(consulta ? `/solicitacoes?${consulta}` : "/solicitacoes", {
        scroll: false,
      });
    });
  }

  useEffect(() => {
    if (primeiraVez.current) {
      primeiraVez.current = false;
      return;
    }
    const espera = setTimeout(() => {
      const aceita = (valor: string) => valor === "" || dataValida(valor);
      const novos = {
        busca: busca.trim(),
        dataInicio: aceita(datas.dataInicio) ? datas.dataInicio : atuais.dataInicio,
        dataFim: aceita(datas.dataFim) ? datas.dataFim : atuais.dataFim,
      };
      const mudou =
        novos.busca !== atuais.busca ||
        novos.dataInicio !== atuais.dataInicio ||
        novos.dataFim !== atuais.dataFim;
      if (mudou) aplicar(novos);
    }, ESPERA_DIGITACAO_MS);
    return () => clearTimeout(espera);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca, datas]);

  function limpar() {
    setBusca("");
    setDatas({ dataInicio: "", dataFim: "" });
    aplicar({
      busca: "",
      status: [],
      prioridade: [],
      areaId: "",
      dataInicio: "",
      dataFim: "",
    });
  }

  return (
    <section aria-label="Filtros" className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-texto/50"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título, descrição, solicitante ou código"
            aria-label="Buscar solicitações"
            maxLength={100}
            className={juntarClasses(classesControle, "h-12 w-full pl-12 text-base")}
          />
          {carregando && (
            <span
              aria-hidden
              className="absolute top-1/2 right-4 size-4 -translate-y-1/2 animate-spin rounded-full border-2 border-texto/40 border-t-transparent"
            />
          )}
        </div>
        <select
          aria-label="Ordenar por"
          value={atuais.ordenacao}
          onChange={(e) => aplicar({ ordenacao: e.target.value as Ordenacao })}
          className={juntarClasses(classesControle, "h-12")}
        >
          {Object.entries(ORDENACOES).map(([valor, { rotulo }]) => (
            <option key={valor} value={valor}>
              {rotulo}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div role="group" aria-label="Status" className="flex flex-wrap gap-2">
          {STATUS.map((status) => (
            <Chip
              key={status}
              ativo={atuais.status.includes(status)}
              onClick={() => aplicar({ status: alternar(atuais.status, status) })}
            >
              {ROTULO_STATUS[status]}
            </Chip>
          ))}
        </div>
        <div role="group" aria-label="Prioridade" className="flex flex-wrap gap-2">
          {PRIORIDADES.map((prioridade) => (
            <Chip
              key={prioridade}
              ativo={atuais.prioridade.includes(prioridade)}
              onClick={() =>
                aplicar({ prioridade: alternar(atuais.prioridade, prioridade) })
              }
            >
              {ROTULO_PRIORIDADE[prioridade]}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs font-bold text-texto/60">
          Área
          <select
            value={atuais.areaId}
            onChange={(e) => aplicar({ areaId: e.target.value })}
            className={classesControle}
          >
            <option value="">Todas as áreas</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.nome}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold text-texto/60">
          De
          <input
            type="date"
            value={datas.dataInicio}
            max={dataValida(datas.dataFim) ? datas.dataFim : undefined}
            onChange={(e) => setDatas((d) => ({ ...d, dataInicio: e.target.value }))}
            className={classesControle}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold text-texto/60">
          Até
          <input
            type="date"
            value={datas.dataFim}
            min={dataValida(datas.dataInicio) ? datas.dataInicio : undefined}
            onChange={(e) => setDatas((d) => ({ ...d, dataFim: e.target.value }))}
            className={classesControle}
          />
        </label>
        {temFiltroAtivo(atuais) && (
          <button
            type="button"
            onClick={limpar}
            className="h-10 rounded-full px-4 text-sm font-bold text-texto/70 underline-offset-4 hover:text-texto hover:underline"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </section>
  );
}
