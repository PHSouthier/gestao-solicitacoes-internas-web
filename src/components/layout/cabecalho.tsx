import Link from "next/link";
import { Marca } from "@/components/marca";
import { AlternarTema } from "@/components/tema/alternar-tema";
import { Avatar } from "@/components/ui/avatar";
import { BotaoSair } from "@/features/auth/components/botao-sair";
import { ROTULO_PERFIL, type Usuario } from "@/features/auth/usuario";
import { type ItemNavegacao, Navegacao } from "./navegacao";

function itensDoMenu(usuario: Usuario): ItemNavegacao[] {
  const itens: ItemNavegacao[] = [
    { href: "/", rotulo: "Início" },
    { href: "/solicitacoes", rotulo: "Solicitações" },
  ];
  if (usuario.perfil === "ADMINISTRADOR") {
    itens.push({ href: "/usuarios", rotulo: "Usuários" });
  }
  return itens;
}

export function Cabecalho({ usuario }: { usuario: Usuario }) {
  return (
    <header className="border-b border-texto/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-8 md:h-16 md:flex-row md:items-center md:gap-8 md:py-0">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-texto"
          >
            <Marca />
          </Link>
          <div className="flex items-center gap-2 md:hidden">
            <AlternarTema />
            <Avatar nome={usuario.nome} />
            <BotaoSair />
          </div>
        </div>

        <div className="md:flex-1">
          <Navegacao itens={itensDoMenu(usuario)} />
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <AlternarTema />
          <div className="text-right">
            <p className="text-sm leading-tight font-bold">{usuario.nome}</p>
            <p className="text-xs text-texto/60">{ROTULO_PERFIL[usuario.perfil]}</p>
          </div>
          <Avatar nome={usuario.nome} />
          <BotaoSair />
        </div>
      </div>
    </header>
  );
}
