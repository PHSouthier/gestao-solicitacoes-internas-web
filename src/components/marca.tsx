import { juntarClasses } from "@/lib/utils";

export function Marca({ sobreVerde = false }: { sobreVerde?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden
        className={juntarClasses(
          "grid size-8 place-items-center rounded-full",
          sobreVerde
            ? "bg-preto text-verde"
            : "bg-verde text-preto",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <path d="M5 12.5 9.5 17 19 7.5" />
        </svg>
      </span>
      <span
        className={juntarClasses(
          "text-lg font-bold tracking-tight",
          sobreVerde ? "text-preto" : "text-texto",
        )}
      >
        Solicitações
      </span>
    </span>
  );
}
