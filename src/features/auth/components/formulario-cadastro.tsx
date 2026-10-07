"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alerta } from "@/components/ui/alerta";
import { Botao } from "@/components/ui/botao";
import { Campo } from "@/components/ui/campo";
import { ApiErro } from "@/lib/api/erros";
import { errosPorCampo, mensagemDoErro } from "@/lib/api/cliente";
import { cadastrar, entrar } from "../api";
import type { Cadastro } from "../tipos";
import { BotaoGoogle } from "./botao-google";
import { DivisorOu } from "./divisor-ou";

type ErrosCampos = Partial<Record<keyof Cadastro, string>>;

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validar({ nome, email, senha }: Cadastro): ErrosCampos {
  const erros: ErrosCampos = {};
  if (nome.length < 2) erros.nome = "Informe o seu nome.";
  if (!email) erros.email = "Informe o seu e-mail.";
  else if (!EMAIL_VALIDO.test(email)) erros.email = "Informe um e-mail válido.";
  if (senha.length < 8 || !/[A-Za-z]/.test(senha) || !/\d/.test(senha)) {
    erros.senha = "Use pelo menos 8 caracteres, com letras e números.";
  }
  return erros;
}

export function FormularioCadastro() {
  const router = useRouter();
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [errosCampos, setErrosCampos] = useState<ErrosCampos>({});
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    const cadastro: Cadastro = {
      nome: String(dados.get("nome") ?? "").trim(),
      email: String(dados.get("email") ?? "").trim(),
      senha: String(dados.get("senha") ?? ""),
    };

    const erros = validar(cadastro);
    setErrosCampos(erros);
    setMensagem(null);
    if (Object.keys(erros).length > 0) return;

    setEnviando(true);
    try {
      await cadastrar(cadastro);
      await entrar({ email: cadastro.email, senha: cadastro.senha });
      router.replace("/");
      router.refresh();
    } catch (erro) {
      setEnviando(false);
      if (erro instanceof ApiErro && erro.detalhes.length > 0) {
        setErrosCampos(errosPorCampo(erro));
        return;
      }
      setMensagem(mensagemDoErro(erro));
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
          erro={errosCampos.nome}
        />
        <Campo
          id="email"
          name="email"
          type="email"
          rotulo="E-mail"
          placeholder="nome@empresa.com"
          autoComplete="email"
          erro={errosCampos.email}
        />
        <Campo
          id="senha"
          name="senha"
          type="password"
          rotulo="Senha"
          placeholder="Crie uma senha"
          autoComplete="new-password"
          dica="Pelo menos 8 caracteres, com letras e números."
          erro={errosCampos.senha}
        />
        <Botao type="submit" carregando={enviando} className="mt-3 w-full">
          {enviando ? "Criando conta..." : "Criar conta"}
        </Botao>
      </form>

      <p className="text-center text-texto/60">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="font-bold text-texto underline-offset-4 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
