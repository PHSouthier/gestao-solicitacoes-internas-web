import { Marca } from "@/components/marca";
import { juntarClasses } from "@/lib/classes";

const ETAPAS = [
  { status: "Aberta", detalhe: "02/10 por Sérgio, do Financeiro" },
  { status: "Em análise", detalhe: "03/10 por Ana, da TI" },
  { status: "Aprovada", detalhe: "03/10: compra liberada no orçamento do trimestre." },
];

export function PainelApresentacao() {
  return (
    <section className="hidden flex-col justify-between gap-12 bg-verde p-12 text-preto lg:flex xl:p-16">
      <Marca sobreVerde />

      <div className="max-w-xl">
        <h2 className="text-6xl leading-[0.95] font-black tracking-tight xl:text-7xl">
          Do pedido à decisão, sem nada se perder.
        </h2>
        <p className="mt-6 max-w-md text-lg font-medium">
          Abra solicitações, acompanhe a análise e registre cada decisão com
          comentário e data.
        </p>
      </div>

      <article className="max-w-md rounded-xl bg-fundo p-6 text-texto shadow-2xl shadow-preto/30">
        <p className="text-sm text-texto/50">SOL-000042</p>
        <h3 className="mt-1 text-lg font-bold">Notebook para o time de design</h3>

        <ol className="mt-6 flex flex-col gap-5">
          {ETAPAS.map((etapa, indice) => {
            const atual = indice === ETAPAS.length - 1;
            return (
              <li key={etapa.status} className="relative flex gap-4">
                {!atual && (
                  <span
                    aria-hidden
                    className="absolute top-4 left-[7px] h-[calc(100%+0.25rem)] w-0.5 bg-texto/15"
                  />
                )}
                <span
                  aria-hidden
                  className={juntarClasses(
                    "relative mt-1 size-4 shrink-0 rounded-full",
                    atual
                      ? "bg-verde ring-4 ring-verde/25"
                      : "bg-texto/30",
                  )}
                />
                <div>
                  <p
                    className={juntarClasses(
                      "font-bold",
                      atual && "text-green-700 dark:text-verde",
                    )}
                  >
                    {etapa.status}
                  </p>
                  <p className="text-sm text-texto/60">{etapa.detalhe}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </article>
    </section>
  );
}
