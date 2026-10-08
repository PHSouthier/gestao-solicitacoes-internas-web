"use client";

import { LoaderCircleIcon, SearchIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  dataValida,
  type Filtros,
  ORDENACOES,
  type Ordenacao,
  paraUrl,
  temFiltroAtivo,
} from "../filtros";
import {
  type Area,
  type Prioridade,
  PRIORIDADES,
  ROTULO_PRIORIDADE,
  ROTULO_STATUS,
  type Status,
  STATUS,
} from "../solicitacao";

const ESPERA_DIGITACAO_MS = 400;

const TODAS = "todas";

const classesPilula =
  "rounded-full px-3 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground";

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
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título, descrição, solicitante ou código"
            aria-label="Buscar solicitações"
            maxLength={100}
            className="h-10 pl-9"
          />
          {carregando && (
            <LoaderCircleIcon
              aria-hidden
              className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
            />
          )}
        </div>
        <Select
          value={atuais.ordenacao}
          onValueChange={(valor) => aplicar({ ordenacao: valor as Ordenacao })}
        >
          <SelectTrigger aria-label="Ordenar por" className="h-10! w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ORDENACOES).map(([valor, { rotulo }]) => (
              <SelectItem key={valor} value={valor}>
                {rotulo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <ToggleGroup
          type="multiple"
          variant="outline"
          size="sm"
          spacing={2}
          aria-label="Status"
          value={atuais.status}
          onValueChange={(valor) => aplicar({ status: valor as Status[] })}
          className="flex-wrap"
        >
          {STATUS.map((status) => (
            <ToggleGroupItem key={status} value={status} className={classesPilula}>
              {ROTULO_STATUS[status]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <ToggleGroup
          type="multiple"
          variant="outline"
          size="sm"
          spacing={2}
          aria-label="Prioridade"
          value={atuais.prioridade}
          onValueChange={(valor) => aplicar({ prioridade: valor as Prioridade[] })}
          className="flex-wrap"
        >
          {PRIORIDADES.map((prioridade) => (
            <ToggleGroupItem key={prioridade} value={prioridade} className={classesPilula}>
              {ROTULO_PRIORIDADE[prioridade]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filtro-area" className="text-xs text-muted-foreground">
            Área
          </Label>
          <Select
            value={atuais.areaId || TODAS}
            onValueChange={(valor) => aplicar({ areaId: valor === TODAS ? "" : valor })}
          >
            <SelectTrigger id="filtro-area" className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODAS}>Todas as áreas</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area.id} value={String(area.id)}>
                  {area.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filtro-de" className="text-xs text-muted-foreground">
            De
          </Label>
          <Input
            id="filtro-de"
            type="date"
            value={datas.dataInicio}
            max={dataValida(datas.dataFim) ? datas.dataFim : undefined}
            onChange={(e) => setDatas((d) => ({ ...d, dataInicio: e.target.value }))}
            className="w-40"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filtro-ate" className="text-xs text-muted-foreground">
            Até
          </Label>
          <Input
            id="filtro-ate"
            type="date"
            value={datas.dataFim}
            min={dataValida(datas.dataInicio) ? datas.dataInicio : undefined}
            onChange={(e) => setDatas((d) => ({ ...d, dataFim: e.target.value }))}
            className="w-40"
          />
        </div>
        {temFiltroAtivo(atuais) && (
          <Button variant="ghost" onClick={limpar}>
            <XIcon />
            Limpar filtros
          </Button>
        )}
      </div>
    </section>
  );
}
