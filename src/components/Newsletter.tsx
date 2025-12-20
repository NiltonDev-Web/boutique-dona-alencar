import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Você foi inscrito com sucesso!");
      setEmail("");
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Newsletter Exclusiva
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Fique por Dentro das <span className="text-gradient">Novidades</span>
          </h2>
          
          <p className="text-muted-foreground mb-8">
            Cadastre-se para receber ofertas exclusivas, lançamentos e dicas de moda direto no seu e-mail.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-styled pl-12"
                required
              />
            </div>
            <Button type="submit" size="lg">
              Inscrever-se
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            Ao se inscrever, você concorda com nossa política de privacidade.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
