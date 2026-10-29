# Dona Alencar Closet

Loja virtual de moda e acessórios. A aplicação usa React e Vite no frontend e a Shopify Storefront API para consultar produtos, administrar o carrinho e encaminhar o cliente ao checkout hospedado da loja.

## Funcionalidades

- Catálogo de produtos carregado da Shopify, com filtros por categoria.
- Seleção de variantes, como tamanho e cor, conforme as opções disponíveis no catálogo.
- Carrinho sincronizado com a Shopify, com atualização de quantidades e remoção de itens.
- Finalização da compra no checkout hospedado pela Shopify.
- Consulta de preço e disponibilidade diretamente das variantes da loja.

## Requisitos

- Node.js e npm
- Uma loja Shopify configurada com produtos, variantes disponíveis e canal de vendas online ativo
- Credenciais de acesso público à Shopify Storefront API

## Executar localmente

```sh
npm install
npm run dev
```

O Vite informa no terminal o endereço local da aplicação.

## Configuração da Shopify

As configurações de conexão com a Shopify estão em [`src/lib/shopify.ts`](./src/lib/shopify.ts): domínio permanente da loja, versão da API Storefront e token público Storefront. Ao conectar outra loja, atualize esses valores com as credenciais **Storefront públicas** correspondentes.

Use somente credenciais públicas da Storefront API no frontend. Nunca coloque tokens de Admin API, senhas ou outros segredos no código cliente ou no repositório. O checkout e o processamento do pagamento acontecem na Shopify, não nesta aplicação.

Se a Shopify retornar que o pagamento é necessário ou se a loja não permitir criar carrinhos, confira o plano da loja, o canal de vendas online e as permissões/configurações da Storefront API.

## Produtos de demonstração

Para testar o catálogo e o carrinho sem cadastrar produtos na Shopify, crie um arquivo `.env.local` na raiz com:

```env
VITE_DEMO_PRODUCTS=true
```

Inicie ou reinicie `npm run dev`. O catálogo passa a mostrar dois produtos de exemplo em cada categoria (vestidos, blusas, calças, calçados, bolsas e acessórios), com imagens, opções e preços ilustrativos em reais. Produtos de demonstração podem ser adicionados, alterados e removidos no carrinho local, mas não podem ser misturados a produtos Shopify nem enviados para o checkout ou cobrados. Para voltar ao catálogo normal, remova a variável do `.env.local` ou defina `VITE_DEMO_PRODUCTS=false`.

Os preços são valores de referência para testes e não uma pesquisa de mercado ao vivo nem preços de venda da loja. As imagens são carregadas do Unsplash pela internet.

## Comandos

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run build:dev` | Gera uma versão de desenvolvimento |
| `npm run preview` | Pré-visualiza a versão compilada |
| `npm run lint` | Executa o ESLint |

## Tecnologias

- React 18 e TypeScript
- Vite
- Tailwind CSS e componentes shadcn/ui
- React Router
- TanStack Query
- Shopify Storefront API (GraphQL)
- Lucide React e Sonner

## Estrutura principal

```text
src/
  components/   Componentes da loja, catálogo e carrinho
  contexts/     Estado e sincronização do carrinho Shopify
  lib/          Integração com Shopify
  pages/        Páginas da loja e checkout
  types/        Tipos de produtos, variantes e itens do carrinho
```

## Publicação

Execute `npm run build` e publique o conteúdo de `dist/` em um host estático. Como a aplicação usa rotas no navegador, configure o host para encaminhar rotas desconhecidas para `index.html`.
