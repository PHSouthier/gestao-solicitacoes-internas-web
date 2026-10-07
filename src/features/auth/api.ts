import { requisicao } from "@/lib/api/cliente";
import type { Cadastro, Credenciais, Usuario } from "./tipos";

export const URL_LOGIN_GOOGLE = "/api/v1/auth/google";

export function entrar(credenciais: Credenciais): Promise<Usuario> {
  return requisicao<Usuario>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credenciais),
  });
}

export function sair(): Promise<void> {
  return requisicao<void>("/auth/logout", { method: "POST" });
}

export function cadastrar(dados: Cadastro): Promise<Usuario> {
  return requisicao<Usuario>("/usuarios", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}
