import { Marca } from "@/components/marca";
import { AlternarTema } from "@/components/tema/alternar-tema";
import { PainelApresentacao } from "@/features/auth/components/painel-apresentacao";

export default function LayoutAuth({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh flex-1 lg:grid-cols-[1.1fr_1fr]">
      <PainelApresentacao />

      <main className="relative flex items-center justify-center px-4 py-16 sm:px-8">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <AlternarTema />
        </div>
        <div className="w-full max-w-sm">
          <div className="mb-12 lg:hidden">
            <Marca />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
