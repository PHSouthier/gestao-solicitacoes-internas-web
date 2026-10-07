import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { EstadoVazio } from "@/components/estado-vazio";
import { LinkVoltar } from "@/components/link-voltar";
import { classesBotao } from "@/components/ui/botao";
import { buscarUsuarioLogado } from "@/features/auth/sessao";
import { FormularioSolicitacao } from "@/features/solicitacoes/components/formulario-solicitacao";
import { podeEditar } from "@/features/solicitacoes/permissoes";
import { buscarSolicitacao, listarAreas } from "@/features/solicitacoes/servidor";
import { hojeIso } from "@/lib/datas";

export const metadata: Metadata = { title: "Editar solicitação" };

export default async function PaginaEditarSolicitacao({
  params,
}: PageProps<"/solicitacoes/[id]/editar">) {
  const { id } = await params;
  const [usuario, solicitacao, areas] = await Promise.all([
    buscarUsuarioLogado(),
    buscarSolicitacao(id),
    listarAreas(),
  ]);
  if (!usuario) redirect("/login");

  const voltar = `/solicitacoes/${solicitacao.id}`;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10">
      <CabecalhoPagina
        antes={<LinkVoltar href={voltar}>{solicitacao.codigo}</LinkVoltar>}
        titulo="Editar solicitação"
      />
      {podeEditar(usuario, solicitacao) ? (
        <FormularioSolicitacao
          areas={areas}
          hoje={hojeIso()}
          nomePadrao={usuario.nome}
          solicitacao={solicitacao}
        />
      ) : (
        <EstadoVazio
          titulo="Esta solicitação não pode ser editada"
          descricao="Solicitações aprovadas ou rejeitadas ficam travadas. Quem tem perfil Solicitante só edita as que cadastrou."
        >
          <Link href={voltar} className={classesBotao("contorno")}>
            Voltar para a solicitação
          </Link>
        </EstadoVazio>
      )}
    </div>
  );
}
