import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Entrar</CardTitle>
        <CardDescription>Use sua conta do Google ou seu e-mail e senha.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormularioLogin mensagemInicial={mensagem} />
      </CardContent>
    </Card>
  );
}
