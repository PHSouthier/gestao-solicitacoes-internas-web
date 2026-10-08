import { BuildingIcon, PlusIcon, SignalIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { Button } from "@/components/ui/button";
import { buscarUsuarioLogado } from "@/features/auth/sessao";
import { ROTULO_PERFIL } from "@/features/auth/usuario";
import { GraficoBarras } from "@/features/dashboard/components/grafico-barras";
import { Indicadores } from "@/features/dashboard/components/indicadores";
import { UltimasSolicitacoes } from "@/features/dashboard/components/ultimas-solicitacoes";
import { buscarResumo } from "@/features/dashboard/servidor";
import { listarUltimasSolicitacoes } from "@/features/solicitacoes/servidor";
import { PRIORIDADES, ROTULO_PRIORIDADE } from "@/features/solicitacoes/solicitacao";
import { saudacao } from "@/lib/utils";

export default async function PaginaInicial() {
  const usuario = await buscarUsuarioLogado();
  if (!usuario) redirect("/login");

  const [resumo, ultimas] = await Promise.all([buscarResumo(), listarUltimasSolicitacoes()]);

  return (
    <div className="flex flex-col gap-8">
      <CabecalhoPagina
        titulo={`${saudacao()}, ${usuario.nome.split(" ")[0]}.`}
        descricao={
          <>
            Você entrou como{" "}
            <strong className="font-semibold text-foreground">{ROTULO_PERFIL[usuario.perfil]}</strong>.
          </>
        }
        acoes={
          <Button asChild>
            <Link href="/solicitacoes/nova">
              <PlusIcon />
              Nova solicitação
            </Link>
          </Button>
        }
      />

      <Indicadores resumo={resumo} />

      <div className="grid gap-4 lg:grid-cols-2">
        <GraficoBarras
          titulo="Por prioridade"
          icone={SignalIcon}
          vazio="Sem solicitações para mostrar."
          itens={PRIORIDADES.map((prioridade) => ({
            rotulo: ROTULO_PRIORIDADE[prioridade],
            valor: resumo.porPrioridade[prioridade],
          }))}
        />
        <GraficoBarras
          titulo="Por área"
          icone={BuildingIcon}
          vazio="Sem solicitações para mostrar."
          itens={resumo.porArea.map((area) => ({ rotulo: area.nome, valor: area.total }))}
        />
      </div>

      <UltimasSolicitacoes solicitacoes={ultimas.data} />
    </div>
  );
}
