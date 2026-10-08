import { BuildingIcon, CalendarIcon, HistoryIcon, type LucideIcon, SignalIcon, UserIcon } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { LinkVoltar } from "@/components/link-voltar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buscarUsuarioLogado } from "@/features/auth/sessao";
import { AcoesSolicitacao } from "@/features/solicitacoes/components/acoes-solicitacao";
import { BadgePrioridade, BadgeStatus } from "@/features/solicitacoes/components/badges";
import { LinhaDoTempo } from "@/features/solicitacoes/components/linha-do-tempo";
import { buscarSolicitacao } from "@/features/solicitacoes/servidor";
import {
  podeDecidir,
  podeEditar,
  podeExcluir,
  podeIniciarAnalise,
} from "@/features/solicitacoes/solicitacao";
import { formatarData } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps<"/solicitacoes/[id]">): Promise<Metadata> {
  const solicitacao = await buscarSolicitacao((await params).id);
  return { title: `${solicitacao.codigo} ${solicitacao.titulo}` };
}

function Informacao({
  icone: Icone,
  rotulo,
  children,
}: {
  icone: LucideIcon;
  rotulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <Icone aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-col gap-0.5">
        <dt className="text-sm text-muted-foreground">{rotulo}</dt>
        <dd className="font-medium">{children}</dd>
      </div>
    </div>
  );
}

export default async function PaginaSolicitacao({ params }: PageProps<"/solicitacoes/[id]">) {
  const { id } = await params;
  const [usuario, solicitacao] = await Promise.all([buscarUsuarioLogado(), buscarSolicitacao(id)]);
  if (!usuario) redirect("/login");

  return (
    <div className="flex flex-col gap-8">
      <CabecalhoPagina
        antes={
          <>
            <LinkVoltar href="/solicitacoes">Solicitações</LinkVoltar>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">{solicitacao.codigo}</span>
              <BadgeStatus status={solicitacao.status} />
            </div>
          </>
        }
        titulo={solicitacao.titulo}
      />

      <AcoesSolicitacao
        id={solicitacao.id}
        codigo={solicitacao.codigo}
        podeEditar={podeEditar(usuario, solicitacao)}
        podeExcluir={podeExcluir(usuario, solicitacao)}
        podeIniciarAnalise={podeIniciarAnalise(usuario, solicitacao)}
        podeDecidir={podeDecidir(usuario, solicitacao)}
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Dados da solicitação</CardTitle>
            {solicitacao.criadoPor && (
              <CardDescription>Cadastrada por {solicitacao.criadoPor.nome}.</CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <dl className="grid grid-cols-2 gap-5">
              <Informacao icone={UserIcon} rotulo="Solicitante">
                {solicitacao.nomeSolicitante}
              </Informacao>
              <Informacao icone={BuildingIcon} rotulo="Área">
                {solicitacao.areaComplemento
                  ? `${solicitacao.area.nome}: ${solicitacao.areaComplemento}`
                  : solicitacao.area.nome}
              </Informacao>
              <Informacao icone={SignalIcon} rotulo="Prioridade">
                <BadgePrioridade prioridade={solicitacao.prioridade} />
              </Informacao>
              <Informacao icone={CalendarIcon} rotulo="Data">
                {formatarData(solicitacao.dataSolicitacao)}
              </Informacao>
            </dl>
            <div className="flex flex-col gap-2 border-t pt-6">
              <h2 className="text-sm font-medium text-muted-foreground">Descrição</h2>
              <p className="leading-relaxed whitespace-pre-line">{solicitacao.descricao}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Histórico</CardTitle>
            <HistoryIcon aria-hidden className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <LinhaDoTempo historico={solicitacao.historico} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
