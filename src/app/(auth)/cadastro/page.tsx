import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FormularioCadastro } from "@/features/auth/components/formulario-cadastro";
import { buscarUsuarioLogado } from "@/features/auth/sessao";

export const metadata: Metadata = { title: "Criar conta" };

export default async function PaginaCadastro() {
  const usuario = await buscarUsuarioLogado().catch(() => null);
  if (usuario) redirect("/");

  return (
    <>
      <h1 className="text-4xl font-black tracking-tight">Criar conta</h1>
      <p className="mt-2 mb-8 text-texto/60">
        Contas novas entram como Solicitante. Um administrador pode mudar o seu
        perfil depois.
      </p>
      <FormularioCadastro />
    </>
  );
}
