import { expect, test } from "@playwright/test";
import { entrar, sair, totalAprovadas, USUARIOS } from "./apoio";

test.describe("Fluxo de uma solicitação", () => {
  test("solicitante cria, analista analisa e aprova, e o painel atualiza", async ({ page }) => {
    const titulo = `Teste automático ${Date.now()}`;

    // solicitante cadastra
    await entrar(page, USUARIOS.solicitante);
    await page.getByRole("link", { name: "Nova solicitação" }).first().click();
    await page.getByLabel("Título").fill(titulo);
    await page.getByLabel("Descrição").fill("Criada pelo teste do Playwright.");
    await page.getByLabel("Área").click();
    await page.getByRole("option", { name: "Compras" }).click();
    await page.getByRole("radio", { name: "Alta" }).click();
    await page.getByRole("button", { name: "Cadastrar solicitação" }).click();

    await expect(page.getByRole("heading", { name: titulo })).toBeVisible();
    await expect(page.getByText(/SOL-\d+ cadastrada\./)).toBeVisible();
    const endereco = page.url();

    // solicitante não pode decidir
    await expect(page.getByRole("button", { name: "Aprovar" })).toHaveCount(0);
    await sair(page);

    // analista analisa e aprova
    await entrar(page, USUARIOS.analista);
    const antes = await totalAprovadas(page);

    await page.goto(endereco);
    await page.getByRole("button", { name: "Iniciar análise" }).click();
    await expect(page.getByText("Análise iniciada.")).toBeVisible();

    await page.getByRole("button", { name: "Aprovar" }).click();
    const dialogo = page.getByRole("dialog");
    await dialogo.getByRole("button", { name: "Aprovar" }).click();
    await expect(dialogo.getByText(/comentário é obrigatório/)).toBeVisible();

    await dialogo.getByLabel("Comentário").fill("Aprovado pelo teste automático.");
    await dialogo.getByRole("button", { name: "Aprovar" }).click();
    await expect(page.getByText("Solicitação aprovada.")).toBeVisible();
    await expect(page.getByText("Aprovado pelo teste automático.")).toBeVisible();

    // o painel conta uma aprovada a mais
    expect(await totalAprovadas(page)).toBe(antes + 1);
  });

  test("busca e filtro de status refletem na URL e na lista", async ({ page }) => {
    await entrar(page, USUARIOS.analista);
    await page.goto("/solicitacoes");

    await page.getByRole("button", { name: "Aprovada", exact: true }).click();
    await expect(page).toHaveURL(/status=APROVADA/);

    await page.getByLabel("Buscar solicitações").fill("Teste automático");
    await expect(page).toHaveURL(/busca=Teste/);
    await expect(page.getByRole("link", { name: /Teste automático/ }).first()).toBeVisible();

    await page.getByRole("button", { name: "Limpar filtros" }).click();
    await expect(page).toHaveURL("/solicitacoes");
  });
});
