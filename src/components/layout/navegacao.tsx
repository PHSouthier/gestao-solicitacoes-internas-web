"use client";

import { HouseIcon, ListChecksIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const ICONES = { inicio: HouseIcon, solicitacoes: ListChecksIcon, usuarios: UsersIcon };

export interface ItemNavegacao {
  href: string;
  rotulo: string;
  icone: keyof typeof ICONES;
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
        const Icone = ICONES[item.icone];
        return (
          <Button
            key={item.href}
            asChild
            variant={ativo ? "secondary" : "ghost"}
            size="sm"
            className={ativo ? "" : "text-muted-foreground"}
          >
            <Link href={item.href} aria-current={ativo ? "page" : undefined}>
              <Icone />
              {item.rotulo}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
