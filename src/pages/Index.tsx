import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Categories from "@/components/Categories";
import ProductGrid from "@/components/ProductGrid";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const Index = () => {
  useEffect(() => {
    document.title = "Dona Alencar Closet - Moda e Acessórios | Loja Online";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <Categories />
        <ProductGrid />
        <Newsletter />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Index;
