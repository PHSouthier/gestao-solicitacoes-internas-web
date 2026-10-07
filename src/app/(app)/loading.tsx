export default function Carregando() {
  return (
    <div role="status" className="flex flex-col gap-6" aria-label="Carregando">
      <div className="h-12 w-2/3 max-w-md animate-pulse rounded-lg bg-texto/10" />
      <div className="h-5 w-1/2 max-w-sm animate-pulse rounded bg-texto/10" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="h-32 animate-pulse rounded-xl bg-texto/5" />
        <div className="h-32 animate-pulse rounded-xl bg-texto/5" />
      </div>
    </div>
  );
}
