import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import ProductModal from "./ProductModal";
import { Product } from "@/types/product";
import { demoProducts } from "@/data/demo-products";

const ProductGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: shopifyProducts = [], isLoading } = useQuery({ queryKey: ["shopify-products"], queryFn: () => fetchProducts(50) });
  const products = import.meta.env.VITE_DEMO_PRODUCTS === "true"
    ? [...shopifyProducts, ...demoProducts]
    : shopifyProducts;
  const categories = [
    { id: "all", name: "Todos", icon: "✨" },
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))).map((c) => ({ id: c, name: c.charAt(0).toUpperCase() + c.slice(1), icon: "" })),
  ];
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section id="products" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Nossa <span className="text-gradient">Coleção</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore nossas peças selecionadas com carinho para você
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="transition-all duration-300"
            >
              {category.icon && <span className="mr-2">{category.icon}</span>}
              {category.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard
                product={product}
                onQuickView={setSelectedProduct}
              />
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        )}
        {!isLoading && filteredProducts.length === 0 && (
          <p className="text-center text-muted-foreground py-16">Nenhum produto encontrado</p>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
};

export default ProductGrid;
