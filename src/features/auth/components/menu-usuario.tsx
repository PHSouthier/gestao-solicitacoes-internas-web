"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sair } from "../api";
import { iniciais, ROTULO_PERFIL, type Usuario } from "../usuario";

export function MenuUsuario({ usuario }: { usuario: Usuario }) {
  const router = useRouter();

  async function aoSair() {
    try {
      await sair();
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto gap-3 px-2 py-1.5" aria-label="Menu do usuário">
          <span className="hidden text-right sm:block">
            <span className="block text-sm leading-tight font-semibold">{usuario.nome}</span>
            <span className="block text-xs text-muted-foreground">{ROTULO_PERFIL[usuario.perfil]}</span>
          </span>
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
              {iniciais(usuario.nome)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="font-semibold">{usuario.nome}</p>
          <p className="truncate text-xs text-muted-foreground">{usuario.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={aoSair}>
          <LogOutIcon />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
