import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const brl = (n: number) => `R$ ${n.toFixed(2).replace(".", ",")}`;

const Checkout = () => {
  const { items, totalPrice, updateQuantity, removeFromCart, checkout, isLoading } = useCart();

  useEffect(() => {
    document.title = "Finalizar Compra - Dona Alencar Closet";
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-card text-card-foreground rounded-2xl p-8 shadow-card">
          <h1 className="font-display text-2xl font-bold mb-4">Carrinho vazio</h1>
          <p className="mb-6">Adicione produtos ao carrinho para continuar.</p>
          <Link to="/"><Button>Voltar à loja</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-card text-card-foreground border-b border-border py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2"><ArrowLeft className="w-5 h-5" /> Voltar à loja</Link>
          <span className="flex items-center gap-2 text-sm font-medium"><Lock className="w-4 h-4 text-primary" /> Compra segura</span>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-card space-y-6">
          <h1 className="font-display text-2xl font-bold">Resumo do pedido</h1>
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-4 items-center">
              <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                {item.variantTitle && item.variantTitle !== "Default Title" && <p className="text-sm opacity-70">{item.variantTitle}</p>}
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="outline" size="icon" className="h-7 w-7" disabled={isLoading} onClick={() => updateQuantity(item.variantId, item.quantity - 1)}><Minus className="w-3 h-3" /></Button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-7 w-7" disabled={isLoading} onClick={() => updateQuantity(item.variantId, item.quantity + 1)}><Plus className="w-3 h-3" /></Button>
                </div>
              </div>
              <span className="font-semibold text-primary">{brl(item.price * item.quantity)}</span>
              <Button variant="ghost" size="icon" disabled={isLoading} onClick={() => removeFromCart(item.variantId)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          ))}
          <div className="border-t border-border pt-4 flex justify-between text-lg font-bold">
            <span>Subtotal</span><span className="text-primary">{brl(totalPrice)}</span>
          </div>
          <p className="text-sm opacity-70">Frete, descontos e formas de pagamento (cartão, PIX e outras) são escolhidos na próxima etapa.</p>
          <Button size="lg" className="w-full" onClick={checkout} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-4 h-4 mr-2" />Ir para o pagamento</>}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
