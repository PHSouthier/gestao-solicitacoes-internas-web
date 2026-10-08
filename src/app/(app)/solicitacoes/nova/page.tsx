import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { LinkVoltar } from "@/components/link-voltar";
import { buscarUsuarioLogado } from "@/features/auth/sessao";
import { FormularioSolicitacao } from "@/features/solicitacoes/components/formulario-solicitacao";
import { listarAreas } from "@/features/solicitacoes/servidor";
import { hojeIso } from "@/lib/utils";

export const metadata: Metadata = { title: "Nova solicitação" };

export default async function PaginaNovaSolicitacao() {
  const usuario = await buscarUsuarioLogado();
  if (!usuario) redirect("/login");
  const areas = await listarAreas();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10">
      <CabecalhoPagina
        antes={<LinkVoltar href="/solicitacoes">Solicitações</LinkVoltar>}
        titulo="Nova solicitação"
        descricao="Preencha os dados do pedido. A equipe de análise acompanha a partir daqui."
      />
      <FormularioSolicitacao areas={areas} hoje={hojeIso()} nomePadrao={usuario.nome} />
    </div>
  );
}
