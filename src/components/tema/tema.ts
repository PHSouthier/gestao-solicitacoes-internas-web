export type Tema = "claro" | "escuro";

export const COOKIE_TEMA = "tema";

export function lerTema(valor: string | undefined): Tema | undefined {
  return valor === "claro" || valor === "escuro" ? valor : undefined;
}
