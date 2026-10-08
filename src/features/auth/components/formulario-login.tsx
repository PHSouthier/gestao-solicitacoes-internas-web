"use client";

import { LoaderCircleIcon, LogInIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AlertaErro } from "@/components/alerta-erro";
import { CampoTexto } from "@/components/campo-texto";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col gap-5">
      {mensagem && <AlertaErro>{mensagem}</AlertaErro>}

      <BotaoGoogle />
      <DivisorOu />

      <form noValidate onSubmit={aoEnviar} className="flex flex-col gap-4">
        <CampoTexto
          id="email"
          name="email"
          type="email"
          rotulo="E-mail"
          placeholder="nome@empresa.com"
          autoComplete="email"
          erro={erros.email}
        />
        <CampoTexto
          id="senha"
          name="senha"
          type="password"
          rotulo="Senha"
          autoComplete="current-password"
          erro={erros.senha}
        />
        <Button type="submit" disabled={enviando} className="mt-2 w-full">
          {enviando ? <LoaderCircleIcon className="animate-spin" /> : <LogInIcon />}
          {enviando ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-foreground underline-offset-4 hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
