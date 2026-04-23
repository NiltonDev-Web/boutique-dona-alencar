
## Rebrand to "Dona Alencar Closet"

Replace the current "VitrineShop" branding with the uploaded "Dona Alencar Closet" logo across the site.

### Changes

1. **Add logo asset**
   - Copy `user-uploads://WhatsApp_Image_2026-04-23_at_20.14.06.jpeg` to `src/assets/dona-alencar-logo.jpeg`.

2. **Update `src/components/Header.tsx`**
   - Import the logo image.
   - Replace the gradient circle "V" + "VitrineShop" text with an `<img>` of the new logo (rounded, ~40px tall) next to the text "Dona Alencar **Closet**" (Closet highlighted in primary color).

3. **Update `src/components/Footer.tsx`**
   - Same logo + brand swap as the header.
   - Update the tagline copy slightly so it reads naturally for "Dona Alencar Closet".
   - Update the copyright line: `© {year} Dona Alencar Closet. Todos os direitos reservados.`

4. **Update `src/pages/Index.tsx`**
   - Change `document.title` to `"Dona Alencar Closet - Moda e Acessórios | Loja Online"`.

5. **Update `index.html`**
   - Update `<title>` and meta description/og tags to reference "Dona Alencar Closet".

### Notes
- Color palette (pink/blue/black) stays unchanged — only branding swaps.
- The logo image is square; it will be displayed in a rounded container to match the existing header style.
