"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alerta } from "@/components/ui/alerta";
import { Botao, classesBotao } from "@/components/ui/botao";
import { AreaTexto, Campo, Selecao } from "@/components/ui/campo";
import { ApiErro } from "@/lib/api/erros";
import { errosPorCampo, mensagemDoErro } from "@/lib/api/cliente";
import { juntarClasses } from "@/lib/classes";
import { atualizarSolicitacao, criarSolicitacao } from "../api";
import { PRIORIDADES, ROTULO_PRIORIDADE, ROTULO_STATUS } from "../rotulos";
import type { Area, DadosSolicitacao, Prioridade, SolicitacaoDetalhe } from "../tipos";

type ErrosCampos = Partial<Record<keyof DadosSolicitacao, string>>;

interface FormularioSolicitacaoProps {
  areas: Area[];
  hoje: string;
  nomePadrao: string;
  solicitacao?: SolicitacaoDetalhe;
}

function validar(dados: DadosSolicitacao, area: Area | undefined, hoje: string): ErrosCampos {
  const erros: ErrosCampos = {};
  if (dados.titulo.length < 3 || dados.titulo.length > 150)
    erros.titulo = "O título deve ter entre 3 e 150 caracteres.";
  if (dados.descricao.length < 10 || dados.descricao.length > 5000)
    erros.descricao = "A descrição deve ter entre 10 e 5000 caracteres.";
  if (dados.nomeSolicitante.length < 2 || dados.nomeSolicitante.length > 120)
    erros.nomeSolicitante = "Informe quem está pedindo (2 a 120 caracteres).";
  if (!area) erros.areaId = "Escolha a área.";
  if (area?.exigeComplemento && !dados.areaComplemento)
    erros.areaComplemento = "Informe o nome da área.";
  if (!dados.dataSolicitacao) erros.dataSolicitacao = "Informe a data.";
  else if (dados.dataSolicitacao > hoje)
    erros.dataSolicitacao = "A data não pode ser futura.";
  return erros;
}

export function FormularioSolicitacao({
  areas,
  hoje,
  nomePadrao,
  solicitacao,
}: FormularioSolicitacaoProps) {
  const router = useRouter();
  const editando = Boolean(solicitacao);
  const [areaId, setAreaId] = useState(solicitacao ? String(solicitacao.area.id) : "");
  const [prioridade, setPrioridade] = useState<Prioridade>(solicitacao?.prioridade ?? "MEDIA");
  const [erros, setErros] = useState<ErrosCampos>({});
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const areaEscolhida = areas.find((area) => String(area.id) === areaId);
  const destinoCancelar = solicitacao ? `/solicitacoes/${solicitacao.id}` : "/solicitacoes";

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const formulario = new FormData(evento.currentTarget);
    const texto = (campo: string) => String(formulario.get(campo) ?? "").trim();

    const dados: DadosSolicitacao = {
      titulo: texto("titulo"),
      descricao: texto("descricao"),
      nomeSolicitante: texto("nomeSolicitante"),
      areaId: Number(areaId),
      areaComplemento: areaEscolhida?.exigeComplemento ? texto("areaComplemento") : undefined,
      prioridade,
      dataSolicitacao: texto("dataSolicitacao"),
    };

    const novosErros = validar(dados, areaEscolhida, hoje);
    setErros(novosErros);
    setMensagem(null);
    if (Object.keys(novosErros).length > 0) return;

    setEnviando(true);
    try {
      const salva = solicitacao
        ? await atualizarSolicitacao(solicitacao.id, dados)
        : await criarSolicitacao(dados);
      router.push(`/solicitacoes/${salva.id}`);
      router.refresh();
    } catch (erro) {
      setEnviando(false);
      if (erro instanceof ApiErro && erro.detalhes.length > 0) {
        setErros(errosPorCampo(erro));
        return;
      }
      setMensagem(mensagemDoErro(erro));
    }
  }

  return (
    <form noValidate onSubmit={aoEnviar} className="flex flex-col gap-6">
      {mensagem && <Alerta>{mensagem}</Alerta>}

      <Campo
        id="titulo"
        name="titulo"
        rotulo="Título"
        placeholder="Ex.: Notebook para o novo vendedor"
        defaultValue={solicitacao?.titulo}
        maxLength={150}
        erro={erros.titulo}
      />

      <AreaTexto
        id="descricao"
        name="descricao"
        rotulo="Descrição"
        placeholder="Conte o que precisa, para quem e por quê."
        defaultValue={solicitacao?.descricao}
        maxLength={5000}
        rows={5}
        erro={erros.descricao}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Campo
          id="nomeSolicitante"
          name="nomeSolicitante"
          rotulo="Solicitante"
          dica="Quem está pedindo. Pode ser outra pessoa."
          defaultValue={solicitacao?.nomeSolicitante ?? nomePadrao}
          maxLength={120}
          erro={erros.nomeSolicitante}
        />
        <Campo
          id="dataSolicitacao"
          name="dataSolicitacao"
          type="date"
          rotulo="Data da solicitação"
          defaultValue={solicitacao?.dataSolicitacao ?? hoje}
          max={hoje}
          erro={erros.dataSolicitacao}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Selecao
          id="areaId"
          name="areaId"
          rotulo="Área"
          value={areaId}
          onChange={(e) => setAreaId(e.target.value)}
          erro={erros.areaId}
        >
          <option value="" disabled>
            Escolha a área
          </option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.nome}
            </option>
          ))}
        </Selecao>
        {areaEscolhida?.exigeComplemento && (
          <Campo
            id="areaComplemento"
            name="areaComplemento"
            rotulo="Nome da área"
            placeholder="Ex.: Comitê de Eventos"
            defaultValue={solicitacao?.areaComplemento ?? ""}
            maxLength={100}
            erro={erros.areaComplemento}
          />
        )}
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-bold">Prioridade</legend>
        <div className="flex flex-wrap gap-2">
          {PRIORIDADES.map((opcao) => (
            <label
              key={opcao}
              className={juntarClasses(
                "flex h-10 cursor-pointer items-center rounded-full px-5 text-sm font-bold transition has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-texto",
                prioridade === opcao ? "bg-texto text-fundo" : "bg-texto/10 hover:bg-texto/20",
              )}
            >
              <input
                type="radio"
                name="prioridade"
                value={opcao}
                checked={prioridade === opcao}
                onChange={() => setPrioridade(opcao)}
                className="sr-only"
              />
              {ROTULO_PRIORIDADE[opcao]}
            </label>
          ))}
        </div>
        {erros.prioridade && (
          <p className="text-sm text-red-600 dark:text-red-400">{erros.prioridade}</p>
        )}
      </fieldset>

      {!editando && (
        <p className="text-sm text-texto/60">
          Toda solicitação nova começa com o status{" "}
          <strong className="text-texto">{ROTULO_STATUS.ABERTA}</strong>.
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-texto/10 pt-6 sm:flex-row sm:justify-end">
        <Link href={destinoCancelar} className={classesBotao("discreto")}>
          Cancelar
        </Link>
        <Botao type="submit" carregando={enviando}>
          {editando ? "Salvar alterações" : "Cadastrar solicitação"}
        </Botao>
      </div>
    </form>
  );
}
