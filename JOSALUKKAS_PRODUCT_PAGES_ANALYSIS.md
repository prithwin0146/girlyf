# Jos Alukkas Online - Product Pages Structural Analysis
> Source: https://www.josalukkasonline.com  
> Tech Stack: **Angular 12.0.5** with SSR (Server-Side Rendering), Bootstrap grid  
> Backend API: `https://backend.josalukkasonline.com/api/`  
> Media CDN: `https://www.josalukkasmedia.com/Media/`  
> CMS CDN: `https://www.josalukkasmedia.com/Media/CMS/`  
> Date Analyzed: 27 March 2026

---

## 1. PRODUCT LISTING PAGE (`/collections/{category}`)

### 1.1 Page Layout
- **Structure**: Full-width page with **top filter bar** + product grid (NO left sidebar)
- **Desktop**: Horizontal filter bar at top → product grid below (4 columns)
- **Tablet**: Horizontal filter bar → 3 columns grid
- **Mobile**: Sticky bottom filter/sort buttons → 2 columns grid
- **Content width**: 2% padding left/right (responsive breakpoints at 1366px, 1200px, 1024px, 991px, 767px, 575px)

### 1.2 Filter System (Top Horizontal Bar + Slide-out Panel)

#### Filter Types (from `FiltersList` + `CoreFiltersList`):
| Filter Name | Type | Details |
|---|---|---|
| **Sub Category Name** | Multi-select checkboxes | e.g., "Necklace", "Choker", "Haram" (dynamically loaded per category) |
| **Price Range** | Dual slider/dropdown | Presets: ₹0, ₹10,000, ₹20,000, ₹40,000, ₹70,000, ₹100,000, ₹125,000, ₹149,999+ |
| **Weight Range** | Dual slider/dropdown | Presets: Min, 4gm, 8gm, 12gm, 16gm, 20gm, 24gm, 28gm, 32gm, 36gm, 40gm, 40gm+ |
| **Design Style** | Multi-select | Only shown for Gold and 18KT categories |
| **Collection** | Multi-select | Only shown for Gold and 18KT categories |
| **Gift By Occasion** | Multi-select | Hidden for gold coins |
| **Occasion Jewellery** | Multi-select | Hidden for gold coins |
| **Kids/Teens** | Multi-select | Only shown for Gold and Gold Coin categories |
| **Ring Size** | Multi-select | Dynamically shown when URL contains "ring" (not "earring") |
| **Bangle Size** | Multi-select | Shown for bangle categories |
| **Chain Length** | Multi-select | Shown for Chain, Anklet, Necklace, Necklace-Set, Wedding-Necklace, Rosary-Chain, Mangalsutra |
| **Bracelet Length/Size** | Multi-select | Shown for bracelet categories |
| **Gold 916 Purity** | Multi-select | Gold coin only |
| **Gold 999 Purity** | Multi-select | Gold coin only |
| **Coin Design Style** | Multi-select | Gold coin only |

#### Core Filters (always present):
- **Min-Price** (param: `Min`)
- **Max-Price** (param: `Max`)
- **Min-Weight** (param: `MinWeight`)
- **Max-Weight** (param: `MaxWeight`)

#### Filter Behavior:
- Filters load dynamically via `Master/GetAllDetailedAttributeSearch` API
- URL query params updated on filter change (e.g., `?Min=10000&Max=40000&MinWeight=4&MaxWeight=12&SubCategoryName=Choker`)
- Active filter count badge shown
- "Clear all filters" button when filters active
- Responsive: On mobile, filter opens as a **slide-out overlay panel** from bottom
- Filter icon shows active count badge (`.sort-filter-active` when count ≥ 2)

### 1.3 Sort Options
From `SortList` array:
| Display Title | API Value | Description |
|---|---|---|
| **None** | `undefined` | Default/no sort |
| **What's New** | `"Newest"` | New arrivals first |
| **Fast Delivery** | `"Fast"` | Express delivery items prioritized |
| **Price: Low-High** | `"Low-High"` | Ascending price |
| **Price: High-Low** | `"High-Low"` | Descending price |

- Sort is passed as `SortBy` query parameter
- Mobile: Sort opens as a **slide-out overlay** from bottom
- Desktop: Dropdown in the filter bar area

### 1.4 Product Card Design
Each product card shows:
| Element | Details |
|---|---|
| **Product Image** | Main image with hover zoom effect (`.zoom { transform: scale(1.05) }`) |
| **Product Name** | Uppercase, font-size 14px, font-weight 500 |
| **SKU** | Displayed as subtitle (font-size 12px, weight 400) |
| **Price** | Bold price in gold color (`.text-yellow-detail`), font-size 16px, weight 700, Roboto font |
| **Weight Info** | Shown below price (font-size 12px) |
| **Wishlist Button** | Heart icon (Material Symbols), toggleable filled/outline |
| **Add to Cart** | Via product card click → navigates to detail page |
| **Quick View** | NOT present as separate button - click goes to `/products/detail/{slug}` |
| **Image Lazy Loading** | Yes, with spinner placeholder (`.image_loader_wrpr` + `.spinner`) |
| **Discount Badge** | Shown when applicable (`.Discount` field) |
| **"New" Badge** | Image badge for new arrivals |
| **Express Delivery Badge** | Express delivery indicator for eligible products |

### 1.5 Pagination
- **Type**: Scroll-based / "Load More" pattern with `PageSize` parameter
- **API Pagination**: Uses `PageNo` and `PageSize` parameters
- **TotalCount** returned from API for total available products
- **PageSizeOptions** available for controlling results per page
- NOT traditional numbered pagination - uses infinite scroll / load more

### 1.6 Products Per Page
- Default `PageSize` configured (typical: 20-30 products per load)
- `PageSizeOptions` available for user selection
- Infinite scroll triggers next page load

### 1.7 Category Banner
- **YES** - Category-specific banner at top of listing
- SEO content loaded via `Master/GetAllSeoByFilters` and `Master/GetAllSeoMainByFilters`
- Category title displayed with SEO-optimized heading
- Breadcrumb sits above the grid

### 1.8 Breadcrumb Style
- **Present**: Simple text breadcrumb
- Pattern: `Home > Gold Jewellery > Gold Necklaces`
- Uses Angular `routerLink` with `queryParams`
- Font: Century Gothic, 11-12px
- Separator: `>` arrow

### 1.9 Recently Viewed Section
- **NOT present** on the listing page itself
- Product suggestions appear in search overlay ("Popular Products", "Did you mean")

---

## 2. PRODUCT DETAIL PAGE (`/products/detail/{slug}`)

### 2.1 Image Gallery Structure
| Feature | Details |
|---|---|
| **Main Image** | Large product image with **pinch zoom** and **hover zoom** capabilities |
| **Image Zoom** | Yes - zoom on hover (desktop), pinch zoom (mobile) - 123 `zoom` references in bundle |
| **360° View** | Yes - 52 references to `360` in the bundle, likely Sirv/Magic360 integration |
| **Thumbnail Strip** | Yes - thumbnail navigation (`.Thumbnail` references found) |
| **Video** | Supported where available per product |
| **Image CDN** | `https://www.josalukkasmedia.com/Media/` + product path |

### 2.2 Product Info Layout
| Element | Details |
|---|---|
| **Product Name** | Large heading, Century Gothic font, uppercase |
| **SKU / Product Code** | Displayed below name (`Sku`, `ProductNameSku` fields) |
| **Material** | Gold/Diamond/Platinum indicator |
| **Purity** | Karat value (e.g., 22KT, 18KT, 916) |
| **Gross Weight** | Total weight including stones |
| **Net Weight** | Pure metal weight |
| **Price** | Dynamic price based on current gold rate |
| **Gold Rate** | Live gold rate shown (from `GetLatestGoldRate` API) |
| **Making Charges** | Included in price breakdown |
| **Color Stone Net Value** | Diamond/stone value separately shown (`ColorStoneNetValue` field) |
| **Discount** | Discount amount when applicable |
| **Design Style** | Style/design category |

### 2.3 Action Buttons
| Button | Details |
|---|---|
| **Add to Cart** | Primary CTA, adds to cart (shopping_cart icon) |
| **Buy Now** | Secondary CTA (`.buy_now` - 13 references) |
| **Add to Wishlist** | Heart icon toggle (WishList system via `User/CreateWishCart` API) |
| **Compare** | Product comparison feature (`CompareList` in localStorage) |

### 2.4 Size Selector
- **Ring Size**: Dropdown selector (shown for ring products, parsed from `RingSize.Value`)
- **Bangle Size**: Dropdown selector (shown for bangle products)
- **Chain Length**: Dropdown selector (shown for chains/necklaces)
- **Bracelet Length/Size**: Dropdown selector (shown for bracelets)

### 2.5 Delivery / Shipping Info
| Feature | Details |
|---|---|
| **Pincode Check** | Yes - `pinCode` field with delivery check (BlueDart API integration via SOAP) |
| **Express Delivery** | Badge/indicator for fast delivery products (`express-delivery.gif` in header) |
| **Delivery Partner** | BlueDart integration (SOAP API to `netconnect.bluedart.com`) |
| **Delivery Availability** | Checked via pincode → shows estimated delivery date |
| **Shipping Info** | Free shipping indicators when applicable |

### 2.6 Return Policy Section
- Return policy information displayed on product detail
- Linked to policy pages (legal/return policy route)

### 2.7 Reviews Section
- **51 references to `review`** in the bundle
- Review display system present
- Star rating system

### 2.8 Related/Similar Products Section
| Section | Details |
|---|---|
| **Similar Products** | Yes - via `Master/ListSimilarProducts` API |
| **Recommended Products** | Yes - via `Master/GetAllRecommendedProducts` API |
| **"Complete the Look"** | NOT explicitly found as a named section |

### 2.9 Share Buttons
- **122 references to `share`** in the bundle
- Social sharing functionality present
- WhatsApp sharing prominently featured (floating WhatsApp button)
- Share via:
  - WhatsApp (primary - floating button always visible)
  - Facebook
  - Other social platforms

### 2.10 Pincode Delivery Check
- **Yes** - Pincode input field for delivery check
- Backend: BlueDart shipping API (`netconnect.bluedart.com`)
- Customer code: `163063` (BlueDart account)
- Shows service availability for entered pincode
- Area-based delivery estimation

---

## 3. TECHNICAL ARCHITECTURE

### 3.1 API Endpoints Used
| Endpoint | Purpose |
|---|---|
| `Master/GetAllProductByFilters` | Product listing with filters |
| `Master/GetProductById` | Single product detail |
| `Master/GetAllDetailedAttributeSearch` | Filter options/facets |
| `Master/GetAllSubCategoryByFilters` | Sub-category data |
| `Master/ListSimilarProducts` | Similar product recommendations |
| `Master/GetAllRecommendedProducts` | Recommended products |
| `Master/ProductSuggestions` | Search autocomplete |
| `Master/SearchProducts` | Full-text search |
| `Master/CheckDiscountedProducts` | Discount validation |
| `Master/GetAllSeoByFilters` | SEO content for categories |
| `Master/GetAllSeoMainByFilters` | Main SEO metadata |
| `User/CreateWishCart` | Add to wishlist |
| `User/CreateOrders` | Order creation |
| `User/CreateGiftCardOrders` | Gift card orders |

### 3.2 Environment Config
```json
{
  "apiURI": "https://backend.josalukkasonline.com/api/",
  "imageURI": "https://www.josalukkasmedia.com/Media/",
  "cmsURI": "https://www.josalukkasmedia.com/Media/CMS/",
  "JsonImgPath": "https://www.josalukkasmedia.com/Media/CMS/Home/"
}
```

### 3.3 Design System
- **Font Family**: Century Gothic (primary), Roboto (prices/numbers), Material Symbols (icons)
- **Primary Colors**: 
  - Gold/Accent: `#e9bb2c`, `#ffe699`, `#ffc40c`
  - Brown/Brand: `#b58f7a`, `#834e32`, `#571614`
  - Text: `#303030`, `#000`
  - Background: `#fff`, `#f6f6f6`, `#fbf8ed`
- **Custom CSS Utility Classes**: `gl-*` prefix system (e.g., `gl-w-100`, `gl-d-flex`, `gl-fs-14`)
- **Responsive Breakpoints**: 1801px, 1601px, 1366px, 1200px, 1024px, 991px, 767px, 575px
- **Scrollbar**: Custom styled (gold themed - `#ffe590` thumb, `#ffd342` hover)
- **Animations**: Hover zoom, heartbeat pulse, wobble horizontal, text gradient clip

### 3.4 Key Features Summary
| Feature | Present? |
|---|---|
| Filter sidebar (left) | ❌ No - uses top bar + slide-out |
| Sort dropdown | ✅ Yes (5 options) |
| Price range filter | ✅ Yes (8 presets) |
| Weight range filter | ✅ Yes (12 presets) |
| Size filters | ✅ Yes (Ring, Bangle, Chain, Bracelet) |
| Breadcrumbs | ✅ Yes |
| Category banner | ✅ Yes |
| Product image zoom | ✅ Yes |
| 360° view | ✅ Yes |
| Wishlist | ✅ Yes |
| Compare products | ✅ Yes |
| Share buttons | ✅ Yes (WhatsApp prominent) |
| Pincode delivery check | ✅ Yes (BlueDart) |
| Express delivery | ✅ Yes |
| Reviews/ratings | ✅ Yes |
| Similar products | ✅ Yes |
| Recommended products | ✅ Yes |
| "Recently viewed" | ❌ No |
| "Complete the look" | ❌ No |
| Quick view | ❌ No |
| Infinite scroll | ✅ Yes (Load more pattern) |
| Live gold rate | ✅ Yes |
| DigiGold wallet | ✅ Yes |
| Cookie consent | ✅ Yes |
| Back to top | ✅ Yes |
| WhatsApp chat | ✅ Yes (floating) |
