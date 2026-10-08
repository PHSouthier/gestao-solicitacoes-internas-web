"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COOKIE_TEMA, lerTema, type Tema } from "./tema";

const UM_ANO = 60 * 60 * 24 * 365;

function temaAtual(): Tema {
  const definido = lerTema(document.documentElement.dataset.tema);
  if (definido) return definido;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro";
}

export function AlternarTema() {
  function alternar() {
    const novo: Tema = temaAtual() === "escuro" ? "claro" : "escuro";
    document.documentElement.dataset.tema = novo;
    document.cookie = `${COOKIE_TEMA}=${novo}; path=/; max-age=${UM_ANO}; samesite=lax`;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={alternar}
      aria-label="Alternar entre tema claro e escuro"
      title="Alternar entre tema claro e escuro"
    >
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </Button>
  );
}
