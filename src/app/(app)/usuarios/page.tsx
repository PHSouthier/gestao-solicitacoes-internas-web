import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { buscarUsuarioLogado } from "@/features/auth/sessao";
import { TabelaUsuarios } from "@/features/usuarios/components/tabela-usuarios";
import { listarUsuarios } from "@/features/usuarios/servidor";

export const metadata: Metadata = { title: "Usuários" };

export default async function PaginaUsuarios() {
  const usuario = await buscarUsuarioLogado();
  if (!usuario) redirect("/login");
  if (usuario.perfil !== "ADMINISTRADOR") notFound();

  const usuarios = await listarUsuarios();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10">
      <CabecalhoPagina
        titulo="Usuários"
        descricao="Defina o que cada pessoa pode fazer. O seu próprio perfil não pode ser alterado."
      />
      <TabelaUsuarios usuarios={usuarios} idUsuarioLogado={usuario.id} />
    </div>
  );
}
