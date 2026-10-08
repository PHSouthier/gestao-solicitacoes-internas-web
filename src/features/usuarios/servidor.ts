import "server-only";
import type { Usuario } from "@/features/auth/usuario";
import { buscarDaApi } from "@/lib/api/servidor";

export function listarUsuarios() {
  return buscarDaApi<Usuario[]>("/usuarios");
}
