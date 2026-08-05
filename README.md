# NestPlan

Sistema para organizar produtos de uma reforma ou de uma casa nova. Cada item pode guardar preço,
quantidade, ambiente, categoria, prioridade, status, loja, link, imagem, data desejada e observações.

## Recursos desta versão

- painel com orçamento, total planejado, total comprado e distribuição por ambiente;
- cadastro e edição com `@mantine/form` e validação declarativa com Zod 4;
- exclusão e conclusão de produtos;
- imagem por upload local (até 1,5 MB) ou URL;
- busca, filtros por ambiente e status, e ordenação;
- lista vazia no primeiro acesso: cada produto é incluído pela própria pessoa;
- persistência no `localStorage` do próprio navegador;
- interface responsiva e acessível construída com Mantine 9 e Tabler Icons.

## Executar

Requer Node.js 20.9 ou superior.

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Verificações

```bash
npm run typecheck
npm run lint
npm run build
```

## Estrutura

- `src/app/`: App Router, provider, tema e estilos globais;
- `src/components/dashboard/`: composição da tela e indicadores;
- `src/components/products/`: formulário Mantine, cartões, imagem e detalhes;
- `src/hooks/use-products.ts`: estado e operações do catálogo;
- `src/lib/form-schemas.ts`: schemas Zod e tipos de entrada dos formulários;
- `src/lib/product-storage.ts`: única camada que conhece o `localStorage`;
- `src/types/product.ts`: modelo e opções do domínio.

## Migração futura para backend

Mantenha a interface pública do hook `useProducts` e substitua as funções de
`lib/product-storage.ts` por chamadas HTTP. Assim, a interface não precisa conhecer banco de dados,
autenticação ou detalhes da API.
