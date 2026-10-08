"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alerta } from "@/components/ui/alerta";
import { Botao } from "@/components/ui/botao";
import { Campo } from "@/components/ui/campo";
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
    <div className="flex flex-col gap-6">
      {mensagem && <Alerta>{mensagem}</Alerta>}

      <BotaoGoogle />
      <DivisorOu />

      <form noValidate onSubmit={aoEnviar} className="flex flex-col gap-5">
        <Campo
          id="nome"
          name="nome"
          rotulo="Nome"
          placeholder="Seu nome completo"
          autoComplete="name"
          erro={erros.nome}
        />
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
          placeholder="Crie uma senha"
          autoComplete="new-password"
          dica="Pelo menos 8 caracteres, com letras e números."
          erro={erros.senha}
        />
        <Botao type="submit" carregando={enviando} className="mt-3 w-full">
          {enviando ? "Criando conta..." : "Criar conta"}
        </Botao>
      </form>

      <p className="text-center text-texto/60">
        Já tem conta?{" "}
        <Link href="/login" className="font-bold text-texto underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
