"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

interface DialogoProps {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  descricao?: string;
  children: ReactNode;
}

export function Dialogo({
  aberto,
  aoFechar,
  titulo,
  descricao,
  children,
}: DialogoProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) dialogo.showModal();
    if (!aberto && dialogo.open) dialogo.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      onClose={aoFechar}
      aria-labelledby={idTitulo}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl bg-fundo p-0 text-texto shadow-2xl ring-1 ring-texto/10 backdrop:bg-preto/60"
    >
      {aberto && (
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div>
            <h2 id={idTitulo} className="text-2xl font-bold tracking-tight">
              {titulo}
            </h2>
            {descricao && <p className="mt-2 text-texto/60">{descricao}</p>}
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
