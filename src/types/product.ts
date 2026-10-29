export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  available: boolean;
  options: Array<{ name: string; value: string }>;
}

export interface Product {
  id: string;
  handle?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  featured?: boolean;
  variants?: ProductVariant[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  variantId: string;
  variantTitle?: string;
  lineId: string | null;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
