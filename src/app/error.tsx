"use client";

import { HouseIcon, RotateCwIcon, ServerCrashIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { EstadoVazio } from "@/components/estado-vazio";
import { Button } from "@/components/ui/button";

export default function Erro({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 items-center px-4 py-16">
      <EstadoVazio
        icone={ServerCrashIcon}
        titulo="Não foi possível carregar esta página"
        descricao="O servidor não respondeu como esperado. Confira se a API está rodando e tente de novo."
      >
        <div className="flex gap-2">
          <Button onClick={() => retry()}>
            <RotateCwIcon />
            Tentar de novo
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <HouseIcon />
              Ir para o início
            </Link>
          </Button>
        </div>
      </EstadoVazio>
    </main>
  );
}
