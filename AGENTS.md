<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# NestPlan — padrões do projeto

## Objetivo

Aplicação para planejar compras de reforma ou casa nova. A primeira fase usa `localStorage`;
uma API substituirá somente a camada em `lib/product-storage.ts` e o hook `hooks/use-products.ts`.

## Arquitetura obrigatória

- Use Next.js App Router. Páginas e layouts são Server Components por padrão.
- Adicione `"use client"` apenas em componentes que usam eventos, hooks ou APIs do navegador.
- Todo código de aplicação deve ser TypeScript estrito (`.ts` ou `.tsx`). Não use `any`.
- Todo o código de aplicação fica dentro de `src/`. Rotas ficam em `src/app` e componentes em
  `src/components`.
- Tipos de domínio ficam em `src/types/`.
- Acesso ao `localStorage` fica isolado em `src/lib/product-storage.ts`. Componentes não acessam
  armazenamento diretamente.
- Regras de estado e mutações ficam em hooks. Componentes recebem dados e callbacks tipados.
- Componentes de página ficam em `src/components/dashboard`; componentes do domínio de produto
  ficam em `src/components/products`.
- Todo componente React dentro de `src/components` deve ser implementado em um arquivo `index.tsx`.
  Componentes internos ficam em pastas próprias nomeadas em PascalCase (por exemplo,
  `src/components/dashboard/PageHeader/index.tsx`); o `index.tsx` na raiz de uma área pode ser seu
  ponto público de composição, como `src/components/dashboard/index.tsx`. Não crie arquivos de
  componente nomeados como `page-header.tsx`; arquivos auxiliares sem JSX, como `types.ts`, podem
  ter nomes descritivos.
- Arquivos especiais do App Router (`page.tsx`, `layout.tsx`, `loading.tsx` e similares) seguem a
  convenção do Next.js e são a única exceção ao padrão de `index.tsx`.
- Layouts compartilhados de rota concentram o shell visual e os providers necessários. Componentes
  de página não duplicam `AppShell`, navbar ou containers que pertencem ao layout da rota.
- Componentes de página apenas orquestram seções, dados e callbacks. Extraia para um componente
  próprio cada bloco visual com responsabilidade independente; mantenha filtros, estado de diálogos
  e mutações em hooks específicos da funcionalidade.
- Formulários usam `@mantine/form` e schemas Zod 4 integrados pelo `schemaResolver`; não adicione
  outra biblioteca de formulários.
- Prefira funções pequenas com nomes que expliquem a intenção. Evite abstrações genéricas antes de
  existir mais de um caso real de uso.

## Interface

- Use Mantine 9 para componentes, layout, tema, formulários e notificações.
- Reuse componentes de `@mantine/core`; não recrie manualmente botões, diálogos, selects, menus,
  notificações ou formulários equivalentes.
- Use os tokens do tema em `src/app/theme.ts` e estilos globais apenas em `src/app/globals.css`.
- Use `@tabler/icons-react` para os ícones da interface.
- Preserve acessibilidade: labels, foco visível, texto alternativo e interação por teclado.
- Toda nova tela deve funcionar em celular, tablet e desktop.
- Mantenha a linguagem visual atual: fundo quente, verde escuro, terracota como destaque e bordas suaves.

## Qualidade

- Antes de concluir uma alteração, execute `npm run typecheck`, `npm run lint` e `npm run build`.
- Use `npm run lint:fix` para correções seguras do Biome e revise o resultado.
- Atualize este arquivo e o README quando uma decisão arquitetural mudar.
