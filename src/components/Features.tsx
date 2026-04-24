import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Frete Grátis",
    description: "Em compras acima de R$ 299",
  },
  {
    icon: Shield,
    title: "Pagamento Seguro",
    description: "Seus dados protegidos",
  },
  {
    icon: RotateCcw,
    title: "Troca Fácil",
    description: "Até 30 dias para trocar",
  },
  {
    icon: Headphones,
    title: "Suporte 24h",
    description: "Estamos sempre aqui",
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:shadow-glow transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-semibold text-card-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-card-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
