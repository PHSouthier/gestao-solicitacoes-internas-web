import "server-only";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { lerErro } from "./erros";

const API_URL = process.env.API_INTERNAL_URL ?? "http://localhost:3001";

export const COOKIE_SESSAO = "access_token";

export async function requisicaoServidor(caminho: string): Promise<Response> {
  const cookieStore = await cookies();
  return fetch(`${API_URL}/api/v1${caminho}`, {
    headers: { cookie: cookieStore.toString() },
    cache: "no-store",
  });
}

export async function buscarDaApi<T>(caminho: string): Promise<T> {
  const resposta = await requisicaoServidor(caminho);
  if (resposta.status === 401) redirect("/login");
  if (resposta.status === 404) notFound();
  if (!resposta.ok) throw await lerErro(resposta);
  return (await resposta.json()) as T;
}
