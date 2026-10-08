"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alerta } from "@/components/ui/alerta";
import { Botao, classesBotao } from "@/components/ui/botao";
import { AreaTexto } from "@/components/ui/campo";
import { Dialogo } from "@/components/ui/dialogo";
import { errosPorCampo, mensagemDoErro } from "@/lib/api/cliente";
import { decidir, excluirSolicitacao, iniciarAnalise } from "../api";
import type { Decisao } from "../solicitacao";

interface AcoesSolicitacaoProps {
  id: string;
  codigo: string;
  podeEditar: boolean;
  podeExcluir: boolean;
  podeIniciarAnalise: boolean;
  podeDecidir: boolean;
}

const TEXTOS_DECISAO: Record<Decisao, { titulo: string; botao: string; descricao: string }> = {
  APROVADA: {
    titulo: "Aprovar solicitação",
    botao: "Aprovar",
    descricao: "Explique o motivo da aprovação. O comentário fica no histórico.",
  },
  REJEITADA: {
    titulo: "Rejeitar solicitação",
    botao: "Rejeitar",
    descricao: "Explique o motivo da rejeição. O comentário fica no histórico.",
  },
};

export function AcoesSolicitacao({
  id,
  codigo,
  podeEditar,
  podeExcluir,
  podeIniciarAnalise,
  podeDecidir,
}: AcoesSolicitacaoProps) {
  const router = useRouter();
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [iniciando, setIniciando] = useState(false);
  const [decisao, setDecisao] = useState<Decisao | null>(null);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [erroComentario, setErroComentario] = useState<string>();
  const [mensagemDialogo, setMensagemDialogo] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (!podeEditar && !podeExcluir && !podeIniciarAnalise && !podeDecidir) return null;

  async function aoIniciarAnalise() {
    setMensagem(null);
    setIniciando(true);
    try {
      await iniciarAnalise(id);
      router.refresh();
    } catch (erro) {
      setMensagem(mensagemDoErro(erro));
    } finally {
      setIniciando(false);
    }
  }

  function abrirDecisao(tipo: Decisao) {
    setErroComentario(undefined);
    setMensagemDialogo(null);
    setDecisao(tipo);
  }

  async function aoDecidir(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!decisao) return;
    const comentario = String(new FormData(evento.currentTarget).get("comentario")).trim();
    setErroComentario(undefined);
    setMensagemDialogo(null);
    setEnviando(true);
    try {
      await decidir(id, decisao, comentario);
      setDecisao(null);
      router.refresh();
    } catch (erro) {
      const porCampo = errosPorCampo(erro);
      if (porCampo.comentario) setErroComentario(porCampo.comentario);
      else setMensagemDialogo(mensagemDoErro(erro));
    } finally {
      setEnviando(false);
    }
  }

  async function aoExcluir() {
    setEnviando(true);
    setMensagemDialogo(null);
    try {
      await excluirSolicitacao(id);
      router.push("/solicitacoes");
      router.refresh();
    } catch (erro) {
      setMensagemDialogo(mensagemDoErro(erro));
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {mensagem && <Alerta>{mensagem}</Alerta>}

      <div className="flex flex-wrap gap-3">
        {podeIniciarAnalise && (
          <Botao variante="contorno" tamanho="pequeno" carregando={iniciando} onClick={aoIniciarAnalise}>
            Iniciar análise
          </Botao>
        )}
        {podeDecidir && (
          <>
            <Botao tamanho="pequeno" onClick={() => abrirDecisao("APROVADA")}>
              Aprovar
            </Botao>
            <Botao variante="perigo" tamanho="pequeno" onClick={() => abrirDecisao("REJEITADA")}>
              Rejeitar
            </Botao>
          </>
        )}
        {podeEditar && (
          <Link href={`/solicitacoes/${id}/editar`} className={classesBotao("contorno", "pequeno")}>
            Editar
          </Link>
        )}
        {podeExcluir && (
          <Botao
            variante="discreto"
            tamanho="pequeno"
            onClick={() => {
              setMensagemDialogo(null);
              setConfirmandoExclusao(true);
            }}
          >
            Excluir
          </Botao>
        )}
      </div>

      <Dialogo
        aberto={decisao !== null}
        aoFechar={() => setDecisao(null)}
        titulo={decisao ? TEXTOS_DECISAO[decisao].titulo : ""}
        descricao={decisao ? TEXTOS_DECISAO[decisao].descricao : undefined}
      >
        <form noValidate onSubmit={aoDecidir} className="flex flex-col gap-5">
          {mensagemDialogo && <Alerta>{mensagemDialogo}</Alerta>}
          <AreaTexto
            id="comentario"
            name="comentario"
            rotulo="Comentário"
            maxLength={1000}
            rows={4}
            autoFocus
            erro={erroComentario}
          />
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Botao variante="discreto" onClick={() => setDecisao(null)}>
              Cancelar
            </Botao>
            <Botao
              type="submit"
              variante={decisao === "REJEITADA" ? "perigo" : "primario"}
              carregando={enviando}
            >
              {decisao ? TEXTOS_DECISAO[decisao].botao : ""}
            </Botao>
          </div>
        </form>
      </Dialogo>

      <Dialogo
        aberto={confirmandoExclusao}
        aoFechar={() => setConfirmandoExclusao(false)}
        titulo={`Excluir ${codigo}?`}
        descricao="A solicitação sai da lista e do painel. Essa ação não pode ser desfeita por aqui."
      >
        {mensagemDialogo && <Alerta>{mensagemDialogo}</Alerta>}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Botao variante="discreto" onClick={() => setConfirmandoExclusao(false)}>
            Cancelar
          </Botao>
          <Botao variante="perigo" carregando={enviando} onClick={aoExcluir}>
            Excluir solicitação
          </Botao>
        </div>
      </Dialogo>
    </div>
  );
}
