import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductGrid from "@/components/ProductGrid";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>VitrineShop - Moda e Acessórios | Loja Online</title>
        <meta 
          name="description" 
          content="Descubra as últimas tendências em moda feminina. Vestidos, blusas, calças, acessórios e muito mais. Frete grátis acima de R$299." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <Features />
          <ProductGrid />
          <Newsletter />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </>
  );
};

export default Index;
