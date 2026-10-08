import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { cookies } from "next/headers";
import { COOKIE_TEMA, lerTema } from "@/components/tema/tema";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Solicitações internas",
    template: "%s | Solicitações internas",
  },
  description: "Abertura, análise e decisão de solicitações internas.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const tema = lerTema((await cookies()).get(COOKIE_TEMA)?.value);

  return (
    <html
      lang="pt-BR"
      data-tema={tema}
      className={`${figtree.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <Toaster
          position="top-right"
          theme={tema === "escuro" ? "dark" : tema === "claro" ? "light" : "system"}
        />
      </body>
    </html>
  );
}
