import type { ButtonHTMLAttributes } from "react";
import { juntarClasses } from "@/lib/classes";

type Variante = "primario" | "contorno" | "perigo" | "discreto";
type Tamanho = "normal" | "pequeno";

const VARIANTES: Record<Variante, string> = {
  primario:
    "bg-verde text-preto hover:brightness-110 hover:scale-[1.02] active:scale-100",
  contorno: "border border-texto/40 text-texto hover:border-texto",
  perigo: "bg-red-600 text-branco hover:bg-red-700",
  discreto: "text-texto/70 hover:bg-texto/10 hover:text-texto",
};

const TAMANHOS: Record<Tamanho, string> = {
  normal: "h-12 px-8 text-base",
  pequeno: "h-9 px-4 text-sm",
};

export function classesBotao(
  variante: Variante = "primario",
  tamanho: Tamanho = "normal",
  extra?: string,
): string {
  return juntarClasses(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-texto",
    "disabled:pointer-events-none disabled:opacity-60",
    VARIANTES[variante],
    TAMANHOS[tamanho],
    extra,
  );
}

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  tamanho?: Tamanho;
  carregando?: boolean;
}

export function Botao({
  variante,
  tamanho,
  carregando = false,
  className,
  disabled,
  type = "button",
  children,
  ...props
}: BotaoProps) {
  return (
    <button
      type={type}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      className={classesBotao(variante, tamanho, className)}
      {...props}
    >
      {carregando && (
        <span
          aria-hidden
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}
