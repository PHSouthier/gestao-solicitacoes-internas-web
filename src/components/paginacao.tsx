import Link from "next/link";
import { juntarClasses } from "@/lib/classes";

function paginasVisiveis(atual: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const paginas = new Set([1, total, atual - 1, atual, atual + 1]);
  const ordenadas = [...paginas].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const resultado: (number | "...")[] = [];
  ordenadas.forEach((pagina, i) => {
    if (i > 0 && pagina - ordenadas[i - 1] > 1) resultado.push("...");
    resultado.push(pagina);
  });
  return resultado;
}

const classesItem =
  "grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-texto";

export function Paginacao({
  pagina,
  totalPaginas,
  hrefDaPagina,
}: {
  pagina: number;
  totalPaginas: number;
  hrefDaPagina: (pagina: number) => string;
}) {
  if (totalPaginas <= 1) return null;

  return (
    <nav aria-label="Paginação" className="flex flex-wrap items-center justify-center gap-1">
      {pagina > 1 && (
        <Link href={hrefDaPagina(pagina - 1)} className={juntarClasses(classesItem, "hover:bg-texto/10")}>
          Anterior
        </Link>
      )}
      {paginasVisiveis(pagina, totalPaginas).map((item, i) =>
        item === "..." ? (
          <span key={`reticencias-${i}`} className="px-2 text-texto/50">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefDaPagina(item)}
            aria-current={item === pagina ? "page" : undefined}
            className={juntarClasses(
              classesItem,
              item === pagina ? "bg-texto text-fundo" : "hover:bg-texto/10",
            )}
          >
            {item}
          </Link>
        ),
      )}
      {pagina < totalPaginas && (
        <Link href={hrefDaPagina(pagina + 1)} className={juntarClasses(classesItem, "hover:bg-texto/10")}>
          Próxima
        </Link>
      )}
    </nav>
  );
}
