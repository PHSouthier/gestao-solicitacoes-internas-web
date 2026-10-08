import type { ReactNode } from "react";

export function CabecalhoPagina({
  titulo,
  descricao,
  acoes,
  antes,
}: {
  titulo: string;
  descricao?: ReactNode;
  acoes?: ReactNode;
  antes?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {antes}
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{titulo}</h1>
        {descricao && <div className="mt-2 text-muted-foreground">{descricao}</div>}
      </div>
      {acoes && <div className="flex shrink-0 gap-2">{acoes}</div>}
    </div>
  );
}
