"use client";

import { LoaderCircleIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AlertaErro } from "@/components/alerta-erro";
import { CampoTexto } from "@/components/campo-texto";
import { Button } from "@/components/ui/button";
import { errosPorCampo, mensagemDoErro } from "@/lib/api/cliente";
import { cadastrar, entrar } from "../api";
import { BotaoGoogle } from "./botao-google";
import { DivisorOu } from "./divisor-ou";

export function FormularioCadastro() {
  const router = useRouter();
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    const email = String(dados.get("email")).trim();
    const senha = String(dados.get("senha"));
    setErros({});
    setMensagem(null);
    setEnviando(true);

    try {
      await cadastrar({ nome: String(dados.get("nome")).trim(), email, senha });
      await entrar({ email, senha });
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
        <CampoTexto id="nome" name="nome" rotulo="Nome" autoComplete="name" erro={erros.nome} />
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
          autoComplete="new-password"
          dica="Pelo menos 8 caracteres, com letras e números."
          erro={erros.senha}
        />
        <Button type="submit" disabled={enviando} className="mt-2 w-full">
          {enviando ? <LoaderCircleIcon className="animate-spin" /> : <UserPlusIcon />}
          {enviando ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
