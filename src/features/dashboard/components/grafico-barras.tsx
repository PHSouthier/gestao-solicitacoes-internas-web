export interface ItemGrafico {
  rotulo: string;
  valor: number;
  href?: string;
}

export function GraficoBarras({
  titulo,
  itens,
  vazio,
}: {
  titulo: string;
  itens: ItemGrafico[];
  vazio: string;
}) {
  const maior = Math.max(...itens.map((item) => item.valor), 0);

  return (
    <section className="flex flex-col gap-5 rounded-xl bg-texto/5 p-6">
      <h2 className="text-lg font-bold">{titulo}</h2>
      {maior === 0 ? (
        <p className="text-texto/60">{vazio}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {itens.map((item) => (
            <li key={item.rotulo} className="flex flex-col gap-1.5" title={`${item.rotulo}: ${item.valor}`}>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="font-medium text-texto/80">{item.rotulo}</span>
                <span className="font-bold tabular-nums">{item.valor}</span>
              </div>
              <div className="h-2 rounded-full bg-texto/10">
                <div
                  className="h-full rounded-full bg-verde"
                  style={{ width: `${(item.valor / maior) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
