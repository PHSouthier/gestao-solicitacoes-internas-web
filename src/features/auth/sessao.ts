import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { lerErro } from "@/lib/api/erros";
import { COOKIE_SESSAO, requisicaoServidor } from "@/lib/api/servidor";
import type { Usuario } from "./tipos";

export const buscarUsuarioLogado = cache(async (): Promise<Usuario | null> => {
  const cookieStore = await cookies();
  if (!cookieStore.has(COOKIE_SESSAO)) {
    return null;
  }

  const resposta = await requisicaoServidor("/auth/me");
  if (resposta.status === 401) {
    return null;
  }
  if (!resposta.ok) {
    throw await lerErro(resposta);
  }
  return (await resposta.json()) as Usuario;
});
