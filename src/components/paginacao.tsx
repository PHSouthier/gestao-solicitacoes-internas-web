import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
    <Pagination>
      <PaginationContent>
        {pagina > 1 && (
          <PaginationItem>
            <PaginationPrevious href={hrefDaPagina(pagina - 1)} />
          </PaginationItem>
        )}
        {paginasVisiveis(pagina, totalPaginas).map((item, i) =>
          item === "..." ? (
            <PaginationItem key={`reticencias-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink href={hrefDaPagina(item)} isActive={item === pagina}>
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        {pagina < totalPaginas && (
          <PaginationItem>
            <PaginationNext href={hrefDaPagina(pagina + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
