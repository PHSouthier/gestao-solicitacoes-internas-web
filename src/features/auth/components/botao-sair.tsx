"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Botao } from "@/components/ui/botao";
import { sair } from "../api";

export function BotaoSair() {
  const router = useRouter();
  const [saindo, setSaindo] = useState(false);

  async function aoSair() {
    setSaindo(true);
    try {
      await sair();
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <Botao
      variante="contorno"
      tamanho="pequeno"
      carregando={saindo}
      onClick={aoSair}
    >
      Sair
    </Botao>
  );
}
