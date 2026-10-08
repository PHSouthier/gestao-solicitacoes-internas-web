"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alerta } from "@/components/ui/alerta";
import { Botao } from "@/components/ui/botao";
import { Campo } from "@/components/ui/campo";
import { errosPorCampo, mensagemDoErro } from "@/lib/api/cliente";
import { entrar } from "../api";
import { BotaoGoogle } from "./botao-google";
import { DivisorOu } from "./divisor-ou";

export function FormularioLogin({ mensagemInicial }: { mensagemInicial: string | null }) {
  const router = useRouter();
  const [mensagem, setMensagem] = useState(mensagemInicial);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    setErros({});
    setMensagem(null);
    setEnviando(true);

    try {
      await entrar({
        email: String(dados.get("email")).trim(),
        senha: String(dados.get("senha")),
      });
      router.replace("/");
      router.refresh();
    } catch (erro) {
      setEnviando(false);
      const porCampo = errosPorCampo(erro);
      if (Object.keys(porCampo).length > 0) setErros(porCampo);
      else setMensagem(mensagemDoErro(erro));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {mensagem && <Alerta>{mensagem}</Alerta>}

      <BotaoGoogle />
      <DivisorOu />

      <form noValidate onSubmit={aoEnviar} className="flex flex-col gap-5">
        <Campo
          id="email"
          name="email"
          type="email"
          rotulo="E-mail"
          placeholder="nome@empresa.com"
          autoComplete="email"
          erro={erros.email}
        />
        <Campo
          id="senha"
          name="senha"
          type="password"
          rotulo="Senha"
          placeholder="Sua senha"
          autoComplete="current-password"
          erro={erros.senha}
        />
        <Botao type="submit" carregando={enviando} className="mt-3 w-full">
          {enviando ? "Entrando..." : "Entrar"}
        </Botao>
      </form>

      <p className="text-center text-texto/60">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-bold text-texto underline-offset-4 hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
