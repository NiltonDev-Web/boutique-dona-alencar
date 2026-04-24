import { Shirt, ShoppingBag, Sparkles, Footprints, Watch, Gem } from "lucide-react";

const categories = [
  { name: "Vestidos", icon: Sparkles, query: "vestidos" },
  { name: "Blusas", icon: Shirt, query: "blusas" },
  { name: "Calças", icon: Shirt, query: "calcas" },
  { name: "Calçados", icon: Footprints, query: "calcados" },
  { name: "Bolsas", icon: ShoppingBag, query: "bolsas" },
  { name: "Acessórios", icon: Gem, query: "acessorios" },
];

const Categories = () => {
  const handleClick = (query: string) => {
    const grid = document.getElementById("produtos");
    grid?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-card-foreground mb-2">
            Navegue por <span className="text-gradient">Categorias</span>
          </h2>
          <p className="text-card-foreground/70">
            Encontre o que combina com o seu estilo
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {categories.map((cat, index) => (
            <button
              key={cat.name}
              onClick={() => handleClick(cat.query)}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-background/5 hover:bg-primary/10 border border-border/50 hover:border-primary transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                <cat.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <span className="font-medium text-sm text-card-foreground group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;