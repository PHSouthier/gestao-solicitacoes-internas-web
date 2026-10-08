import { Separator } from "@/components/ui/separator";

export function DivisorOu() {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground uppercase">
      <Separator className="flex-1" />
      ou
      <Separator className="flex-1" />
    </div>
  );
}
