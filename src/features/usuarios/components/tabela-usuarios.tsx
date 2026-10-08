"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alerta } from "@/components/ui/alerta";
import { Avatar } from "@/components/ui/avatar";
import { type Perfil, ROTULO_PERFIL, type Usuario } from "@/features/auth/usuario";
import { mensagemDoErro } from "@/lib/api/cliente";
import { formatarData } from "@/lib/utils";
import { alterarPerfil } from "../api";

const PERFIS: Perfil[] = ["SOLICITANTE", "ANALISTA", "ADMINISTRADOR"];

export function TabelaUsuarios({
  usuarios,
  idUsuarioLogado,
}: {
  usuarios: Usuario[];
  idUsuarioLogado: string;
}) {
  const router = useRouter();
  const [salvando, setSalvando] = useState<string | null>(null);
  const [aviso, setAviso] = useState<{ tipo: "erro" | "ok"; texto: string } | null>(null);

  async function aoMudarPerfil(usuario: Usuario, perfil: Perfil) {
    setSalvando(usuario.id);
    setAviso(null);
    try {
      await alterarPerfil(usuario.id, perfil);
      setAviso({
        tipo: "ok",
        texto: `${usuario.nome} agora é ${ROTULO_PERFIL[perfil]}.`,
      });
      router.refresh();
    } catch (erro) {
      setAviso({ tipo: "erro", texto: mensagemDoErro(erro) });
    } finally {
      setSalvando(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {aviso?.tipo === "erro" && <Alerta>{aviso.texto}</Alerta>}
      <p role="status" className="text-sm font-bold text-green-700 dark:text-verde">
        {aviso?.tipo === "ok" ? aviso.texto : ""}
      </p>

      <ul className="divide-y divide-texto/10 rounded-xl ring-1 ring-texto/10">
        {usuarios.map((usuario) => {
          const ehVoce = usuario.id === idUsuarioLogado;
          return (
            <li key={usuario.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar nome={usuario.nome} />
                <div className="min-w-0">
                  <p className="truncate font-bold">
                    {usuario.nome}
                    {ehVoce && <span className="ml-2 text-sm font-medium text-texto/60">(você)</span>}
                  </p>
                  <p className="truncate text-sm text-texto/60">
                    {usuario.email}, desde {formatarData(usuario.criadoEm)}
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-3 text-sm">
                <span className="sr-only">Perfil de {usuario.nome}</span>
                <select
                  value={usuario.perfil}
                  disabled={ehVoce || salvando === usuario.id}
                  title={ehVoce ? "Você não pode alterar o seu próprio perfil." : undefined}
                  onChange={(e) => aoMudarPerfil(usuario, e.target.value as Perfil)}
                  className="h-10 rounded-full border border-texto/20 bg-fundo px-4 text-sm font-bold text-texto outline-none transition hover:border-texto/50 focus:border-texto focus:ring-1 focus:ring-texto disabled:opacity-60"
                >
                  {PERFIS.map((perfil) => (
                    <option key={perfil} value={perfil}>
                      {ROTULO_PERFIL[perfil]}
                    </option>
                  ))}
                </select>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
