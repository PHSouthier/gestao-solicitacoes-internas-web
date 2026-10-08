import { FileQuestionIcon, HouseIcon } from "lucide-react";
import Link from "next/link";
import { EstadoVazio } from "@/components/estado-vazio";
import { Button } from "@/components/ui/button";

export default function NaoEncontrado() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 items-center px-4 py-16">
      <EstadoVazio
        icone={FileQuestionIcon}
        titulo="Página não encontrada"
        descricao="O endereço pode estar errado, a solicitação pode ter sido excluída ou você não tem acesso a esta área."
      >
        <Button asChild>
          <Link href="/">
            <HouseIcon />
            Ir para o início
          </Link>
        </Button>
      </EstadoVazio>
    </main>
  );
}
