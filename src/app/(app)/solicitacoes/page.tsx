import type { Metadata } from "next";
import Link from "next/link";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { EstadoVazio } from "@/components/estado-vazio";
import { Paginacao } from "@/components/paginacao";
import { classesBotao } from "@/components/ui/botao";
import { FiltrosSolicitacoes } from "@/features/solicitacoes/components/filtros-solicitacoes";
import { TabelaSolicitacoes } from "@/features/solicitacoes/components/tabela-solicitacoes";
import { lerFiltros, paraUrl, temFiltroAtivo } from "@/features/solicitacoes/filtros";
import { listarAreas, listarSolicitacoes } from "@/features/solicitacoes/servidor";

export const metadata: Metadata = { title: "Solicitações" };

export default async function PaginaSolicitacoes({
  searchParams,
}: PageProps<"/solicitacoes">) {
  const filtros = lerFiltros(await searchParams);
  const [pagina, areas] = await Promise.all([listarSolicitacoes(filtros), listarAreas()]);
  const { total, totalPaginas } = pagina.meta;

  return (
    <div className="flex flex-col gap-8">
      <CabecalhoPagina
        titulo="Solicitações"
        descricao={
          total === 1 ? "1 solicitação encontrada." : `${total} solicitações encontradas.`
        }
        acoes={
          <Link href="/solicitacoes/nova" className={classesBotao()}>
            Nova solicitação
          </Link>
        }
      />

      <FiltrosSolicitacoes filtros={filtros} areas={areas} />

      {pagina.data.length > 0 ? (
        <>
          <TabelaSolicitacoes solicitacoes={pagina.data} />
          <Paginacao
            pagina={pagina.meta.pagina}
            totalPaginas={totalPaginas}
            hrefDaPagina={(numero) => `/solicitacoes?${paraUrl({ ...filtros, pagina: numero })}`}
          />
        </>
      ) : temFiltroAtivo(filtros) ? (
        <EstadoVazio
          titulo="Nada encontrado"
          descricao="Nenhuma solicitação combina com a busca e os filtros. Tente tirar algum filtro."
        />
      ) : (
        <EstadoVazio
          titulo="Nenhuma solicitação ainda"
          descricao="Quando alguém cadastrar uma solicitação, ela aparece aqui."
        >
          <Link href="/solicitacoes/nova" className={classesBotao()}>
            Cadastrar a primeira
          </Link>
        </EstadoVazio>
      )}
    </div>
  );
}
