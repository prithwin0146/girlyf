import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('@features/home/home.component').then(m => m.HomeComponent) },

  // ── Product Routes ──
  { path: 'products', loadComponent: () => import('@features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'products/:slug', loadComponent: () => import('@features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'product/:id', loadComponent: () => import('@features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'category/:slug', loadComponent: () => import('@features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'collections/:collection', loadComponent: () => import('@features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'compare', loadComponent: () => import('@features/compare/compare.component').then(m => m.CompareComponent) },

  // ── JA-style Category URLs ──
  { path: 'gold-jewellery', loadComponent: () => import('@features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'gold-jewellery/:category', loadComponent: () => import('@features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'diamond-jewellery', loadComponent: () => import('@features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'diamond-jewellery/:category', loadComponent: () => import('@features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'platinum-jewellery', loadComponent: () => import('@features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'platinum-jewellery/:category', loadComponent: () => import('@features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'silver-jewellery', loadComponent: () => import('@features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'silver-jewellery/:category', loadComponent: () => import('@features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'kids-jewellery', loadComponent: () => import('@features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'kids-jewellery/:category', loadComponent: () => import('@features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: '18k-jewellery', loadComponent: () => import('@features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'gold-coin', loadComponent: () => import('@features/products/product-list/product-list.component').then(m => m.ProductListComponent) },

  // ── Auth Routes ──
  { path: 'login', loadComponent: () => import('@features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'sign-in', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', loadComponent: () => import('@features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'sign-up', redirectTo: 'register', pathMatch: 'full' },
  { path: 'forgot-password', loadComponent: () => import('@features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },

  // ── Shopping Routes ──
  { path: 'cart', loadComponent: () => import('@features/cart/cart.component').then(m => m.CartComponent) },
  { path: 'mycart', redirectTo: 'cart', pathMatch: 'full' },
  { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('@features/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'wishlist', canActivate: [authGuard], loadComponent: () => import('@features/wishlist/wishlist.component').then(m => m.WishlistComponent) },
  { path: 'order-success', loadComponent: () => import('@features/orders/order-success/order-success.component').then(m => m.OrderSuccessComponent) },
  { path: 'orders', canActivate: [authGuard], loadComponent: () => import('@features/orders/orders.component').then(m => m.OrdersComponent) },
  { path: 'myaccount', canActivate: [authGuard], loadComponent: () => import('@features/myaccount/myaccount.component').then(m => m.MyAccountComponent) },

  // ── Features ──
  { path: 'digi-gold', loadComponent: () => import('@features/digi-gold/digi-gold.component').then(m => m.DigiGoldComponent) },
  { path: 'gift-cards', loadComponent: () => import('@features/gift-cards/gift-cards.component').then(m => m.GiftCardsComponent) },
  { path: 'our-brands', loadComponent: () => import('@features/our-brands/our-brands.component').then(m => m.OurBrandsComponent) },
  { path: 'gold-rate', loadComponent: () => import('@features/gold-rate/gold-rate.component').then(m => m.GoldRateComponent) },
  { path: 'gold-rate-today', loadComponent: () => import('@features/gold-rate/gold-rate.component').then(m => m.GoldRateComponent) },
  { path: 'blog', loadComponent: () => import('@features/blog/blog.component').then(m => m.BlogComponent) },
  { path: 'stores', loadComponent: () => import('@features/store-locator/store-locator.component').then(m => m.StoreLocatorComponent) },
  { path: 'store-locator', redirectTo: 'stores', pathMatch: 'full' },

  // ── Info Pages ──
  { path: 'about', loadComponent: () => import('@features/about/about.component').then(m => m.AboutComponent) },
  { path: 'aboutus', redirectTo: 'about', pathMatch: 'full' },
  { path: 'contact', loadComponent: () => import('@features/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'contactus', redirectTo: 'contact', pathMatch: 'full' },
  { path: 'faq', loadComponent: () => import('@features/faq/faq.component').then(m => m.FaqComponent) },

  // ── Size Guides ──
  { path: 'ring-size-guide', loadComponent: () => import('@features/size-guides/ring-size-guide.component').then(m => m.RingSizeGuideComponent) },
  { path: 'bangle-size-guide', loadComponent: () => import('@features/size-guides/bangle-size-guide.component').then(m => m.BangleSizeGuideComponent) },

  // ── Policy Pages ──
  { path: 'terms-and-conditions', loadComponent: () => import('@features/policies/terms.component').then(m => m.TermsComponent) },
  { path: 'shipping-policy', loadComponent: () => import('@features/policies/shipping-policy.component').then(m => m.ShippingPolicyComponent) },
  { path: 'cancellation-policy', loadComponent: () => import('@features/policies/cancellation-policy.component').then(m => m.CancellationPolicyComponent) },
  { path: 'privacy-policy', loadComponent: () => import('@features/policies/privacy-policy.component').then(m => m.PrivacyPolicyComponent) },
  { path: 'return-exchange-policy', loadComponent: () => import('@features/policies/return-exchange-policy.component').then(m => m.ReturnExchangePolicyComponent) },

  { path: '**', redirectTo: '' },
];
