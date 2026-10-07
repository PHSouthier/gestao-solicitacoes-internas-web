import { ApiErro, lerErro } from "./erros";

export async function requisicao<T>(
  caminho: string,
  init: RequestInit = {},
): Promise<T> {
  let resposta: Response;
  try {
    resposta = await fetch(`/api/v1${caminho}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    });
  } catch {
    throw new ApiErro(
      0,
      "SEM_CONEXAO",
      "Sem conexão com o servidor. Verifique sua internet e tente de novo.",
    );
  }

  if (!resposta.ok) {
    throw await lerErro(resposta);
  }
  if (resposta.status === 204) {
    return undefined as T;
  }
  return (await resposta.json()) as T;
}

export function errosPorCampo(erro: unknown): Record<string, string> {
  if (!(erro instanceof ApiErro)) return {};
  return Object.fromEntries(
    erro.detalhes.map((detalhe) => [detalhe.field, detalhe.messages[0]]),
  );
}

export function mensagemDoErro(erro: unknown): string {
  if (erro instanceof ApiErro) return erro.message;
  return "Algo deu errado. Tente de novo.";
}
