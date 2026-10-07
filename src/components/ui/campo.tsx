import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { juntarClasses } from "@/lib/classes";

interface GrupoProps {
  id: string;
  rotulo: string;
  erro?: string;
  dica?: string;
}

function classesEntrada(erro: string | undefined, extra?: string): string {
  return juntarClasses(
    "w-full rounded-md border bg-fundo px-4 text-base text-texto outline-none transition",
    "placeholder:text-texto/40 focus:border-texto focus:ring-1 focus:ring-texto",
    "disabled:opacity-60",
    erro
      ? "border-red-600 dark:border-red-400"
      : "border-texto/30 hover:border-texto/70",
    extra,
  );
}

function ariaDoCampo({ id, erro, dica }: GrupoProps) {
  const descricao = [erro && `${id}-erro`, dica && `${id}-dica`]
    .filter(Boolean)
    .join(" ");
  return {
    "aria-invalid": erro ? true : undefined,
    "aria-describedby": descricao || undefined,
  };
}

function Grupo({
  id,
  rotulo,
  erro,
  dica,
  children,
}: GrupoProps & { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-bold">
        {rotulo}
      </label>
      {children}
      {dica && !erro && (
        <p id={`${id}-dica`} className="text-sm text-texto/60">
          {dica}
        </p>
      )}
      {erro && (
        <p id={`${id}-erro`} className="text-sm text-red-600 dark:text-red-400">
          {erro}
        </p>
      )}
    </div>
  );
}

type CampoProps = GrupoProps & InputHTMLAttributes<HTMLInputElement>;

export function Campo({ id, rotulo, erro, dica, className, ...props }: CampoProps) {
  return (
    <Grupo id={id} rotulo={rotulo} erro={erro} dica={dica}>
      <input
        id={id}
        className={classesEntrada(erro, juntarClasses("h-12", className))}
        {...ariaDoCampo({ id, rotulo, erro, dica })}
        {...props}
      />
    </Grupo>
  );
}

type AreaTextoProps = GrupoProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function AreaTexto({
  id,
  rotulo,
  erro,
  dica,
  className,
  ...props
}: AreaTextoProps) {
  return (
    <Grupo id={id} rotulo={rotulo} erro={erro} dica={dica}>
      <textarea
        id={id}
        className={classesEntrada(erro, juntarClasses("min-h-32 py-3", className))}
        {...ariaDoCampo({ id, rotulo, erro, dica })}
        {...props}
      />
    </Grupo>
  );
}

type SelecaoProps = GrupoProps & SelectHTMLAttributes<HTMLSelectElement>;

export function Selecao({
  id,
  rotulo,
  erro,
  dica,
  className,
  children,
  ...props
}: SelecaoProps) {
  return (
    <Grupo id={id} rotulo={rotulo} erro={erro} dica={dica}>
      <select
        id={id}
        className={classesEntrada(erro, juntarClasses("h-12", className))}
        {...ariaDoCampo({ id, rotulo, erro, dica })}
        {...props}
      >
        {children}
      </select>
    </Grupo>
  );
}
