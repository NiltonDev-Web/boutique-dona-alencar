import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { CartItem, Product } from "@/types/product";
import { toast } from "sonner";
import {
  addLineToShopifyCart,
  createShopifyCart,
  fetchCartQuantity,
  findVariant,
  removeLineFromShopifyCart,
  updateShopifyCartLine,
} from "@/lib/shopify";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => Promise<void>;
  removeFromCart: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  checkout: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const STORAGE_KEY = "shopify-cart";
const CartContext = createContext<CartContextType | undefined>(undefined);

type Persisted = { items: CartItem[]; cartId: string | null; checkoutUrl: string | null };
const load = (): Persisted => {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch { /* ignore */ }
  return { items: [], cartId: null, checkoutUrl: null };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<Persisted>(load);
  const stateRef = useRef(state);
  stateRef.current = state;
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const reset = useCallback(() => setState({ items: [], cartId: null, checkoutUrl: null }), []);

  // Clear local cart once the Shopify cart was completed/expired (e.g. after checkout)
  const sync = useCallback(async () => {
    const { cartId } = stateRef.current;
    if (!cartId) return;
    try {
      const qty = await fetchCartQuantity(cartId);
      if (qty === 0) reset();
    } catch (e) {
      console.error("Cart sync failed", e);
    }
  }, [reset]);

  useEffect(() => {
    sync();
    const onVis = () => document.visibilityState === "visible" && sync();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [sync]);

  useEffect(() => {
    if (isCartOpen) sync();
  }, [isCartOpen, sync]);

  const run = async (fn: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await fn();
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível atualizar o carrinho. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) =>
    run(async () => {
      if ((product.sizes?.length ?? 0) > 1 && !size) {
        toast.error("Escolha um tamanho antes de adicionar.");
        return;
      }
      if ((product.colors?.length ?? 0) > 1 && !color) {
        toast.error("Escolha uma cor antes de adicionar.");
        return;
      }
      const variant = findVariant(product, size, color);
      if (!variant || !variant.available) {
        toast.error("Produto indisponível nesta opção.");
        return;
      }
      const { items, cartId } = stateRef.current;
      const hasDemoItems = items.some((item) => item.isDemo);
      if (items.length > 0 && hasDemoItems !== Boolean(product.isDemo)) {
        toast.error("Não é possível misturar produtos de teste com produtos da loja.");
        return;
      }

      const existing = items.find((i) => i.variantId === variant.id);
      const base: CartItem = {
        ...product,
        price: variant.price,
        quantity,
        selectedSize: size,
        selectedColor: color,
        variantId: variant.id,
        variantTitle: variant.title,
        lineId: null,
      };

      if (product.isDemo) {
        setState((current) => {
          const currentItem = current.items.find((item) => item.variantId === variant.id);
          const nextItems = currentItem
            ? current.items.map((item) =>
                item.variantId === variant.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              )
            : [...current.items, base];
          return { items: nextItems, cartId: null, checkoutUrl: null };
        });
      } else if (!cartId) {
        const res = await createShopifyCart(variant.id, quantity);
        if (!res) throw new Error("cart create failed");
        setState({ cartId: res.cartId, checkoutUrl: res.checkoutUrl, items: [{ ...base, lineId: res.lineId }] });
      } else if (existing?.lineId) {
        const newQty = existing.quantity + quantity;
        const res = await updateShopifyCartLine(cartId, existing.lineId, newQty);
        if (res.cartNotFound) { reset(); return addToCart(product, quantity, size, color); }
        setState((s) => ({ ...s, items: s.items.map((i) => (i.variantId === variant.id ? { ...i, quantity: newQty } : i)) }));
      } else {
        const res = await addLineToShopifyCart(cartId, variant.id, quantity);
        if (res.cartNotFound) { reset(); return addToCart(product, quantity, size, color); }
        setState((s) => ({ ...s, items: [...s.items, { ...base, lineId: res.lineId ?? null }] }));
      }
      toast.success(`${product.name} adicionado ao carrinho!`, { position: "top-center" });
      setIsCartOpen(true);
    });

  const removeFromCart = (variantId: string) =>
    run(async () => {
      const { items, cartId } = stateRef.current;
      const item = items.find((i) => i.variantId === variantId);
      if (item?.isDemo) {
        setState((current) => {
          const nextItems = current.items.filter((currentItem) => currentItem.variantId !== variantId);
          return nextItems.length
            ? { ...current, items: nextItems }
            : { items: [], cartId: null, checkoutUrl: null };
        });
        toast.info("Produto de teste removido do carrinho", { position: "top-center" });
        return;
      }
      if (!item?.lineId || !cartId) return;
      const res = await removeLineFromShopifyCart(cartId, item.lineId);
      if (res.cartNotFound) return reset();
      setState((s) => {
        const next = s.items.filter((i) => i.variantId !== variantId);
        return next.length ? { ...s, items: next } : { items: [], cartId: null, checkoutUrl: null };
      });
      toast.info("Produto removido do carrinho", { position: "top-center" });
    });

  const updateQuantity = async (variantId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(variantId);
    return run(async () => {
      const { items, cartId } = stateRef.current;
      const item = items.find((i) => i.variantId === variantId);
      if (item?.isDemo) {
        setState((current) => ({
          ...current,
          items: current.items.map((currentItem) =>
            currentItem.variantId === variantId
              ? { ...currentItem, quantity }
              : currentItem,
          ),
        }));
        return;
      }
      if (!item?.lineId || !cartId) return;
      const res = await updateShopifyCartLine(cartId, item.lineId, quantity);
      if (res.cartNotFound) return reset();
      setState((s) => ({ ...s, items: s.items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)) }));
    });
  };

  const checkout = () => {
    if (stateRef.current.items.some((item) => item.isDemo)) {
      toast.info("Carrinho de teste: nenhum pedido ou pagamento será enviado à Shopify.");
      setIsCartOpen(false);
      return;
    }

    const url = stateRef.current.checkoutUrl;
    if (!url) {
      toast.error("Seu carrinho está vazio.");
      return;
    }
    window.open(url, "_blank");
    setIsCartOpen(false);
  };

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart: reset,
        checkout,
        totalItems,
        totalPrice,
        isLoading,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
