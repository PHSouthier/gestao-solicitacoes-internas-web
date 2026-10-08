"use client";

import { LoaderCircleIcon, PlusIcon, SaveIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AlertaErro } from "@/components/alerta-erro";
import { CampoAreaTexto, CampoTexto } from "@/components/campo-texto";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { errosPorCampo, mensagemDoErro } from "@/lib/api/cliente";
import { atualizarSolicitacao, criarSolicitacao } from "../api";
import {
  type Area,
  type DadosSolicitacao,
  type Prioridade,
  PRIORIDADES,
  ROTULO_PRIORIDADE,
  ROTULO_STATUS,
  type SolicitacaoDetalhe,
} from "../solicitacao";

interface FormularioSolicitacaoProps {
  areas: Area[];
  hoje: string;
  nomePadrao: string;
  solicitacao?: SolicitacaoDetalhe;
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
  const [erros, setErros] = useState<Record<string, string>>({});
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

    setErros({});
    setMensagem(null);
    setEnviando(true);

    try {
      const salva = solicitacao
        ? await atualizarSolicitacao(solicitacao.id, dados)
        : await criarSolicitacao(dados);
      toast.success(solicitacao ? "Alterações salvas." : `${salva.codigo} cadastrada.`);
      router.push(`/solicitacoes/${salva.id}`);
      router.refresh();
    } catch (erro) {
      setEnviando(false);
      const porCampo = errosPorCampo(erro);
      if (Object.keys(porCampo).length > 0) setErros(porCampo);
      else setMensagem(mensagemDoErro(erro));
    }
  }

  return (
    <form noValidate onSubmit={aoEnviar}>
      <Card>
        <CardContent className="flex flex-col gap-6">
          {mensagem && <AlertaErro>{mensagem}</AlertaErro>}

          <CampoTexto
            id="titulo"
            name="titulo"
            rotulo="Título"
            placeholder="Ex.: Notebook para o novo vendedor"
            defaultValue={solicitacao?.titulo}
            maxLength={150}
            erro={erros.titulo}
          />

          <CampoAreaTexto
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
            <CampoTexto
              id="nomeSolicitante"
              name="nomeSolicitante"
              rotulo="Solicitante"
              dica="Quem está pedindo. Pode ser outra pessoa."
              defaultValue={solicitacao?.nomeSolicitante ?? nomePadrao}
              maxLength={120}
              erro={erros.nomeSolicitante}
            />
            <CampoTexto
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
            <Field data-invalid={erros.areaId ? true : undefined}>
              <FieldLabel htmlFor="areaId">Área</FieldLabel>
              <Select value={areaId} onValueChange={setAreaId}>
                <SelectTrigger id="areaId" className="w-full" aria-invalid={erros.areaId ? true : undefined}>
                  <SelectValue placeholder="Escolha a área" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area.id} value={String(area.id)}>
                      {area.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{erros.areaId}</FieldError>
            </Field>
            {areaEscolhida?.exigeComplemento && (
              <CampoTexto
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

          <Field data-invalid={erros.prioridade ? true : undefined}>
            <FieldLabel>Prioridade</FieldLabel>
            <ToggleGroup
              type="single"
              variant="outline"
              aria-label="Prioridade"
              value={prioridade}
              onValueChange={(valor) => valor && setPrioridade(valor as Prioridade)}
            >
              {PRIORIDADES.map((opcao) => (
                <ToggleGroupItem
                  key={opcao}
                  value={opcao}
                  className="px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {ROTULO_PRIORIDADE[opcao]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {!editando && (
              <FieldDescription>
                Toda solicitação nova começa com o status {ROTULO_STATUS.ABERTA}.
              </FieldDescription>
            )}
            <FieldError>{erros.prioridade}</FieldError>
          </Field>
        </CardContent>

        <CardFooter className="flex-col-reverse gap-2 border-t sm:flex-row sm:justify-end">
          <Button asChild variant="ghost">
            <Link href={destinoCancelar}>Cancelar</Link>
          </Button>
          <Button type="submit" disabled={enviando}>
            {enviando ? <LoaderCircleIcon className="animate-spin" /> : editando ? <SaveIcon /> : <PlusIcon />}
            {editando ? "Salvar alterações" : "Cadastrar solicitação"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
