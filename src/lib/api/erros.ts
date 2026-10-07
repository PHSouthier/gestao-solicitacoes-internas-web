export interface DetalheErro {
  field: string;
  messages: string[];
}

interface RespostaErro {
  code?: string;
  message?: string;
  details?: DetalheErro[];
}

export class ApiErro extends Error {
  constructor(
    readonly status: number,
    readonly codigo: string,
    message: string,
    readonly detalhes: DetalheErro[] = [],
  ) {
    super(message);
    this.name = "ApiErro";
  }
}

export async function lerErro(resposta: Response): Promise<ApiErro> {
  const corpo = (await resposta.json().catch(() => null)) as RespostaErro | null;

  if (!corpo?.code) {
    return new ApiErro(
      resposta.status,
      "ERRO_INESPERADO",
      resposta.status >= 500
        ? "O servidor não respondeu. Tente novamente em instantes."
        : "Não foi possível concluir a operação.",
    );
  }

  return new ApiErro(
    resposta.status,
    corpo.code,
    corpo.message ?? "Não foi possível concluir a operação.",
    corpo.details ?? [],
  );
}
