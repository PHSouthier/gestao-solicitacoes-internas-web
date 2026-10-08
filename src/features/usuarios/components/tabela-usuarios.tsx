"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { iniciais, type Perfil, ROTULO_PERFIL, type Usuario } from "@/features/auth/usuario";
import { mensagemDoErro } from "@/lib/api/cliente";
import { formatarData } from "@/lib/utils";
import { alterarPerfil } from "../api";

const PERFIS: Perfil[] = ["SOLICITANTE", "ANALISTA", "ADMINISTRADOR"];

export function TabelaUsuarios({
  usuarios,
  idUsuarioLogado,
}: {
  usuarios: Usuario[];
  idUsuarioLogado: string;
}) {
  const router = useRouter();
  const [salvando, setSalvando] = useState<string | null>(null);

  async function aoMudarPerfil(usuario: Usuario, perfil: Perfil) {
    setSalvando(usuario.id);
    try {
      await alterarPerfil(usuario.id, perfil);
      toast.success(`${usuario.nome} agora é ${ROTULO_PERFIL[perfil]}.`);
      router.refresh();
    } catch (erro) {
      toast.error(mensagemDoErro(erro));
    } finally {
      setSalvando(null);
    }
  }

  return (
    <Card className="py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Usuário</TableHead>
            <TableHead className="hidden sm:table-cell">Desde</TableHead>
            <TableHead className="pr-4 text-right">Perfil</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.map((usuario) => {
            const ehVoce = usuario.id === idUsuarioLogado;
            return (
              <TableRow key={usuario.id}>
                <TableCell className="py-3 pl-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/15 font-semibold">
                        {iniciais(usuario.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-medium">
                        {usuario.nome}
                        {ehVoce && <Badge variant="secondary">você</Badge>}
                      </p>
                      <p className="truncate text-muted-foreground">{usuario.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {formatarData(usuario.criadoEm)}
                </TableCell>
                <TableCell className="pr-4 text-right">
                  <Select
                    value={usuario.perfil}
                    disabled={ehVoce || salvando === usuario.id}
                    onValueChange={(valor) => aoMudarPerfil(usuario, valor as Perfil)}
                  >
                    <SelectTrigger
                      aria-label={`Perfil de ${usuario.nome}`}
                      title={ehVoce ? "Você não pode alterar o seu próprio perfil." : undefined}
                      className="ml-auto w-40"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end">
                      {PERFIS.map((perfil) => (
                        <SelectItem key={perfil} value={perfil}>
                          {ROTULO_PERFIL[perfil]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
