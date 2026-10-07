import type { Perfil, Usuario } from "@/features/auth/tipos";
import { requisicao } from "@/lib/api/cliente";

export function alterarPerfil(id: string, perfil: Perfil) {
  return requisicao<Usuario>(`/usuarios/${id}/perfil`, {
    method: "PATCH",
    body: JSON.stringify({ perfil }),
  });
}
