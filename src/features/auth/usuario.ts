export type Perfil = "SOLICITANTE" | "ANALISTA" | "ADMINISTRADOR";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  criadoEm: string;
}

export interface Credenciais {
  email: string;
  senha: string;
}

export interface Cadastro extends Credenciais {
  nome: string;
}

export const ROTULO_PERFIL: Record<Perfil, string> = {
  SOLICITANTE: "Solicitante",
  ANALISTA: "Analista",
  ADMINISTRADOR: "Administrador",
};

const ERROS_LOGIN_GOOGLE: Record<string, string> = {
  google_cancelado: "O login com o Google foi cancelado.",
  google_estado_invalido: "O login com o Google expirou. Tente de novo.",
  google_email_nao_verificado:
    "Seu e-mail ainda não foi verificado no Google. Verifique-o e tente de novo.",
  google_email_vinculado_a_outra_conta:
    "Este e-mail já está ligado a outra conta do Google. Entre com e-mail e senha.",
  google_usuario_inativo:
    "Sua conta está desativada. Fale com um administrador.",
};

export function mensagemErroLogin(erro: string | undefined): string | null {
  if (!erro) return null;
  return (
    ERROS_LOGIN_GOOGLE[erro] ??
    "Não foi possível entrar com o Google. Tente de novo ou use e-mail e senha."
  );
}

export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}
