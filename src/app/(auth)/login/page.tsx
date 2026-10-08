import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FormularioLogin } from "@/features/auth/components/formulario-login";
import { buscarUsuarioLogado } from "@/features/auth/sessao";
import { mensagemErroLogin } from "@/features/auth/usuario";

export const metadata: Metadata = { title: "Entrar" };

export default async function PaginaLogin({ searchParams }: PageProps<"/login">) {
  const usuario = await buscarUsuarioLogado().catch(() => null);
  if (usuario) redirect("/");

  const { erro } = await searchParams;
  const mensagem = mensagemErroLogin(typeof erro === "string" ? erro : undefined);

  return (
    <>
      <h1 className="text-4xl font-black tracking-tight">Entrar</h1>
      <p className="mt-2 mb-8 text-texto/60">
        Use sua conta do Google ou seu e-mail e senha.
      </p>
      <FormularioLogin mensagemInicial={mensagem} />
    </>
  );
}
