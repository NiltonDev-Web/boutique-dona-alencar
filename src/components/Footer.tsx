import { Instagram, Facebook, Twitter, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: "Novidades", href: "#" },
      { name: "Vestidos", href: "#" },
      { name: "Acessórios", href: "#" },
      { name: "Promoções", href: "#" },
    ],
    help: [
      { name: "FAQ", href: "#" },
      { name: "Frete e Entrega", href: "#" },
      { name: "Trocas e Devoluções", href: "#" },
      { name: "Contato", href: "#" },
    ],
    company: [
      { name: "Sobre Nós", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Trabalhe Conosco", href: "#" },
      { name: "Parceiros", href: "#" },
    ],
  };

  return (
    <footer className="bg-accent text-accent-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">V</span>
              </div>
              <span className="font-display text-2xl font-semibold">
                Vitrine<span className="text-primary">Shop</span>
              </span>
            </div>
            <p className="text-accent-foreground/70 text-sm">
              Moda que inspira, qualidade que encanta. Seu estilo, nossa paixão.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-accent-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-accent-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-accent-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Comprar</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-accent-foreground/70 hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Ajuda</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-accent-foreground/70 hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-accent-foreground/70 hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-accent-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-accent-foreground/60">
              © {currentYear} VitrineShop. Todos os direitos reservados.
            </p>
            <p className="text-sm text-accent-foreground/60 flex items-center gap-1">
              Feito com <Heart className="w-4 h-4 text-primary" /> no Brasil
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
