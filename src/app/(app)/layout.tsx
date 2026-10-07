import { redirect } from "next/navigation";
import { Cabecalho } from "@/components/layout/cabecalho";
import { buscarUsuarioLogado } from "@/features/auth/sessao";

export default async function LayoutApp({ children }: LayoutProps<"/">) {
  const usuario = await buscarUsuarioLogado();
  if (!usuario) redirect("/login");

  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <Cabecalho usuario={usuario} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-8 sm:py-14">
        {children}
      </main>
    </div>
  );
}
