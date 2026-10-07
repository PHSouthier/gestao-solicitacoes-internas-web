"use client";

import { COOKIE_TEMA, lerTema, type Tema } from "./tema";

const UM_ANO = 60 * 60 * 24 * 365;

function temaAtual(): Tema {
  const definido = lerTema(document.documentElement.dataset.tema);
  if (definido) return definido;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "escuro"
    : "claro";
}

export function AlternarTema() {
  function alternar() {
    const novo: Tema = temaAtual() === "escuro" ? "claro" : "escuro";
    document.documentElement.dataset.tema = novo;
    document.cookie = `${COOKIE_TEMA}=${novo}; path=/; max-age=${UM_ANO}; samesite=lax`;
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label="Alternar entre tema claro e escuro"
      title="Alternar entre tema claro e escuro"
      className="grid size-9 shrink-0 place-items-center rounded-full text-texto/70 transition hover:bg-texto/10 hover:text-texto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-texto"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5 dark:hidden"
      >
        <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        className="hidden size-5 dark:block"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
