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
  gallery?: string[];
  category: string;
  description: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
  sku?: string;
  specifications?: {
    material?: string;
    modelagem?: string;
    cuidados?: string;
  };
  isNew?: boolean;
  isDemo?: boolean;
  variants?: ProductVariant[];
}

export interface CartItem extends Product {
  cartItemId?: string;
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

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountFixed?: number;
  freeShipping?: boolean;
  description: string;
}
