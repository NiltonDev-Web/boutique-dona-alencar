import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Wallet, Banknote, QrCode, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

type PaymentMethod = "credit" | "debit" | "pix" | "boleto";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    document.title = "Checkout - VitrineShop";
  }, []);

  const paymentMethods = [
    { id: "credit" as const, name: "Cartão de Crédito", icon: CreditCard, description: "Até 12x sem juros" },
    { id: "debit" as const, name: "Cartão de Débito", icon: Wallet, description: "Débito à vista" },
    { id: "pix" as const, name: "PIX", icon: QrCode, description: "5% de desconto" },
    { id: "boleto" as const, name: "Boleto", icon: Banknote, description: "Vencimento em 3 dias" },
  ];

  const shipping = totalPrice >= 299 ? 0 : 29.90;
  const discount = paymentMethod === "pix" ? totalPrice * 0.05 : 0;
  const finalTotal = totalPrice + shipping - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Pedido realizado com sucesso! Você receberá um e-mail de confirmação.");
    clearCart();
    setIsProcessing(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Carrinho Vazio</h1>
          <p className="text-muted-foreground mb-6">Adicione produtos ao carrinho para continuar.</p>
          <Link to="/">
            <Button>Voltar à Loja</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar à loja</span>
            </Link>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Compra Segura</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-8 text-center">
          Finalizar <span className="text-gradient">Compra</span>
        </h1>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold mb-4">Dados Pessoais</h2>
              <div className="grid gap-4">
                <input
                  type="text"
                  placeholder="Nome completo"
                  className="input-styled"
                  required
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="E-mail"
                    className="input-styled"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Telefone"
                    className="input-styled"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="CPF"
                  className="input-styled"
                  required
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold mb-4">Endereço de Entrega</h2>
              <div className="grid gap-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="CEP"
                    className="input-styled"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Cidade"
                    className="input-styled sm:col-span-2"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Endereço"
                  className="input-styled"
                  required
                />
                <div className="grid sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Número"
                    className="input-styled"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Complemento"
                    className="input-styled sm:col-span-2"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Bairro"
                  className="input-styled"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold mb-4">Forma de Pagamento</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="flex items-center gap-3">
                      <method.icon className={`w-6 h-6 ${paymentMethod === method.id ? "text-primary" : "text-muted-foreground"}`} />
                      <div>
                        <div className="font-semibold">{method.name}</div>
                        <div className="text-xs text-muted-foreground">{method.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Card Details */}
              {(paymentMethod === "credit" || paymentMethod === "debit") && (
                <div className="mt-6 space-y-4 animate-fade-in">
                  <input
                    type="text"
                    placeholder="Número do cartão"
                    className="input-styled"
                    required
                  />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="input-styled"
                      required
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="input-styled"
                      required
                    />
                    <select className="input-styled" required>
                      <option value="">Parcelas</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                        <option key={n} value={n}>
                          {n}x de R$ {(finalTotal / n).toFixed(2).replace(".", ",")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Nome impresso no cartão"
                    className="input-styled"
                    required
                  />
                </div>
              )}

              {paymentMethod === "pix" && (
                <div className="mt-6 p-4 bg-primary/5 rounded-xl animate-fade-in">
                  <p className="text-sm text-muted-foreground">
                    Ao confirmar, você receberá o QR Code do PIX para pagamento. O pedido será confirmado automaticamente após o pagamento.
                  </p>
                </div>
              )}

              {paymentMethod === "boleto" && (
                <div className="mt-6 p-4 bg-primary/5 rounded-xl animate-fade-in">
                  <p className="text-sm text-muted-foreground">
                    O boleto será gerado após a confirmação. O prazo de entrega começa a contar após a compensação do pagamento (até 3 dias úteis).
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-card rounded-2xl p-6 shadow-card space-y-6">
              <h2 className="font-display text-xl font-semibold">Resumo do Pedido</h2>

              {/* Items */}
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Qtd: {item.quantity}
                        {item.selectedSize && ` | Tam: ${item.selectedSize}`}
                      </p>
                      <p className="font-semibold text-primary mt-1">
                        R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className={shipping === 0 ? "text-green-500" : ""}>
                    {shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2).replace(".", ",")}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Desconto PIX (5%)</span>
                    <span>- R$ {discount.toFixed(2).replace(".", ",")}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">R$ {finalTotal.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    Confirmar Pedido
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                <span>Seus dados estão protegidos</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
