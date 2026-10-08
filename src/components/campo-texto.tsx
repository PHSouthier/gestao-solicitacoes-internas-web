import type { ComponentProps } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Comum {
  id: string;
  rotulo: string;
  erro?: string;
  dica?: string;
}

export function CampoTexto({ id, rotulo, erro, dica, ...props }: Comum & ComponentProps<typeof Input>) {
  return (
    <Field data-invalid={erro ? true : undefined}>
      <FieldLabel htmlFor={id}>{rotulo}</FieldLabel>
      <Input id={id} aria-invalid={erro ? true : undefined} {...props} />
      {dica && !erro && <FieldDescription>{dica}</FieldDescription>}
      <FieldError>{erro}</FieldError>
    </Field>
  );
}

export function CampoAreaTexto({ id, rotulo, erro, dica, ...props }: Comum & ComponentProps<typeof Textarea>) {
  return (
    <Field data-invalid={erro ? true : undefined}>
      <FieldLabel htmlFor={id}>{rotulo}</FieldLabel>
      <Textarea id={id} aria-invalid={erro ? true : undefined} {...props} />
      {dica && !erro && <FieldDescription>{dica}</FieldDescription>}
      <FieldError>{erro}</FieldError>
    </Field>
  );
}
