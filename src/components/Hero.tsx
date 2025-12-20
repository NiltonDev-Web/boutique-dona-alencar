import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Nova Coleção 2024
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Descubra seu
              <span className="block text-gradient">Estilo Único</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Explore nossa coleção exclusiva de roupas e acessórios. 
              Moda que inspira, qualidade que encanta.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="xl" className="group">
                Ver Coleção
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                Ofertas Especiais
              </Button>
            </div>

            {/* Stats */}
            <div className="flex justify-center lg:justify-start gap-8 pt-8">
              {[
                { number: "500+", label: "Produtos" },
                { number: "10k+", label: "Clientes" },
                { number: "4.9", label: "Avaliação" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          <div className="relative hidden lg:block animate-fade-in-right" style={{ animationDelay: "0.3s" }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-card animate-float">
                  <img
                    src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=400&fit=crop"
                    alt="Fashion Model"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-card animate-float" style={{ animationDelay: "0.5s" }}>
                  <img
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&h=250&fit=crop"
                    alt="Fashion Accessories"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-card animate-float" style={{ animationDelay: "0.3s" }}>
                  <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=250&fit=crop"
                    alt="Shopping"
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-card animate-float" style={{ animationDelay: "0.7s" }}>
                  <img
                    src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=400&fit=crop"
                    alt="Fashion Store"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground px-6 py-3 rounded-xl shadow-lg animate-float">
              <div className="font-display text-lg font-bold">-30%</div>
              <div className="text-xs opacity-80">Em selecionados</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
