import { Component, signal, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';
import { WishlistService } from '@core/services/wishlist.service';
import { ApiService } from '@core/services/api.service';
import { Category, GoldRate, Product } from '@core/models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <!-- ═══ ROW 1: TOP BAR ═══ -->
    <div class="bg-primary-900 text-white text-[11px] hidden md:block">
      <div class="max-w-[1400px] mx-auto px-4 flex items-center justify-between h-8">
        <div class="flex items-center gap-3">
          <a routerLink="/gold-rate" class="hover:text-gold-400 transition-colors flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            Today's Gold Rate
          </a>
          <span class="text-primary-600">|</span>
          @for (rate of goldRates(); track rate.karat) {
            <span class="text-gold-400 font-price font-semibold text-[10px]">{{ rate.karat }}: ₹{{ rate.ratePerGram | number:'1.0-0' }}/g</span>
          }
        </div>
        <div class="flex items-center gap-3">
          <a routerLink="/stores" class="hover:text-gold-400 transition-colors">Store Locator</a>
          <span class="text-primary-700">|</span>
          <a routerLink="/blog" class="hover:text-gold-400 transition-colors">Blog</a>
          <span class="text-primary-700">|</span>
          <a routerLink="/digi-gold" class="hover:text-gold-400 transition-colors">Digi Gold</a>
          <span class="text-primary-700">|</span>
          <a href="tel:18001234567" class="hover:text-gold-400 transition-colors">📞 1800-123-4567</a>
        </div>
      </div>
    </div>

    <!-- ═══ ROW 2: MAIN HEADER ═══ -->
    <header class="bg-white sticky top-0 z-50 transition-shadow" [class.shadow-md]="isScrolled()">
      <div class="max-w-[1400px] mx-auto px-4">
        <div class="flex items-center justify-between h-14 md:h-16">
          <button (click)="mobileMenuOpen.set(!mobileMenuOpen())" class="lg:hidden text-gray-700 p-1">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              @if (mobileMenuOpen()) {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              }
            </svg>
          </button>

          <a routerLink="/" class="flex flex-col items-center group shrink-0">
            <img src="/assets/images/misc/logo.svg" alt="Girlyf Jewellery" class="h-8 md:h-10">
          </a>

          <a routerLink="/products" class="hidden xl:flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 text-primary-900 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide hover:shadow-lg transition-shadow">
            <span>🪔</span> FESTIVE COLLECTION
          </a>

          <!-- SEARCH with overlay -->
          <div class="hidden lg:flex flex-1 max-w-xl mx-6 relative">
            <div class="relative w-full">
              <input type="text" [(ngModel)]="searchQuery" (focus)="searchFocused.set(true)" (blur)="onSearchBlur()" (keyup.enter)="onSearch()" (input)="onSearchInput()"
                placeholder="Search for jewellery on Girlyf..." class="w-full pl-4 pr-12 py-2.5 border-2 border-gray-200 text-sm focus:outline-none focus:border-gold-500 transition-colors">
              <button (click)="onSearch()" class="absolute right-0 top-0 bottom-0 px-4 bg-primary-900 text-white hover:bg-primary-700 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </button>
            </div>
            @if (searchFocused() && (searchSuggestions.length || searchProducts().length)) {
              <div class="absolute top-full left-0 right-0 bg-white shadow-2xl border border-gray-100 z-[60] mt-1 animate-fade-in-up">
                <div class="flex">
                  <div class="w-2/5 border-r p-4">
                    <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Did you mean</p>
                    @for (s of searchSuggestions; track s) {
                      <button (mousedown)="searchQuery = s; onSearch()" class="flex items-center gap-2 w-full text-left px-2 py-1.5 text-sm hover:bg-brown-200/30 rounded transition-colors">
                        <span class="text-gold-500">★</span> {{ s }}
                      </button>
                    }
                  </div>
                  <div class="w-3/5 p-4">
                    <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Popular Products</p>
                    <div class="grid grid-cols-3 gap-2">
                      @for (p of searchProducts(); track p.id) {
                        <a [routerLink]="['/product', p.id]" (mousedown)="searchFocused.set(false)" class="text-center group">
                          <div class="aspect-square bg-gray-50 border overflow-hidden rounded">
                            <img [src]="(p.images && p.images[0] ? p.images[0].imageUrl : '/assets/images/misc/placeholder.svg')" [alt]="p.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
                          </div>
                          <p class="text-[9px] mt-1 line-clamp-1">{{ p.name }}</p>
                          <p class="text-[10px] font-price font-bold text-primary-900">₹{{ p.calculatedPrice | number:'1.0-0' }}</p>
                        </a>
                      }
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- ICONS -->
          <div class="flex items-center gap-0.5 md:gap-1">
            <button (click)="mobileSearchOpen.set(!mobileSearchOpen())" class="lg:hidden text-gray-600 p-2 hover:text-primary-900">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
            <a routerLink="/stores" class="hidden md:flex flex-col items-center text-gray-600 hover:text-primary-900 transition-colors p-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span class="text-[8px] mt-0.5 tracking-wider uppercase">Stores</span>
            </a>
            <!-- Wishlist with hover panel -->
            <div class="relative" (mouseenter)="showWishlistPanel.set(true)" (mouseleave)="showWishlistPanel.set(false)">
              <a routerLink="/wishlist" class="flex flex-col items-center text-gray-600 hover:text-primary-900 transition-colors p-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                <span class="text-[8px] mt-0.5 hidden md:block tracking-wider uppercase">Wishlist</span>
              </a>
              @if (showWishlistPanel()) {
                <div class="absolute right-0 top-full w-72 bg-white shadow-2xl border border-gray-100 z-50 animate-fade-in-up">
                  <div class="p-4">
                    <p class="text-sm font-heading font-bold text-primary-900 mb-2">YOUR WISHLIST</p>
                    <p class="text-xs text-gray-500">Welcome to your saved items.</p>
                    <a routerLink="/wishlist" class="btn-primary text-[10px] w-full mt-3 py-2 text-center block">VIEW WISHLIST</a>
                  </div>
                </div>
              }
            </div>
            <!-- User with hover panel -->
            <div class="relative" (mouseenter)="showUserMenu.set(true)" (mouseleave)="showUserMenu.set(false)">
              <button class="flex flex-col items-center text-gray-600 hover:text-primary-900 transition-colors p-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                <span class="text-[8px] mt-0.5 hidden md:block tracking-wider uppercase">{{ auth.isLoggedIn() ? 'Account' : 'Sign In' }}</span>
              </button>
              @if (showUserMenu()) {
                <div class="absolute right-0 top-full w-64 bg-white shadow-2xl border border-gray-100 z-50 animate-fade-in-up">
                  @if (auth.isLoggedIn()) {
                    <div class="p-4 bg-brown-200/30 border-b"><p class="text-sm font-heading font-bold">Hi, {{ auth.user()?.name }}</p></div>
                    <a routerLink="/myaccount" class="mega-menu-link">My Account</a>
                    <a routerLink="/orders" class="mega-menu-link">My Orders</a>
                    <a routerLink="/wishlist" class="mega-menu-link">My Wishlist</a>
                    <hr class="my-1"><button (click)="auth.logout()" class="mega-menu-link w-full text-left text-red-600">Logout</button>
                  } @else {
                    <div class="p-4">
                      <p class="text-sm font-heading font-bold text-primary-900 mb-1">WELCOME</p>
                      <p class="text-xs text-gray-500 mb-3">Sign in to access your wishlist, cart & orders.</p>
                      <a routerLink="/login" class="btn-primary text-[10px] w-full py-2 mb-2 text-center block">SIGN IN</a>
                      <a routerLink="/register" class="btn-outline text-[10px] w-full py-2 text-center block">CREATE ACCOUNT</a>
                    </div>
                  }
                </div>
              }
            </div>
            <!-- Cart with hover panel -->
            <div class="relative" (mouseenter)="showCartPanel.set(true)" (mouseleave)="showCartPanel.set(false)">
              <a routerLink="/cart" class="flex flex-col items-center text-gray-600 hover:text-primary-900 transition-colors relative p-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                @if (cart.itemCount() > 0) {
                  <span class="absolute top-0.5 right-0 min-w-[16px] h-[16px] bg-gold-500 text-primary-900 text-[9px] rounded-full flex items-center justify-center font-bold font-price">{{ cart.itemCount() }}</span>
                }
                <span class="text-[8px] mt-0.5 hidden md:block tracking-wider uppercase">Cart</span>
              </a>
              @if (showCartPanel() && cart.itemCount() > 0) {
                <div class="absolute right-0 top-full w-80 bg-white shadow-2xl border border-gray-100 z-50 animate-fade-in-up">
                  <div class="p-4 max-h-64 overflow-y-auto">
                    @for (item of cart.items(); track item.productId) {
                      <div class="flex items-center gap-3 py-2 border-b border-gray-50">
                        <img [src]="item.imageUrl" class="w-12 h-12 object-cover border">
                        <div class="flex-1 min-w-0">
                          <p class="text-xs line-clamp-1">{{ item.productName }}</p>
                          <p class="text-[10px] text-gray-400">Qty: {{ item.quantity }}</p>
                        </div>
                        <span class="text-xs font-price font-bold">₹{{ item.totalPrice | number:'1.0-0' }}</span>
                      </div>
                    }
                  </div>
                  <div class="p-4 border-t bg-gray-50">
                    <div class="flex justify-between text-sm font-bold mb-3"><span>Subtotal</span><span class="font-price">₹{{ cart.subTotal() | number:'1.0-0' }}</span></div>
                    <div class="flex gap-2">
                      <a routerLink="/cart" class="btn-outline text-[10px] flex-1 py-2 text-center">VIEW BAG</a>
                      <a routerLink="/checkout" class="btn-gold text-[10px] flex-1 py-2 text-center">CHECKOUT</a>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ ROW 3: CATEGORY NAV with mega menus ═══ -->
      <nav class="hidden lg:block bg-primary-900">
        <div class="max-w-[1400px] mx-auto px-4">
          <ul class="flex items-center justify-center">
            @for (navItem of navItems; track navItem.label) {
              <li class="relative group">
                <a [routerLink]="navItem.route" class="block px-3 xl:px-4 py-2.5 text-[11px] text-white/90 tracking-[0.08em] uppercase hover:text-white transition-colors relative">
                  {{ navItem.label }}
                  <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-0.5 bg-gold-500 transition-all duration-300"></span>
                </a>
                @if (navItem.children) {
                  <div class="absolute left-1/2 -translate-x-1/2 top-full bg-white shadow-2xl border-t-2 border-gold-500 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[550px]">
                    <div class="flex">
                      <div class="flex-1 p-5 grid grid-cols-2 gap-x-6">
                        @for (group of navItem.children; track group.title) {
                          <div class="mb-4">
                            <p class="text-[10px] text-brown-600 font-bold uppercase tracking-widest mb-2">{{ group.title }}</p>
                            @for (link of group.links; track link.label) {
                              <a [routerLink]="link.route" [queryParams]="link.params || {}" class="mega-menu-link text-xs">{{ link.label }}</a>
                            }
                          </div>
                        }
                      </div>
                      <div class="w-44 bg-brown-200/20 p-4 flex flex-col items-center justify-center border-l">
                        <div class="w-32 h-32 bg-white rounded border border-gold-500/20 overflow-hidden flex items-center justify-center text-5xl">💎</div>
                        <a [routerLink]="navItem.route" class="text-[10px] text-primary-900 font-bold uppercase tracking-wider mt-3 hover:text-gold-600">View All →</a>
                      </div>
                    </div>
                  </div>
                }
              </li>
            }
            <li><a routerLink="/gold-rate" class="block px-3 xl:px-4 py-2.5 text-[11px] text-gold-400 font-semibold tracking-[0.08em] uppercase hover:text-gold-300">Gold Rate</a></li>
            <li><a routerLink="/our-brands" class="block px-3 xl:px-4 py-2.5 text-[11px] text-gold-400 font-semibold tracking-[0.08em] uppercase hover:text-gold-300">Our Brands</a></li>
          </ul>
        </div>
      </nav>

      <!-- MOBILE SEARCH -->
      @if (mobileSearchOpen()) {
        <div class="lg:hidden bg-white border-t p-3">
          <div class="relative">
            <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="onSearch(); mobileSearchOpen.set(false)" placeholder="Search jewellery..." class="w-full pl-4 pr-12 py-2.5 border-2 border-gray-200 text-sm focus:outline-none focus:border-gold-500">
            <button (click)="onSearch(); mobileSearchOpen.set(false)" class="absolute right-0 top-0 bottom-0 px-3 bg-primary-900 text-white"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></button>
          </div>
          <a routerLink="/products" class="flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 text-primary-900 px-4 py-2 mt-2 text-xs font-bold tracking-wide">🪔 FESTIVE COLLECTION — SHOP NOW</a>
        </div>
      }

      <!-- MOBILE HAMBURGER (3-level accordion) -->
      @if (mobileMenuOpen()) {
        <div class="lg:hidden bg-white border-t shadow-2xl max-h-[80vh] overflow-y-auto">
          <div class="p-4 bg-gradient-to-r from-primary-900 to-brown-700 text-white">
            <p class="font-heading text-sm tracking-wide">Welcome to Girlyf Online</p>
            <div class="w-8 h-0.5 bg-gold-500 mt-1"></div>
            @if (auth.isLoggedIn()) {
              <p class="text-xs text-white/80 mt-2">Hi, {{ auth.user()?.name }}</p>
              <div class="flex gap-3 mt-2">
                <a routerLink="/myaccount" (click)="closeMobile()" class="text-[10px] text-gold-400 font-bold">My Account</a>
                <a routerLink="/orders" (click)="closeMobile()" class="text-[10px] text-gold-400 font-bold">Orders</a>
                <button (click)="auth.logout(); closeMobile()" class="text-[10px] text-red-300 font-bold">Logout</button>
              </div>
            } @else {
              <div class="flex gap-2 mt-3">
                <a routerLink="/login" (click)="closeMobile()" class="btn-gold text-[10px] py-1.5 px-4 flex-1 text-center">SIGN IN</a>
                <a routerLink="/register" (click)="closeMobile()" class="border border-white text-white text-[10px] py-1.5 px-4 flex-1 text-center">REGISTER</a>
              </div>
            }
          </div>
          <div class="px-4 py-2 bg-green-50 flex items-center gap-2 text-[10px] text-green-700 font-semibold border-b">
            <span class="animate-pulse">🚀</span> Express Delivery — 2-3 Days!
          </div>
          @for (navItem of navItems; track navItem.label) {
            <div class="border-b border-gray-100">
              <button (click)="toggleMobileNav(navItem.label)" class="flex items-center justify-between w-full px-5 py-3 text-sm font-bold text-primary-900">
                {{ navItem.label }}
                @if (navItem.children) {
                  <svg class="w-4 h-4 transition-transform text-gray-400" [class.rotate-180]="mobileExpanded() === navItem.label" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                } @else {
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                }
              </button>
              @if (navItem.children && mobileExpanded() === navItem.label) {
                <div class="bg-gray-50 pb-2">
                  @for (group of navItem.children; track group.title) {
                    <p class="px-7 pt-3 pb-1 text-[10px] text-brown-600 font-bold uppercase tracking-widest">{{ group.title }}</p>
                    @for (link of group.links; track link.label) {
                      <a [routerLink]="link.route" [queryParams]="link.params || {}" (click)="closeMobile()" class="block px-9 py-1.5 text-xs text-gray-600 hover:text-primary-900 hover:bg-brown-200/30">{{ link.label }}</a>
                    }
                  }
                </div>
              }
            </div>
          }
          <div class="p-4 bg-brown-200/30 grid grid-cols-2 gap-2 text-xs">
            <a routerLink="/gold-rate" (click)="closeMobile()" class="flex items-center gap-2 py-2 font-medium text-gray-700">📈 Gold Rate</a>
            <a routerLink="/stores" (click)="closeMobile()" class="flex items-center gap-2 py-2 font-medium text-gray-700">📍 Store Locator</a>
            <a routerLink="/digi-gold" (click)="closeMobile()" class="flex items-center gap-2 py-2 font-medium text-gray-700">🥇 Digi Gold</a>
            <a routerLink="/gift-cards" (click)="closeMobile()" class="flex items-center gap-2 py-2 font-medium text-gray-700">🎁 Gift Cards</a>
            <a routerLink="/our-brands" (click)="closeMobile()" class="flex items-center gap-2 py-2 font-medium text-gray-700">💎 Our Brands</a>
            <a routerLink="/ring-size-guide" (click)="closeMobile()" class="flex items-center gap-2 py-2 font-medium text-gray-700">💍 Size Guide</a>
            <a routerLink="/compare" (click)="closeMobile()" class="flex items-center gap-2 py-2 font-medium text-gray-700">⚖️ Compare</a>
            <a routerLink="/contact" (click)="closeMobile()" class="flex items-center gap-2 py-2 font-medium text-gray-700">📞 Support</a>
          </div>
        </div>
      }
    </header>
  `,
})
export class HeaderComponent implements OnInit {
  categories = signal<Category[]>([]);
  goldRates = signal<GoldRate[]>([]);
  searchProducts = signal<Product[]>([]);
  showUserMenu = signal(false);
  showCartPanel = signal(false);
  showWishlistPanel = signal(false);
  mobileMenuOpen = signal(false);
  mobileSearchOpen = signal(false);
  mobileExpanded = signal('');
  searchFocused = signal(false);
  searchQuery = '';
  isScrolled = signal(false);
  searchSuggestions: string[] = [];
  navItems: { label: string; route: string; previewImage?: string; children?: { title: string; links: { label: string; route: string; params?: any }[] }[] }[] = [];

  constructor(public auth: AuthService, public cart: CartService, public wishlist: WishlistService, private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getCategories().subscribe(cats => { this.categories.set(cats); this.buildNavItems(cats); });
    this.api.getGoldRates().subscribe(r => this.goldRates.set(r));
    this.api.getFeaturedProducts(6).subscribe(p => this.searchProducts.set(p));
  }

  @HostListener('window:scroll') onScroll(): void { this.isScrolled.set(window.scrollY > 50); }

  buildNavItems(cats: Category[]): void {
    const genders = ['Women', 'Men', 'Kids'];
    const occasions = ['Wedding', 'Daily Wear', 'Party Wear', 'Office Wear'];
    const metals = [
      { label: 'Gold Jewellery', route: '/gold-jewellery' },
      { label: 'Diamond Jewellery', route: '/diamond-jewellery' },
      { label: 'Platinum Jewellery', route: '/platinum-jewellery' },
      { label: 'Silver Jewellery', route: '/silver-jewellery' },
      { label: 'Daily Wear / 18KT', route: '/18k-jewellery' },
    ];
    this.navItems = metals.map(mt => ({
      label: mt.label, route: mt.route,
      children: [
        { title: 'Shop For', links: genders.map(g => ({ label: g, route: mt.route, params: { gender: g } })) },
        { title: 'By Category', links: cats.slice(0, 8).map(c => ({ label: c.name, route: `${mt.route}/${c.slug}`, params: {} })) },
        { title: 'By Occasion', links: occasions.map(o => ({ label: o, route: mt.route, params: { occasion: o } })) },
      ]
    }));
    this.navItems.push({ label: 'Coins & Gifts', route: '/gold-coin' }, { label: 'Digi Gold', route: '/digi-gold' });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) { this.searchFocused.set(false); this.router.navigate(['/products'], { queryParams: { search: this.searchQuery.trim() } }); this.searchQuery = ''; }
  }
  onSearchInput(): void {
    const q = this.searchQuery.toLowerCase();
    this.searchSuggestions = q.length > 1 ? ['Gold Rings', 'Diamond Necklace', 'Gold Bangles', 'Platinum Ring', 'Gold Earrings', 'Diamond Pendant'].filter(s => s.toLowerCase().includes(q)).slice(0, 5) : [];
  }
  onSearchBlur(): void { setTimeout(() => this.searchFocused.set(false), 200); }
  toggleMobileNav(label: string): void { this.mobileExpanded.set(this.mobileExpanded() === label ? '' : label); }
  closeMobile(): void { this.mobileMenuOpen.set(false); this.mobileExpanded.set(''); }
}
