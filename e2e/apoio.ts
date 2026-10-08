import { expect, type Page } from "@playwright/test";

export const SENHA = "Senha@123";

export const USUARIOS = {
  solicitante: "solicitante@empresa.local",
  analista: "analista@empresa.local",
  admin: "admin@empresa.local",
} as const;

export async function entrar(page: Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill(SENHA);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL("/");
}

export async function sair(page: Page) {
  await page.getByRole("button", { name: "Menu do usuário" }).click();
  await page.getByRole("menuitem", { name: "Sair" }).click();
  await expect(page).toHaveURL("/login");
}

export async function totalAprovadas(page: Page): Promise<number> {
  await page.goto("/");
  const cartao = page.getByRole("link", { name: /^Aprovada \d+$/ });
  const texto = (await cartao.textContent()) ?? "";
  return Number(texto.replace(/\D/g, ""));
}
