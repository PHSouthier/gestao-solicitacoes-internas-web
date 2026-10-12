# Gestão de Solicitações Internas — Web

Front-end do sistema web de gestão de solicitações internas: login, cadastro e acompanhamento de solicitações, análise e decisão, dashboard e administração de usuários.

> A **documentação principal** (premissas, regras de negócio, decisões técnicas, status da entrega e considerações arquiteturais) está no README da API:
> **https://github.com/PHSouthier/gestao-solicitacoes-internas-api**

---

## ✔️ Tecnologias

| Item | Tecnologia |
|---|---|
| Framework | Next.js 16 · TypeScript |
| Estilo | Tailwind CSS 4 · tema claro e escuro |
| Componentes | shadcn/ui · ícones lucide-react |
| Testes | Playwright |
| Containers | Docker |

---

## 🔨 Telas

| Tela | Rota |
|---|---|
| Login (e-mail e senha, ou Google) | `/login` |
| Cadastro de conta | `/cadastro` |
| Dashboard: indicadores, gráficos por prioridade e área, últimas solicitações | `/` |
| Solicitações: busca, filtros, ordenação e paginação | `/solicitacoes` |
| Nova solicitação | `/solicitacoes/nova` |
| Detalhe com histórico, análise, decisão e exclusão | `/solicitacoes/[id]` |
| Edição | `/solicitacoes/[id]/editar` |
| Usuários e perfis | `/usuarios` |

---

## 🛠️ Como executar

Para ter uma cópia do front rodando localmente, siga os passos abaixo.

### Pré-requisitos

- Git
- Docker e Docker Compose
- A API no ar (veja [como executar a API](https://github.com/PHSouthier/gestao-solicitacoes-internas-api#%EF%B8%8F-como-executar))
- Node.js 24 e npm (só para rodar fora do Docker ou executar os testes)

### Configuração

1. Suba a API seguindo o README dela. Se ela foi iniciada com `docker compose --profile full up -d --build`, o front já sobe junto e os passos abaixo não são necessários.

2. Clone o repositório **na mesma pasta** da API:

   ```bash
   git clone https://github.com/PHSouthier/gestao-solicitacoes-internas-web.git
   cd gestao-solicitacoes-internas-web
   ```

3. Faça o build e suba o front com o Docker Compose:

   ```bash
   docker compose up -d --build
   ```

   No Docker, o endereço da API já vem fixado como `http://api:3001` e o `.env` não é usado.

4. Com o container no ar, o front fica disponível em `http://localhost:3000`.

### Rodando fora do Docker

1. Crie o arquivo `.env` a partir do exemplo:

   ```bash
   cp .env.example .env
   ```

   | Variável | Para que serve | Padrão |
   |---|---|---|
   | `API_INTERNAL_URL` | Endereço da API usado pelo servidor do Next | `http://localhost:3001` |

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Rode o front em modo desenvolvimento:

   ```bash
   npm run dev
   ```

   O front fica disponível em `http://localhost:3000`.

### Usuários de teste

Criados pelo [seed da API](https://github.com/PHSouthier/gestao-solicitacoes-internas-api/blob/main/db/seed/R__seed_dev.sql).

Senha **`Senha@123`** para todos:

| Perfil | E-mail |
|---|---|
| Solicitante | `solicitante@empresa.local` |
| Analista | `analista@empresa.local` |
| Administrador | `admin@empresa.local` |

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build e execução de produção |
| `npm run test:e2e` | Testes Playwright |

---

## 📜 Documentação da API

O front consome a API REST do repositório [gestao-solicitacoes-internas-api](https://github.com/PHSouthier/gestao-solicitacoes-internas-api), documentada com **Swagger** (OpenAPI).

### 🔹 Acessando a documentação

Com a API rodando, a documentação fica disponível em:

- **Swagger UI**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
- **Especificação OpenAPI (JSON)**: [http://localhost:3001/api/docs-json](http://localhost:3001/api/docs-json)

---

## 📊 Testes

Testes **ponta a ponta com Playwright** (`e2e/`).

Para rodar:

```bash
# 1. API e front no ar
# 2. na primeira vez, baixar os navegadores do Playwright
npx playwright install chromium webkit
# 3. executar (Chromium e WebKit/Safari)
npm run test:e2e
```

Os testes usam os usuários do seed e criam solicitações com o título "Teste automático". O relatório fica em `playwright-report/` (`npx playwright show-report`).

---

# 👨‍💻 Autor

| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/50518425?v=4" width=115><br><sub>Pedro Henrique Southier</sub>](https://github.com/PHSouthier) |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------: |
