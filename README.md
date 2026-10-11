# Gestão de Solicitações Internas — Web

Front-end do sistema web de gestão de solicitações internas: login, cadastro e acompanhamento de solicitações, análise e decisão, dashboard e administração de usuários.

> A **documentação principal** (premissas, regras de negócio, decisões técnicas, status da entrega e considerações arquiteturais) está no README da API:
> **https://github.com/PHSouthier/gestao-solicitacoes-internas-api**

---

## Tecnologias

| Item | Tecnologia |
|---|---|
| Framework | Next.js 16 · TypeScript |
| Estilo | Tailwind CSS 4 · tema claro e escuro |
| Componentes | shadcn/ui · ícones lucide-react |
| Testes | Playwright |
| Containers | Docker |

---

## Telas

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

## Como executar

### Pré-requisitos

- **Docker** e **Docker Compose**.
- **A API no ar**. Veja [como subir a API](https://github.com/PHSouthier/gestao-solicitacoes-internas-api#como-executar).
- **Node.js 24** e **npm**: só para rodar fora do Docker ou executar os testes.

### Configuração

As variáveis ficam no arquivo `.env`, criado a partir do `.env.example`:

```bash
cp .env.example .env
```

| Variável | Para que serve | Padrão |
|---|---|---|
| `API_INTERNAL_URL` | Endereço da API usado pelo servidor do Next | `http://localhost:3001` |

O `.env` só é usado **fora do Docker**. No Docker, o valor já vem fixado como `http://api:3001`.

### Com Docker

```bash
cd gestao-solicitacoes-internas-web
docker compose up -d --build
```

### Fora do Docker

```bash
npm install
npm run dev     
```

Depois de subir o front, acesse **http://localhost:3000**.

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

## Testes

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
