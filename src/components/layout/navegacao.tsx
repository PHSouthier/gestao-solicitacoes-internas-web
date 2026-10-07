"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { juntarClasses } from "@/lib/classes";

export interface ItemNavegacao {
  href: string;
  rotulo: string;
}

function estaAtivo(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navegacao({ itens }: { itens: ItemNavegacao[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Principal" className="-mx-1 flex gap-1 overflow-x-auto px-1">
      {itens.map((item) => {
        const ativo = estaAtivo(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={ativo ? "page" : undefined}
            className={juntarClasses(
              "flex h-9 items-center rounded-full px-4 text-sm font-bold whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-texto",
              ativo ? "bg-texto text-fundo" : "text-texto/70 hover:bg-texto/10 hover:text-texto",
            )}
          >
            {item.rotulo}
          </Link>
        );
      })}
    </nav>
  );
}
