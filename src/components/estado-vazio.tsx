import type { ReactNode } from "react";

export function EstadoVazio({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-texto/20 px-6 py-16 text-center">
      <h2 className="text-xl font-bold">{titulo}</h2>
      <p className="max-w-md text-texto/60">{descricao}</p>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
