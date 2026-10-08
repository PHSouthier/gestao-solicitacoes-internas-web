import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LinkVoltar({ href, children }: { href: string; children: string }) {
  return (
    <Button asChild variant="ghost" size="sm" className="mb-3 -ml-3 text-muted-foreground">
      <Link href={href}>
        <ArrowLeftIcon />
        {children}
      </Link>
    </Button>
  );
}
