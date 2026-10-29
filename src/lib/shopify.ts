import { toast } from "sonner";
import { Product } from "@/types/product";

const SHOPIFY_API_VERSION = "2026-10";
const SHOPIFY_STORE_PERMANENT_DOMAIN = "dqzjkm-1n.myshopify.com";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = "c350e53d54fbaaee28f468f13b2734c8";

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (response.status === 402) {
    toast.error("Shopify: pagamento necessário", {
      description: "A loja precisa de um plano ativo da Shopify. Acesse https://admin.shopify.com para atualizar.",
    });
    return;
  }
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  if (data.errors) throw new Error(data.errors.map((e: { message: string }) => e.message).join(", "));
  return data;
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges { node {
        id title description handle productType
        priceRange { minVariantPrice { amount currencyCode } }
        compareAtPriceRange { minVariantPrice { amount } }
        images(first: 5) { edges { node { url altText } } }
        variants(first: 50) { edges { node {
          id title availableForSale
          price { amount currencyCode }
          selectedOptions { name value }
        } } }
        options { name values }
      } }
    }
  }
`;

const SIZE_NAMES = ["tamanho", "size"];
const COLOR_NAMES = ["cor", "color", "colour"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(node: any): Product {
  const variants = node.variants.edges.map((e: any) => ({
    id: e.node.id,
    title: e.node.title,
    price: parseFloat(e.node.price.amount),
    available: e.node.availableForSale,
    options: e.node.selectedOptions,
  }));
  const opt = (names: string[]) =>
    node.options.find((o: any) => names.includes(o.name.toLowerCase()))?.values as string[] | undefined;
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const compare = parseFloat(node.compareAtPriceRange?.minVariantPrice?.amount ?? "0");
  return {
    id: node.id,
    handle: node.handle,
    name: node.title,
    price,
    originalPrice: compare > price ? compare : undefined,
    image: node.images.edges[0]?.node.url ?? "/placeholder.svg",
    category: (node.productType || "").toLowerCase(),
    description: node.description,
    sizes: opt(SIZE_NAMES),
    colors: opt(COLOR_NAMES),
    inStock: variants.some((v: { available: boolean }) => v.available),
    variants,
  };
}

export async function fetchProducts(first = 50, query?: string): Promise<Product[]> {
  const data = await storefrontApiRequest(PRODUCTS_QUERY, { first, query });
  return (data?.data?.products?.edges ?? []).map((e: { node: unknown }) => mapProduct(e.node));
}

/** Pick the variant matching chosen size/color; falls back to first available. */
export function findVariant(product: Product, size?: string, color?: string) {
  const variants = product.variants ?? [];
  const match = (v: (typeof variants)[number], names: string[], val?: string) =>
    !val || v.options.some((o) => names.includes(o.name.toLowerCase()) && o.value === val);
  return (
    variants.find((v) => match(v, SIZE_NAMES, size) && match(v, COLOR_NAMES, color)) ??
    variants.find((v) => v.available) ??
    variants[0]
  );
}

const LINES = `lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }`;
const CART_QUERY = `query cart($id: ID!) { cart(id: $id) { id totalQuantity } }`;
const CART_CREATE = `mutation cartCreate($input: CartInput!) { cartCreate(input: $input) { cart { id checkoutUrl ${LINES} } userErrors { field message } } }`;
const CART_ADD = `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { id ${LINES} } userErrors { field message } } }`;
const CART_UPDATE = `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { id } userErrors { field message } } }`;
const CART_REMOVE = `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { id } userErrors { field message } } }`;

type UserError = { field: string[] | null; message: string };
const notFound = (errs: UserError[]) =>
  errs.some((e) => /cart not found|does not exist/i.test(e.message));

function formatCheckoutUrl(url: string) {
  try {
    const u = new URL(url);
    u.searchParams.set("channel", "online_store");
    return u.toString();
  } catch {
    return url;
  }
}

type LineEdge = { node: { id: string; merchandise: { id: string } } };

export async function createShopifyCart(variantId: string, quantity: number) {
  const data = await storefrontApiRequest(CART_CREATE, { input: { lines: [{ quantity, merchandiseId: variantId }] } });
  const errs = data?.data?.cartCreate?.userErrors ?? [];
  if (errs.length) throw new Error(errs[0].message);
  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return null;
  return { cartId: cart.id as string, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId: cart.lines.edges[0]?.node.id as string };
}

export async function addLineToShopifyCart(cartId: string, variantId: string, quantity: number) {
  const data = await storefrontApiRequest(CART_ADD, { cartId, lines: [{ quantity, merchandiseId: variantId }] });
  const errs = data?.data?.cartLinesAdd?.userErrors ?? [];
  if (notFound(errs)) return { success: false, cartNotFound: true };
  if (errs.length) throw new Error(errs[0].message);
  const edges: LineEdge[] = data?.data?.cartLinesAdd?.cart?.lines?.edges ?? [];
  return { success: true, lineId: edges.find((l) => l.node.merchandise.id === variantId)?.node.id };
}

export async function updateShopifyCartLine(cartId: string, lineId: string, quantity: number) {
  const data = await storefrontApiRequest(CART_UPDATE, { cartId, lines: [{ id: lineId, quantity }] });
  const errs = data?.data?.cartLinesUpdate?.userErrors ?? [];
  if (notFound(errs)) return { success: false, cartNotFound: true };
  if (errs.length) throw new Error(errs[0].message);
  return { success: true };
}

export async function removeLineFromShopifyCart(cartId: string, lineId: string) {
  const data = await storefrontApiRequest(CART_REMOVE, { cartId, lineIds: [lineId] });
  const errs = data?.data?.cartLinesRemove?.userErrors ?? [];
  if (notFound(errs)) return { success: false, cartNotFound: true };
  if (errs.length) throw new Error(errs[0].message);
  return { success: true };
}

export async function fetchCartQuantity(cartId: string): Promise<number | null> {
  const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
  if (!data) return null;
  return data?.data?.cart?.totalQuantity ?? 0;
}
