import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormularioCadastro } from "@/features/auth/components/formulario-cadastro";
import { buscarUsuarioLogado } from "@/features/auth/sessao";

export const metadata: Metadata = { title: "Criar conta" };

export default async function PaginaCadastro() {
  const usuario = await buscarUsuarioLogado().catch(() => null);
  if (usuario) redirect("/");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Criar conta</CardTitle>
        <CardDescription>
          Contas novas entram como Solicitante. Um administrador pode mudar o seu perfil depois.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormularioCadastro />
      </CardContent>
    </Card>
  );
}
