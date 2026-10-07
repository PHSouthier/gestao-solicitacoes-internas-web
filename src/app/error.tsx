"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Botao, classesBotao } from "@/components/ui/botao";

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
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-start justify-center gap-4 px-4 py-16">
      <h1 className="text-4xl font-black tracking-tight">Não foi possível carregar esta página</h1>
      <p className="text-lg text-texto/60">
        O servidor não respondeu como esperado. Confira se a API está rodando e tente de novo.
      </p>
      <div className="mt-2 flex gap-3">
        <Botao onClick={() => retry()}>Tentar de novo</Botao>
        <Link href="/" className={classesBotao("discreto")}>
          Ir para o início
        </Link>
      </div>
    </main>
  );
}
