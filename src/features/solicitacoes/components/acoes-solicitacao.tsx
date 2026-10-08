"use client";

import { CheckIcon, LoaderCircleIcon, PencilIcon, PlayIcon, Trash2Icon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AlertaErro } from "@/components/alerta-erro";
import { CampoAreaTexto } from "@/components/campo-texto";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const TEXTOS_DECISAO: Record<
  Decisao,
  { titulo: string; botao: string; descricao: string; sucesso: string }
> = {
  APROVADA: {
    titulo: "Aprovar solicitação",
    botao: "Aprovar",
    descricao: "Explique o motivo da aprovação. O comentário fica no histórico.",
    sucesso: "Solicitação aprovada.",
  },
  REJEITADA: {
    titulo: "Rejeitar solicitação",
    botao: "Rejeitar",
    descricao: "Explique o motivo da rejeição. O comentário fica no histórico.",
    sucesso: "Solicitação rejeitada.",
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
  const [iniciando, setIniciando] = useState(false);
  const [decisao, setDecisao] = useState<Decisao | null>(null);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [erroComentario, setErroComentario] = useState<string>();
  const [mensagemDialogo, setMensagemDialogo] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (!podeEditar && !podeExcluir && !podeIniciarAnalise && !podeDecidir) return null;

  async function aoIniciarAnalise() {
    setIniciando(true);
    try {
      await iniciarAnalise(id);
      toast.success("Análise iniciada.");
      router.refresh();
    } catch (erro) {
      toast.error(mensagemDoErro(erro));
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
      toast.success(TEXTOS_DECISAO[decisao].sucesso);
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
      toast.success(`${codigo} excluída.`);
      router.push("/solicitacoes");
      router.refresh();
    } catch (erro) {
      setMensagemDialogo(mensagemDoErro(erro));
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {podeIniciarAnalise && (
        <Button variant="outline" disabled={iniciando} onClick={aoIniciarAnalise}>
          {iniciando ? <LoaderCircleIcon className="animate-spin" /> : <PlayIcon />}
          Iniciar análise
        </Button>
      )}
      {podeDecidir && (
        <>
          <Button onClick={() => abrirDecisao("APROVADA")}>
            <CheckIcon />
            Aprovar
          </Button>
          <Button variant="destructive" onClick={() => abrirDecisao("REJEITADA")}>
            <XIcon />
            Rejeitar
          </Button>
        </>
      )}
      {podeEditar && (
        <Button asChild variant="outline">
          <Link href={`/solicitacoes/${id}/editar`}>
            <PencilIcon />
            Editar
          </Link>
        </Button>
      )}
      {podeExcluir && (
        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={() => {
            setMensagemDialogo(null);
            setConfirmandoExclusao(true);
          }}
        >
          <Trash2Icon />
          Excluir
        </Button>
      )}

      <Dialog open={decisao !== null} onOpenChange={(aberto) => !aberto && setDecisao(null)}>
        <DialogContent>
          {decisao && (
            <form noValidate onSubmit={aoDecidir} className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>{TEXTOS_DECISAO[decisao].titulo}</DialogTitle>
                <DialogDescription>{TEXTOS_DECISAO[decisao].descricao}</DialogDescription>
              </DialogHeader>
              {mensagemDialogo && <AlertaErro>{mensagemDialogo}</AlertaErro>}
              <CampoAreaTexto
                id="comentario"
                name="comentario"
                rotulo="Comentário"
                maxLength={1000}
                rows={4}
                erro={erroComentario}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={enviando}
                  variant={decisao === "REJEITADA" ? "destructive" : "default"}
                >
                  {enviando ? (
                    <LoaderCircleIcon className="animate-spin" />
                  ) : decisao === "REJEITADA" ? (
                    <XIcon />
                  ) : (
                    <CheckIcon />
                  )}
                  {TEXTOS_DECISAO[decisao].botao}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmandoExclusao} onOpenChange={setConfirmandoExclusao}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {codigo}?</AlertDialogTitle>
            <AlertDialogDescription>
              A solicitação sai da lista e do painel. Essa ação não pode ser desfeita por aqui.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {mensagemDialogo && <AlertaErro>{mensagemDialogo}</AlertaErro>}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button variant="destructive" disabled={enviando} onClick={aoExcluir}>
              {enviando ? <LoaderCircleIcon className="animate-spin" /> : <Trash2Icon />}
              Excluir solicitação
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
