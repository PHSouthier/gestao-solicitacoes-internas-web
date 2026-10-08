import { expect, test } from "@playwright/test";
import { entrar, sair, USUARIOS } from "./apoio";

test.describe("Login", () => {
  test("sem login, qualquer página leva para o login", async ({ page }) => {
    await page.goto("/solicitacoes");
    await expect(page).toHaveURL("/login");
    await expect(page.getByText("Entrar", { exact: true }).first()).toBeVisible();
  });

  test("senha errada mostra o erro da API", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill(USUARIOS.analista);
    await page.getByLabel("Senha").fill("senha-errada");
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(page.getByText("E-mail ou senha inválidos.")).toBeVisible();
  });

  test("campos vazios mostram o erro de cada campo", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(page.getByText("Informe um e-mail válido.")).toBeVisible();
    await expect(page.getByText("Informe a senha.")).toBeVisible();
  });

  test("entra e sai do sistema", async ({ page }) => {
    await entrar(page, USUARIOS.analista);
    await expect(page.getByRole("heading", { name: /Ana\./ })).toBeVisible();
    await sair(page);
  });
});
