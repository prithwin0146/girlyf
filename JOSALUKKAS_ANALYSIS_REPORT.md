# Jos Alukkas Online Jewellery Store — Comprehensive Analysis Report

> **Source:** https://www.josalukkasonline.com  
> **Analysis Date:** 27 March 2026  
> **Purpose:** Replica reference for Girlyf project

---

## 1. TECH STACK

| Layer | Technology | Details |
|-------|-----------|---------|
| **Frontend Framework** | **Angular 12.0.5** | SSR with Angular Universal (`<!-- This page was prerendered with Angular Universal -->`) |
| **Backend** | **ASP.NET** | `x-powered-by: ASP.NET` header |
| **CDN/Proxy** | **Cloudflare** | `server: cloudflare`, TLS 1.3 |
| **CSS Framework** | **Bootstrap 5** | BS5 CSS variables (`--bs-primary`, etc.) present in bundle |
| **UI Library** | **Angular Material** | `mat-typography` class on `<body>`, `<mat-icon>`, `<mat-error>`, CDK components |
| **Carousel** | **ngx-owl-carousel-o** | `<owl-carousel-o>` components throughout, Owl Carousel CSS |
| **Icons** | **Material Icons + Material Symbols Outlined** | `material-icons`, `material-symbols-outlined` font families |
| **Analytics** | Google Tag Manager (`GTM-PFBM4MW`), Google Ads (`AW-971287059`, `AW-446699642`), DoubleClick (`DC-13407680`) |
| **Retargeting** | Criteo (`117809`) |
| **Live Chat** | Zoho SalesIQ (`zsiqscript`) |
| **Page Analytics** | Zoho PageSense (`839ee10e21ec4b78b49155b8bb4a69c1`) |
| **WhatsApp** | WhatsApp Business API (`8606083922`) |
| **Hosting** | Custom (NOT Shopify) — uses `josalukkasmedia.com` as separate media CDN |
| **Media CDN** | `www.josalukkasmedia.com/Media/CMS/` — separate asset server |
| **Image Format** | AVIF (primary), WebP (fallback), SVG (icons) |
| **Video** | MP4 inline videos (autoplay, loop, muted) |
| **Build Output** | `runtime.js`, `polyfills.js`, `scripts.js`, `main.js` (Angular CLI hashed bundles) |

---

## 2. URL STRUCTURE (from sitemaps)

### Category URLs (NOT Shopify `/collections/` — uses custom paths):
```
/gold-jewellery/Bangle/
/gold-jewellery/Earring/
/gold-jewellery/Ring/
/gold-jewellery/Necklace/
/gold-jewellery/Pendant/
/gold-jewellery/Chain/
/gold-jewellery/Mangalsutra/
/gold-jewellery/Anklet/
/diamond-jewellery/Ring/
/diamond-jewellery/Pendant/
/diamond-jewellery/Bracelet/
/diamond-jewellery/Earring/
/diamond-jewellery/Necklace/
/diamond-jewellery/Nose-Pin/
/platinum-jewellery/Ring/
/platinum-jewellery/Chain/
/platinum-jewellery/Bracelet/
/platinum-jewellery/Pendant/
/gold-coin/
/kids-jewellery/Anklet/
/kids-jewellery/Bracelet/
/our-brands/
/digi-gold/
```

### Product URLs (parameterized):
```
/products/detail/{id}?P={slug}&Prd={id}&Pri={priceId}&CS={category}
Example: /products/detail/4587?P=Traditional-Mullamottu-Necklace-JANTW8&Prd=4587&Pri=4235&CS=Gold_Necklace
```

### Blog URLs:
```
/blog/
/blog/category/18-karat-jewellery/
/blog/category/diamond-jewellery/
/blog/category/gold-coin/
```

### Store Locator URLs:
```
/jewellery-store/Hanamkonda-Telengana/
/jewellery-store/Khammam/
/jewellery-store/Forum-Mall-Bangalore/
```

### Other Pages:
```
/store-locator
/wishlist
/mycart
/sign-in
/akshaya-tritiya
/gold-rate (from sidebar icon)
/our-brands
```

---

## 3. TYPOGRAPHY

| Font | Usage | Weights |
|------|-------|---------|
| **Century Gothic** | **PRIMARY** — used everywhere via `.gl-ff-CenturyGothic` class. Headings, nav, buttons, body text | Regular, 500, 600 |
| **Roboto** | Secondary — Angular Material default, form inputs | 300, 400, 500, 700 |
| **Poppins** | Accent — used for specific headings/badges | 300, 400, 500, 600, 700, 800, 900 |
| **Almarai** | Arabic RTL support | 300, 400, 700, 800 |
| **Calibri** | Fallback for some content | Regular |
| **Material Icons / Material Symbols Outlined** | Icon fonts | — |

> **Custom CSS class:** `.gl-ff-CenturyGothic { font-family: Century Gothic, sans-serif; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }`

---

## 4. COLOR SCHEME

### Primary Brand Colors:
| Color | Hex | Usage |
|-------|-----|-------|
| **Gold/Yellow Accent** | `#e9bb2c` | Menu hover underlines, search borders, accent highlights (most used brand color — 16 occurrences) |
| **Bright Gold** | `#ffc40c` | Menu hover underline (`.menu_hover:after { border-bottom: 2px solid #ffc40c }`), offer gradient |
| **Deep Maroon/Red** | `#571613` / `#571614` | Footer SEO link text hover, deep brand red |
| **Dark Maroon** | `#911b1e` | Offer text color, gradient: `linear-gradient(90deg, #911b1e 10%, #ffc40c 50%, #911b1e 60%)` |
| **Warm Brown** | `#834e32` | Sub-menu category labels (`.sub_menu_clr`) |
| **Rose Brown** | `#b58f7a` | Header background alternate, border separators |
| **Terracotta** | `#98411d` | "Buy Now" / special CTA button text |
| **Light Peach** | `#f4eeeb` | Certification strip background (`.new-certification-bg`) |
| **Soft Peach** | `#fff4ef` | Mobile CTA button background |
| **Link Brown** | `#7f3015` | SEO content link color |

### Neutral Colors:
| Color | Hex | Usage |
|-------|-----|-------|
| **White** | `#fff` / `#ffffff` | Primary background (39 occurrences) |
| **Black** | `#000` / `#000000` | Primary text |
| **Dark Gray** | `#303030` | Header icons (`.header_icon_clr`) |
| **Mid Gray** | `#3b3b3b` | Secondary text |
| **Light Gray** | `#f1f1f1` | Product borders |
| **Lighter Gray** | `#f5f5f5` / `#f6f6f6` | Section backgrounds |
| **Border Gray** | `#e5e5e5` | General borders |
| **Shadow** | `#8282821c` | Header shadow |

### Color Philosophy:
- **White-dominant** clean layout
- Gold/warm tones for CTAs and accents
- Deep maroon/brown for premium feel
- No bright primary colors — entirely warm-tone palette

---

## 5. HOMEPAGE STRUCTURE (Section by Section)

### Section 0: Cookie Consent Modal
- Full-screen overlay with cookie image (`cookie.avif`)
- "We value your privacy" heading
- "Accept All" button
- Link to Privacy Policy

### Section Ad: Hero Video Banner (Top)
- Full-width autoplay/loop video (`aspect-ratio: 16/6` desktop, `15/12` mobile)
- Video source: `josalukkasmedia.com/Media/CMS/Home/AdVideo/tamil.mp4`
- Mute/Unmute button (bottom-right)
- Language selector dropdown (bottom-right)

### Section 1: Banner Carousel (Owl Carousel)
- Full-width image slider
- Images: `jos-alukkas-banner-01.AVIF`, `jos-alukkas-banner-02.AVIF`, `jos-alukkas-banner-11.AVIF`
- Separate responsive images: `*-res-01.AVIF`, `*-res-02.AVIF`
- Special: `akshaya-tritiya.AVIF` (seasonal promotion)

### Section 2: Category Quick Links (Circular/Square Image Carousel)
- Owl carousel of category thumbnails
- Items: **Gold Bangles**, **Gold Earrings**, **Mangalsutra**, **Diamond Pendant**, **Diamond Ring**
- Image style: product shots on white/pink backgrounds

### Section 3: "Jewellery For Her" Banner
- Single large image: `jewellery-for-her.AVIF`

### Section 4: Brand Collections Grid (Owl Carousel)
- Featured brand collections in cards
- Items: **IVY Collections**, **Butterfly**, **Mirage**, **Orchid Collection**, **Solo Collections**

### Section 5: "Celebration Edit" Banner
- Large promotional image: `celebration-edit.AVIF`

### Section 6: "Products Under 2K" Section
- Logo image + Products under ₹2000 banner
- Promotional pricing section

### Section 8: Gifts Section
- Gift-themed banner: `gifts.AVIF`

### Section 9: Trust/Certification Strip (9-Column Grid)
- **9 trust badges** in a horizontal strip on beige background (`#f4eeeb`)
- Grid: `col9` (9 equal columns)
- Each badge: SVG icon + 2 lines of text
- Items (in order):
  1. 🛡️ Safe & Secure Delivery
  2. 🚚 Free Shipping
  3. 💎 Certified Diamonds
  4. 💠 Diamond Exchange
  5. 🏅 BIS HUID Hallmarked
  6. ↩️ 7 Days Return Policy
  7. 🔧 Lifetime Maintenance
  8. 🔍 Complete Transparency
  9. 💰 Guaranteed Buyback
- On mobile: Owl Carousel (scrollable)

### Section 10: Product Customization Video
- Full-width MP4 video (`product-customization.mp4`) with overlay text
- Text: "Delight your loved ones with a special touch. Make your design dreams come true with our customised jewellery collection."
- CTA Button: "Customization Products"

### Section 11: AIRA Brand Video
- Full-width autoplay video: `aira-banner.mp4`
- Separate responsive video

### Section 12: Shop by Gender (3-Column Grid)
- Grid: `grid-template-columns: 1fr 1fr 1fr`
- Cards: **Women**, **Men**, **Kids**
- Each with large AVIF image

### Section 13: Earring Types (4-Column Grid)
- Specific earring sub-categories:
  - **Drops**, **Hoops**, **Jhumkas**, **Studs**

### Section 14: Services Grid (4 Cards)
- **Digi Gold**, **EasyBuy** (scheme), **Gift Card**, **Gold Coin**

### Section 15: Ensemble Banner
- Large banner: `ensemble.avif` / `ensemble-mobile.avif`

### Section 16: Flutter Brand Video
- Brand video: `flutter-banner.mp4` / `flutter-responsive.mp4`

### Section: Recently Viewed Products
- 6-column grid (`grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr`)
- Responsive: 3 cols on tablet, 2 cols on mobile

### Section: SEO Content Block
- Rich text content with headings:
  - "Gold Jewellery Designs Online"
  - "Buy Beautiful Gold Jewellery Designs Online"
  - "Jewellery That Never Fails to Mesmerise, Irresistible in Every Hue" (Yellow/White/Rose gold descriptions)
  - "Embrace the Bling of Gold Jewellery on Every Occasion" (Everyday/Casual/Formal/Party)
  - "Gift Jewellery That Speaks Volumes About Your Love For Them!"
  - "Frequently Asked Questions" (5 FAQs)
- Internal links to categories throughout

### Section: Category Tags Strip
- Horizontal wrapped tag links with bottom border
- Tags: Gold Jewellery, Diamond Jewellery, Platinum Jewellery, Gold Coin, Kids Jewellery, Our Brands, Men's Ring, Gold Pendants, Gold Bangles, Gold Earrings, Gold Necklaces, Gold Mangalsutra, Gold Anklets, Diamond Ring, Diamond Pendant, Diamond Bracelet, Diamond Earring, Diamond Bangles, Diamond Necklaces, Diamond Nosepin, Platinum Ring, Platinum Chain, Platinum Bracelet, Platinum Pendant, Gold Coins, Digi Gold

### Mobile-Only: Category Carousel
- Owl carousel with circular/card category images:
  - Rings, Earrings, Necklaces, Bangles, Pendants, Diamond Rings, Diamond Earrings, Diamond Necklaces

---

## 6. HEADER STRUCTURE

### Layout: Sticky header with multiple rows

#### Row 1: Main Header Bar (`.header_shadow_bottom`)
```
┌──────────────────────────────────────────────────────────────────┐
│ [☰ Hamburger] [Logo]          [Akshaya Tritiya CTA] [Icons Row] │
│                                                                  │
│ Icons Row: [Search🔍] [Store📍] [Wishlist♡] [Cart🛒(0)] [SignIn]│
└──────────────────────────────────────────────────────────────────┘
```

- **Left:** Hamburger menu icon (`ham-burg.png`) + Logo (`logo-red.png`, routerLink="/")
- **Center/Right:** 
  - "Akshaya Tritiya" special CTA with pot icon (seasonal, `.buy_now_btn`)
  - Search icon (opens overlay search)
  - Store Locator icon (Material Symbol: `store`)
  - Wishlist icon (Material Symbol: `favorite_border`, links to `/wishlist`)
  - Cart icon (Material Symbol: `shopping_cart`, badge count, links to `/mycart`)
  - Sign In/Sign Up text (with dropdown on hover)

#### Row 2: Mobile Search Bar (hidden on desktop, `gl-md-d-flex gl-d-none`)
- Full-width search input: "Search for Jewellery on Jos Alukkas"
- "Akshaya Tritiya" CTA button (mobile version)

#### Row 3: Desktop Navigation Bar (`.header_border_bottom`, hidden below xl)
```
Gold Jewellery | Diamond Jewellery | Platinum Jewellery | Silver Jewellery | Daily Wear/18KT | Coins & Gifts | Digi Gold | Gold Scheme
```
- Each menu item has hover mega-menu dropdown with animation (`fadeInOut` trigger)
- Font: Century Gothic, 14px, fw-400, letter-spacing: 1px

### Search Overlay
- Full-width search with suggestions panel:
  - Left 40%: "Did you mean" suggestions with star icon
  - Right 60%: "Popular Products" with product thumbnails

### Hover Dropdowns (Wishlist, Cart, Sign In)
- Slide-out panel (400px wide, absolute positioned right)
- "Welcome to your Saved Items" / "Welcome to your Cart Items"
- Sign In CTA with arrow icon
- "Create an Account" link

### Hamburger Menu (Mobile - Fixed Position Bottom)
- "Welcome to Jos Alukkas Online" heading with yellow bottom border
- Collapsible accordion menu:
  - **Gold Jewellery** → expandable:
    - **Shop For:** Women, Men, Kids & Teens
    - **By Category:** Rings, Earrings, Pendants, Necklaces, Bangles & Bracelets, Mangalsutra, Chains, Anklets
    - **Occasion:** Wedding, Engagement/Reception, ...
  - **Diamond Jewellery** → similar structure
  - **Platinum Jewellery**
  - **Silver Jewellery**
  - **Daily Wear/18KT**
  - **Coins & Gifts**
  - **Digi Gold**
  - **Gold Scheme**
- Additional sidebar items (with icons):
  - 🎁 Gift Card
  - 📍 Store Finder
  - 📞 Customer Support
- Express delivery GIF animation
- Account actions: Create an Account, Sign In

### WhatsApp Floating Button
- Fixed position bottom-right
- WhatsApp icon linking to: `https://api.whatsapp.com/send?phone=918606083922`

---

## 7. NAVIGATION / MEGA MENU STRUCTURE

### Main Navigation Categories:
1. **Gold Jewellery**
   - Shop For: Women, Men, Kids & Teens
   - By Category: Rings, Earrings, Pendants, Necklaces, Bangles & Bracelets, Mangalsutra, Chains, Anklets
   - Occasion: Wedding, Engagement/Reception, ...
   - (Mega menu includes hover product image preview)
2. **Diamond Jewellery** (similar sub-structure)
3. **Platinum Jewellery** (similar sub-structure)
4. **Silver Jewellery** (similar sub-structure)
5. **Daily Wear/18KT**
6. **Coins & Gifts**
7. **Digi Gold** (no sub-menu)
8. **Gold Scheme** (no sub-menu)

### Menu Behavior:
- Desktop: Horizontal nav bar, hover reveals mega dropdown
- Mega dropdown: absolute positioned, full width, with category columns + product image preview
- Mobile: Slide-in from left, accordion-style expand/collapse with `keyboard_arrow_down` icons
- Animation: `@fadeInOut` Angular animation trigger

---

## 8. FOOTER STRUCTURE

### Newsletter Section (Top)
```
┌──────────────────────────────────────────────────────────────┐
│     Subscribe to Jos Alukkas Online                          │
│     Elevate Your Loved Ones Style With Dazzling Gold Jewelery│
│     [📧 Enter your Email address        ] [Subscribe]        │
└──────────────────────────────────────────────────────────────┘
```
- Large heading + subtitle
- Email input with icon + Subscribe button
- Form validation (Angular reactive forms, `ng-invalid`)

### Footer Links (4 Columns)

#### Column 1: SHOPPING
- Gold Jewellery
- Diamond Jewellery
- Platinum Jewellery
- Silver Jewellery
- Gold Coin
- Digi Gold
- Blog (external link to `josalukkasonline.com/blog/`)
- CSR
- Gold Rate

#### Column 2: CUSTOMER SERVICES
- Terms of use
- Scheme Payment (external: `josalukkaseasybuy.com`)
- Shipping Policy
- Cancellation Policy
- Privacy Policy
- Return / Exchange policy
- Gift Card Policy
- Customize Product
- Gold Coin Make On Request

#### Column 3: LET US HELP YOU
- FAQ
- Contact Us
- Payment FAQ
- Ring Size Guide
- Bangle Size Guide
- Education
- Offer Zone
- Sitemap
- HUID FAQ

#### Column 4: OUR COMPANY
- About us
- History
- Career
- Store Locator
- Feedback
- Media

### App Download Section (Right Side)
- QR Code image (`app_qrcode.webp`)
- Google Play Store badge (links to Android app)
- Apple App Store badge (links to iOS app: `id6476931684`)
- Mobile app mockup image

### Bottom Bar
```
┌──────────────────────────────────────────────────────────────┐
│ © 2026 Jos Alukkas Group. All rights reserved...    [Social] │
│                                             FB TW IG Blog YT │
└──────────────────────────────────────────────────────────────┘
```

### Social Media Links:
- Facebook: `facebook.com/josalukkasjewellery`
- Twitter: `twitter.com/josalukkas_`
- Instagram: `instagram.com/josalukkas/`
- Blog: `josalukkasonline.com/blog/`
- YouTube: `youtube.com/channel/UC8aBHFi8Bd7kmXf-FXQl96A`

---

## 9. PRODUCT LISTING PAGE STRUCTURE

### URL Pattern: `/gold-jewellery/{Category}/`
### Filter Parameters: `?MetalColor=Yellow`, `?SubCategoryName=Bangle~Bracelet`

### Product Grid:
- Default: **5 columns** on desktop (`.col5_col4lg_col3sm_new`)
- Tablet (≤1200px): 5 columns
- Mobile: 3 → 2 columns
- Grid gap: 20px

### Product Card Design:
- Image on top with hover effect (`.hover_product`)
- Subtle border: `1px solid #f1f1f1` (`.border_prodect`)
- Box shadow on mobile: `0 3px 6px #0000000d`
- Wishlist icon overlay (`.wishlist-icon`)
- Product name in Century Gothic
- Price display
- Cursor pointer on entire card

### Available Filters (from URL structure):
- **Metal Type:** Gold, Diamond, Platinum, Silver
- **Category:** Ring, Earring, Necklace, Bangle, Pendant, Chain, Mangalsutra, Anklet, Nose-Pin, Bracelet
- **Metal Color:** Yellow, White, Rose
- **Gender:** Women, Men, Kids & Teens
- **Occasion:** Wedding, Engagement/Reception
- **Sub-Category:** Bangle~Bracelet (tilde-separated)
- **Brand:** IVY, Butterfly, Mirage, Orchid, Solo, AIRA, Flutter, Ensemble

---

## 10. PRODUCT DETAIL PAGE STRUCTURE

### URL Pattern: `/products/detail/{id}?P={slug}&Prd={id}&Pri={priceId}&CS={category}`

### Product Naming Convention:
- `Traditional-Mullamottu-Necklace-JANTW8` (Name + SKU code)
- `Designer-Jhumkas-JA2MRY`

### Expected Sections (based on Angular SSR structure):
- Image gallery (main + thumbnails)
- Product name & SKU
- Price breakdown (metal price, making charges, GST)
- Weight/specifications
- Metal type, purity, hallmark info
- BIS HUID number
- Add to cart / Buy now buttons
- Wishlist button
- Size guide (rings, bangles)
- Product customization option
- Recently viewed products carousel
- Similar products carousel (`.box-shadow-owl-similar`)

---

## 11. SPECIAL FEATURES

| Feature | Implementation |
|---------|---------------|
| **Angular Universal SSR** | Server-side pre-rendering for SEO |
| **Auto-play Video Banners** | MP4 videos with mute/unmute + language selector |
| **Multi-language Video** | Language dropdown on hero video (Tamil default) |
| **Product Customization** | "Looking for a customized product" option |
| **Digi Gold** | Digital gold purchasing feature |
| **Gold Scheme / EasyBuy** | Monthly gold savings scheme (separate domain: `josalukkaseasybuy.com`) |
| **Gift Cards** | Gift card purchasing + policy page |
| **Gold Rate Display** | Live gold rate section (sidebar menu item) |
| **Size Guides** | Ring size guide + Bangle size guide pages |
| **Express Delivery** | Animated GIF badge in sidebar |
| **Owl Carousel** | Used for ALL carousels: banners, categories, trust strip, products |
| **Fade Animations** | `appfadeonload`, `appanimateonscroll`, `appfadeonscroll` directives for scroll-triggered animations |
| **Zoho SalesIQ Chat** | "We're Online! How may I help you today?" live chat widget |
| **WhatsApp Integration** | Floating WhatsApp button for customer support |
| **Mobile App** | Android + iOS apps with QR code download |
| **Cookie Consent** | GDPR-style cookie consent modal with image |
| **HUID Tracking** | BIS HUID hallmark verification emphasis |

---

## 12. CSS UTILITY SYSTEM

The site uses a **custom utility CSS system** prefixed with `gl-` (likely "Global Layout"):

```
gl-w-{n}       → width (percentage)
gl-h-{n}p      → height (pixels)
gl-d-flex       → display: flex
gl-d-block      → display: block
gl-d-none       → display: none
gl-d-grid       → display: grid
gl-fd-column    → flex-direction: column
gl-fd-row       → flex-direction: row
gl-justify-sb   → justify-content: space-between
gl-justify-c    → justify-content: center
gl-justify-fs   → justify-content: flex-start
gl-justify-fe   → justify-content: flex-end
gl-align-center → align-items: center
gl-po-rel       → position: relative
gl-po-abs       → position: absolute
gl-po-fix       → position: fixed
gl-po-sti       → position: sticky
gl-zindex-{n}   → z-index
gl-of-hide      → overflow: hidden
gl-cursor-p     → cursor: pointer
gl-m-auto       → margin: auto
gl-mx-{n}       → margin horizontal
gl-my-{n}       → margin vertical
gl-px-{n}       → padding horizontal
gl-py-{n}       → padding vertical
gl-fs-{n}       → font-size
gl-fw-{n}       → font-weight
gl-lh-{n}       → line-height
gl-ls-{n}       → letter-spacing
gl-ta-c         → text-align: center
gl-tt-c         → text-transform: capitalize
gl-tt-u         → text-transform: uppercase
gl-bg-white     → background: white
gl-bg-trans     → background: transparent
gl-text-black   → color: black
gl-wrap         → flex-wrap: wrap

Responsive prefixes:
gl-xs-*         → max-width: 575px
gl-sm-*         → max-width: 767px
gl-md-*         → max-width: 991px (also used as "medium down" breakpoint)
gl-lg-*         → max-width: 1024px
gl-xl-*         → max-width: 1200px
gl-xxl-*        → extra large
gl-pc-gt18-*    → large PC screens (>1800px?)
gl-xlpc-*       → extra large PC
gl-lgpc-*       → large PC
```

---

## 13. ANGULAR COMPONENT ARCHITECTURE

Based on the rendered HTML, the Angular app uses these components:

```
app-root (sc114)
└── mainlayout (sc112)
    ├── app-header (sc98)
    │   ├── Search overlay
    │   ├── Navigation menu
    │   ├── Mobile hamburger menu
    │   └── WhatsApp widget
    ├── router-outlet
    │   └── app-home (sc353)
    │       ├── Video banner section
    │       ├── owl-carousel-o (sc93) × multiple instances
    │       │   └── owl-stage (sc94)
    │       ├── Trust/certification strip
    │       ├── Category grids
    │       ├── Brand collection sections
    │       ├── Customization video section
    │       ├── seo-content (sc346) — FAQ & SEO text
    │       └── Recently viewed products
    └── app-footer (sc111)
        ├── Newsletter subscription
        ├── Footer link columns
        ├── App download section
        └── Social links & copyright
```

---

## 14. MEDIA ASSETS REFERENCE

### Logo:
- `assets/images/header/logo-red.png` — Main red Jos Alukkas logo

### Header Icons:
- `assets/images/header/ham-burg.png` — Hamburger menu
- `assets/images/Home-page/search.svg` — Search icon
- `assets/images/header/login-new.svg` — User/login icon
- `assets/images/header/Pot.svg` — Akshaya Tritiya pot icon
- `assets/images/header/star.svg` — Star icon (search suggestions)
- `assets/images/header/whatsapp.svg` — WhatsApp icon
- `assets/images/header/express-delivery.gif` — Express delivery animation

### Sidebar Menu Icons:
- `assets/images/listing/gold-rate.svg` — Gold rate icon
- `assets/images/listing/gift-card.svg` — Gift card icon
- `assets/images/listing/map.svg` — Store finder icon
- `assets/images/listing/call.svg` — Customer support icon

### Footer:
- `assets/images/footer/app_qrcode.webp` — QR code
- `assets/images/footer/googleplay.webp` — Google Play badge
- `assets/images/footer/appstore.webp` — App Store badge
- `assets/images/footer/facebook.svg`
- `assets/images/footer/Twitter.svg`
- `assets/images/footer/insta.svg`
- `assets/images/footer/blogger.svg`
- `assets/images/footer/youtube.svg`
- `assets/images/home/email-icon.svg` — Newsletter email icon
- `assets/images/home/cookie.avif` — Cookie consent image

---

## 15. KEY DESIGN PRINCIPLES OBSERVED

1. **White-first design** — Clean, minimal backgrounds with warm gold accents
2. **Century Gothic dominance** — Elegant, geometric sans-serif throughout
3. **No prominent gold rate bar** — Gold rate is a sidebar menu item, not a persistent header element
4. **Video-heavy** — Multiple autoplay videos for brand storytelling
5. **Warm color palette** — Maroons, browns, golds — no cool blues/greens
6. **Subtle hover effects** — Gold underline animation on menu items, wobble on icons
7. **Grid-based layouts** — CSS Grid for product listings, trust badges
8. **Carousel-heavy** — Owl Carousel used for nearly every scrollable section
9. **Progressive reveal** — Fade-in animations on scroll (`appfadeonscroll`)
10. **Mobile-first responsive** — Completely different layouts for mobile vs desktop
11. **SSR for SEO** — Angular Universal pre-rendering with rich SEO content at bottom

---

## 16. STORE LOCATIONS (from sitemap)

Stores span across South India:
- **Telangana:** Hanamkonda, Khammam
- **Karnataka:** Forum Mall Bangalore, Jayanagar Bangalore, Rajajinagar
- **Tamil Nadu:** Chennai, Madurai, Trichy, Coimbatore, Salem, Thanjavur, Erode, Hosur, Nagercoil, Tirunelveli, Vellore, Kumbakonam, Pondicherry
- **Kerala:** Alappuzha, Palakkad
- **Andhra Pradesh:** Vijayawada, Visakhapatnam
- **Mangalore** (Karnataka coast)
- **Udupi** (Karnataka coast)

---

*This report was generated by analyzing the raw HTML source (756KB, 11,444 lines), sitemaps, CSS, and structural patterns of josalukkasonline.com for replication purposes.*
