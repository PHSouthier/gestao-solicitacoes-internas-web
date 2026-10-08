import { ClipboardCheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Marca({ sobreVerde = false }: { sobreVerde?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden
        className={cn(
          "grid size-8 place-items-center rounded-lg",
          sobreVerde ? "bg-preto text-verde" : "bg-primary text-primary-foreground",
        )}
      >
        <ClipboardCheckIcon className="size-4.5" />
      </span>
      <span className={cn("text-lg font-bold tracking-tight", sobreVerde && "text-preto")}>
        Solicitações
      </span>
    </span>
  );
}
