import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ProductCard = ({ product, onQuickView }: ProductCardProps) => {
  const { addToCart, isLoading } = useCart();
  const needsChoice = (product.sizes?.length ?? 0) > 1 || (product.colors?.length ?? 0) > 1;
  const handleAdd = () => (needsChoice && onQuickView ? onQuickView(product) : addToCart(product, 1, product.sizes?.[0], product.colors?.[0]));
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="card-product group">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded-md">
              Destaque
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isLiked ? "fill-primary text-primary" : ""
              }`}
            />
          </Button>
          {onQuickView && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
              onClick={() => onQuickView(product)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-accent/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            variant="accent"
            className="w-full bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground"
            onClick={handleAdd}
            disabled={isLoading || !product.inStock}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {!product.inStock ? "Esgotado" : needsChoice ? "Escolher opções" : "Adicionar"}
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {product.category}
        </p>
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              R$ {product.originalPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
        </div>
        
        {/* Colors */}
        {product.colors && (
          <div className="flex gap-1 pt-2">
            {product.colors.slice(0, 3).map((color) => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border border-border"
                style={{
                  backgroundColor:
                    color === "Preto" ? "#1a1a1a" :
                    color === "Rosa" ? "#ec4899" :
                    color === "Azul" ? "#3b82f6" :
                    color === "Branco" ? "#ffffff" :
                    color === "Bege" ? "#d4c5a9" :
                    color === "Caramelo" ? "#c68642" :
                    color === "Marinho" ? "#1e3a5f" :
                    color === "Nude" ? "#e8c4b8" :
                    color === "Floral" ? "#f472b6" :
                    "#gray"
                }}
                title={color}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-muted-foreground ml-1">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
