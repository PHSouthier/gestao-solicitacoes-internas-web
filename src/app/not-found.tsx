import Link from "next/link";
import { classesBotao } from "@/components/ui/botao";

export default function NaoEncontrado() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-start justify-center gap-4 px-4 py-16">
      <p className="text-7xl font-black tracking-tight text-verde">404</p>
      <h1 className="text-3xl font-black tracking-tight">Página não encontrada</h1>
      <p className="text-lg text-texto/60">
        O endereço pode estar errado, a solicitação pode ter sido excluída ou você não tem acesso a
        esta área.
      </p>
      <Link href="/" className={classesBotao("primario", "normal", "mt-2")}>
        Ir para o início
      </Link>
    </main>
  );
}
