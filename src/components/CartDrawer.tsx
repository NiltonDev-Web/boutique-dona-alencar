import { X, Minus, Plus, ShoppingBag, Trash2, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice, isLoading, checkout } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-accent/60 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-card shadow-2xl animate-fade-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="font-display text-xl font-semibold">Seu Carrinho</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: "calc(100vh - 250px)" }}>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Seu carrinho está vazio</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsCartOpen(false)}
              >
                Continuar Comprando
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.variantId}
                className="flex gap-4 p-4 bg-muted/50 rounded-xl"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {item.selectedSize && <p>Tamanho: {item.selectedSize}</p>}
                    {item.selectedColor && <p>Cor: {item.selectedColor}</p>}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={isLoading}
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={isLoading}
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <span className="font-bold text-primary">
                      R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  disabled={isLoading}
                  onClick={() => removeFromCart(item.variantId)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold text-xl">
                R$ {totalPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <Button size="lg" className="w-full" onClick={checkout} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-4 h-4 mr-2" />Finalizar Compra</>}
            </Button>
            <p className="text-xs text-center text-muted-foreground">Pagamento seguro: cartão, PIX e outras opções na próxima etapa.</p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsCartOpen(false)}
            >
              Continuar Comprando
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
