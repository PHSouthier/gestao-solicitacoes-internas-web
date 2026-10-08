import Link from "next/link";
import { Marca } from "@/components/marca";
import { AlternarTema } from "@/components/tema/alternar-tema";
import { MenuUsuario } from "@/features/auth/components/menu-usuario";
import type { Usuario } from "@/features/auth/usuario";
import { type ItemNavegacao, Navegacao } from "./navegacao";

function itensDoMenu(usuario: Usuario): ItemNavegacao[] {
  const itens: ItemNavegacao[] = [
    { href: "/", rotulo: "Início", icone: "inicio" },
    { href: "/solicitacoes", rotulo: "Solicitações", icone: "solicitacoes" },
  ];
  if (usuario.perfil === "ADMINISTRADOR") {
    itens.push({ href: "/usuarios", rotulo: "Usuários", icone: "usuarios" });
  }
  return itens;
}

export function Cabecalho({ usuario }: { usuario: Usuario }) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:px-8 md:h-16 md:flex-row md:items-center md:gap-8 md:py-0">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
            <Marca />
          </Link>
          <div className="flex items-center gap-1 md:hidden">
            <AlternarTema />
            <MenuUsuario usuario={usuario} />
          </div>
        </div>

        <div className="md:flex-1">
          <Navegacao itens={itensDoMenu(usuario)} />
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <AlternarTema />
          <MenuUsuario usuario={usuario} />
        </div>
      </div>
    </header>
  );
}
