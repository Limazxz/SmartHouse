# SmartHouse — Front-end (React + Vite)

Aplicação front-end do projeto SmartHouse construída com React e Vite, com Hot Module Replacement (HMR) e linting via ESLint para garantir qualidade do código.

## Visão geral
- Objetivo: Interface rápida e moderna para o SmartHouse.
- Stack: React (UI) + Vite (dev server/bundler) + ESLint (lint).
- HMR: recarrega componentes instantaneamente durante o desenvolvimento.

## Tecnologias e o que cada uma faz
- React: biblioteca para construir interfaces de usuário com componentes.
- Vite: servidor de desenvolvimento rápido com build otimizado para produção.
- HMR: atualiza componentes em tempo real sem recarregar a página inteira.
- ESLint: analisa o código e aponta problemas de estilo e bugs comuns.
- Plugins React do Vite (um dos dois, conforme o package.json):
  - @vitejs/plugin-react (Babel): Fast Refresh usando Babel.
  - @vitejs/plugin-react-swc (SWC): Fast Refresh usando SWC (mais rápido).
  Verifique qual está instalado no package.json e em vite.config.*.

## Requisitos
- Node.js 18+ (recomendado 18 LTS ou 20 LTS)
- Gerenciador de pacotes: npm, pnpm ou yarn

## Instalação
- Clonar o repositório e entrar na pasta do projeto.
- Instalar dependências:
  - npm install
  - ou pnpm install / yarn
- Iniciar em desenvolvimento (com HMR):
  - npm run dev
  - Acesse a URL exibida no terminal (geralmente http://localhost:5173).

## Scripts úteis
- Desenvolvimento: `npm run dev`
- Build de produção: `npm run build` (gera a pasta `dist/`)
- Preview local do build: `npm run preview`
- Lint (se configurado no package.json): `npm run lint`

## Estrutura de pastas (padrão Vite + React)
- `index.html`: ponto de entrada HTML.
- `src/main.jsx`: inicializa React e monta a aplicação.
- `src/App.jsx`: componente raiz.
- `src/assets/`: imagens, ícones, fontes, etc.
- `src/components/`: componentes reutilizáveis.
- `vite.config.*`: configuração do Vite e plugins.
- `.eslintrc.*`: regras do ESLint (se presente).
- `package.json`: dependências e scripts.

Observação: nomes e arquivos podem variar; use como referência geral.

## Variáveis de ambiente
- Arquivos suportados: `.env`, `.env.development`, `.env.production`, `.env.local`.
- Por segurança, o Vite só expõe variáveis que começam com `VITE_`.
- Exemplo:
  - VITE_API_URL=https://api.exemplo.com
- Uso no código:
  - `import.meta.env.VITE_API_URL`

## ESLint
- Executa regras para manter consistência e evitar erros comuns.
- Ajuste as regras em `.eslintrc.*`.
- Dica: integre com o editor (VS Code + ESLint extension) para feedback em tempo real.

## Build e deploy
- Gerar build de produção:
  - `npm run build`
- Pré-visualizar localmente:
  - `npm run preview`
- Publicar a pasta `dist/` em um servidor estático (Vercel, Netlify, GitHub Pages, Nginx, etc.).

## Trocar entre Babel e SWC (opcional)
- Verifique no `package.json` qual plugin React está instalado.
- No `vite.config.*`, o plugin ativo deve corresponder:
  - plugin-react (Babel) ou plugin-react-swc (SWC).
- Use SWC para builds mais rápidos, Babel para ecossistema mais maduro.

## Dicas de desenvolvimento
- Componentizar ao máximo e manter pastas por domínio/feature.
- Usar variáveis `VITE_` para endpoints/configurações.
- Rodar `lint` antes de commits (se houver script/hook).
- Ativar HMR com `npm run dev` para feedback rápido.

---
Qualquer dúvida sobre configuração adicional, verifique `package.json` e `vite.config.*` para confirmar o plugin React utilizado e scripts disponíveis.
