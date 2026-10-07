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
