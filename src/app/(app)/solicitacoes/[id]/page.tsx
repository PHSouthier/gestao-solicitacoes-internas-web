import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { LinkVoltar } from "@/components/link-voltar";
import { buscarUsuarioLogado } from "@/features/auth/sessao";
import { AcoesSolicitacao } from "@/features/solicitacoes/components/acoes-solicitacao";
import { BadgePrioridade, BadgeStatus } from "@/features/solicitacoes/components/badges";
import { LinhaDoTempo } from "@/features/solicitacoes/components/linha-do-tempo";
import {
  podeDecidir,
  podeEditar,
  podeExcluir,
  podeIniciarAnalise,
} from "@/features/solicitacoes/permissoes";
import { buscarSolicitacao } from "@/features/solicitacoes/servidor";
import { formatarData } from "@/lib/datas";

export async function generateMetadata({
  params,
}: PageProps<"/solicitacoes/[id]">): Promise<Metadata> {
  const solicitacao = await buscarSolicitacao((await params).id);
  return { title: `${solicitacao.codigo} ${solicitacao.titulo}` };
}

function Informacao({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm text-texto/60">{rotulo}</dt>
      <dd className="font-bold">{children}</dd>
    </div>
  );
}

export default async function PaginaSolicitacao({ params }: PageProps<"/solicitacoes/[id]">) {
  const { id } = await params;
  const [usuario, solicitacao] = await Promise.all([buscarUsuarioLogado(), buscarSolicitacao(id)]);
  if (!usuario) redirect("/login");

  return (
    <div className="flex flex-col gap-10">
      <CabecalhoPagina
        antes={
          <>
            <LinkVoltar href="/solicitacoes">Solicitações</LinkVoltar>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold text-texto/60">{solicitacao.codigo}</span>
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

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-8">
          <dl className="grid grid-cols-2 gap-6 rounded-xl bg-texto/5 p-6">
            <Informacao rotulo="Solicitante">{solicitacao.nomeSolicitante}</Informacao>
            <Informacao rotulo="Área">
              {solicitacao.areaComplemento
                ? `${solicitacao.area.nome}: ${solicitacao.areaComplemento}`
                : solicitacao.area.nome}
            </Informacao>
            <Informacao rotulo="Prioridade">
              <BadgePrioridade prioridade={solicitacao.prioridade} />
            </Informacao>
            <Informacao rotulo="Data">{formatarData(solicitacao.dataSolicitacao)}</Informacao>
          </dl>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold">Descrição</h2>
            <p className="leading-relaxed whitespace-pre-line text-texto/90">
              {solicitacao.descricao}
            </p>
            {solicitacao.criadoPor && (
              <p className="text-sm text-texto/60">
                Cadastrada por {solicitacao.criadoPor.nome}.
              </p>
            )}
          </section>
        </div>

        <section className="flex flex-col gap-5">
          <h2 className="text-lg font-bold">Histórico</h2>
          <LinhaDoTempo historico={solicitacao.historico} />
        </section>
      </div>
    </div>
  );
}
