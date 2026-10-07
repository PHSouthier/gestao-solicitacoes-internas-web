import "server-only";
import { buscarDaApi } from "@/lib/api/servidor";
import type { ResumoDashboard } from "./tipos";

export function buscarResumo() {
  return buscarDaApi<ResumoDashboard>("/dashboard/resumo");
}
