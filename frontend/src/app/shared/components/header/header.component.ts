import { Component, signal, HostListener, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';
import { WishlistService } from '@core/services/wishlist.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { ApiService } from '@core/services/api.service';
import { Category, GoldRate, Product } from '@core/models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatIconModule],
  template: `
    <!-- ═══ ROW 1: TOP BAR ═══ -->
    <div class="bg-primary-900 text-white text-[11px] hidden md:block">
      <div class="max-w-[1400px] mx-auto px-4 flex items-center justify-between h-8">
        <div class="flex items-center gap-3">
          <a routerLink="/gold-rate" class="hover:text-gold-400 transition-colors flex items-center gap-1">
            <mat-icon class="text-[12px] w-3 h-3">trending_up</mat-icon>
            Today's Gold Rate
          </a>
          <span class="text-primary-600">|</span>
          @for (rate of goldRates(); track rate.karat) {
            <span class="text-gold-400 font-price font-semibold text-[10px]">{{ rate.karat }}: ₹{{ rate.ratePerGram | number:'1.0-0' }}/g</span>
          }
        </div>
        <div class="flex items-center gap-3">
          <a routerLink="/blog" class="hover:text-gold-400 transition-colors">Blog</a>
          <span class="text-primary-700">|</span>
          <a routerLink="/gold-rate" class="hover:text-gold-400 transition-colors">Gold Rate</a>
          <span class="text-primary-700">|</span>
          <a routerLink="/gift-cards" class="hover:text-gold-400 transition-colors">Gift Cards</a>

        </div>
      </div>
    </div>

    <!-- ═══ ROW 2: MAIN HEADER ═══ -->
    <header class="bg-white sticky top-0 z-50 transition-shadow" [class.shadow-md]="isScrolled()">
      <div class="max-w-[1400px] mx-auto px-4">
        <div class="flex items-center justify-between h-14 md:h-16">
          <button (click)="mobileMenuOpen.set(!mobileMenuOpen())" class="lg:hidden text-gray-700 p-1">
            <mat-icon>{{ mobileMenuOpen() ? 'close' : 'menu' }}</mat-icon>
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
            @if (searchFocused() && (searchSuggestions.length || searchResultProducts().length || searchProducts().length)) {
              <div class="absolute top-full left-0 right-0 bg-white shadow-2xl border border-gray-100 z-[60] mt-1 animate-fade-in-up">
                <div class="flex">
                  <div class="w-2/5 border-r p-4">
                    <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-2">{{ searchSuggestions.length ? 'Suggestions' : 'Trending' }}</p>
                    @for (s of searchSuggestions; track s) {
                      <button (mousedown)="searchQuery = s; onSearch()" class="flex items-center gap-2 w-full text-left px-2 py-1.5 text-sm hover:bg-brown-200/30 rounded transition-colors">
                        <span class="text-gold-500">★</span> {{ s }}
                      </button>
                    }
                  </div>
                  <div class="w-3/5 p-4">
                    @if (searchResultProducts().length) {
                      <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Matching Products</p>
                      <div class="grid grid-cols-3 gap-2">
                        @for (rp of searchResultProducts(); track rp.id) {
                          <a [routerLink]="['/product', rp.id]" (mousedown)="searchFocused.set(false)" class="text-center group">
                            <div class="aspect-square bg-gray-50 border overflow-hidden rounded">
                              <img [src]="rp.imageUrl || '/assets/images/misc/placeholder.svg'" [alt]="rp.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
                            </div>
                            <p class="text-[9px] mt-1 line-clamp-1">{{ rp.name }}</p>
                            <p class="text-[10px] font-price font-bold text-primary-900">₹{{ rp.price | number:'1.0-0' }}</p>
                          </a>
                        }
                      </div>
                    } @else {
                      <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Popular Products</p>
                      <div class="grid grid-cols-3 gap-2">
                        @for (p of searchProducts(); track p.id) {
                          <a [routerLink]="['/product', p.id]" (mousedown)="searchFocused.set(false)" class="text-center group">
                            <div class="aspect-square bg-gray-50 border overflow-hidden rounded">
                              <img [src]="getProductImage(p)" [alt]="p.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
                            </div>
                            <p class="text-[9px] mt-1 line-clamp-1">{{ p.name }}</p>
                            <p class="text-[10px] font-price font-bold text-primary-900">₹{{ p.calculatedPrice | number:'1.0-0' }}</p>
                          </a>
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- ICONS -->
          <div class="flex items-center gap-0.5 md:gap-1">
            <button (click)="mobileSearchOpen.set(!mobileSearchOpen())" class="lg:hidden text-gray-600 p-2 hover:text-primary-900">
              <mat-icon>search</mat-icon>
            </button>

            <!-- Wishlist with hover panel -->
            <div class="relative" (mouseenter)="showWishlistPanel.set(true)" (mouseleave)="showWishlistPanel.set(false)">
              <a routerLink="/wishlist" class="flex flex-col items-center text-gray-600 hover:text-primary-900 transition-colors p-2">
                <mat-icon class="text-xl">favorite_border</mat-icon>
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
                <mat-icon class="text-xl">person_outline</mat-icon>
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
                <mat-icon class="text-xl">shopping_bag</mat-icon>
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

      <!-- ═══ ROW 3: CATEGORY NAV with JOS-style mega menus ═══ -->
      <nav class="hidden lg:block bg-primary-900 relative">
        <div class="max-w-[1400px] mx-auto px-4">
          <ul class="flex items-center justify-center">
            @for (navItem of navItems; track navItem.label) {
              <li class="relative group">
                <a [routerLink]="navItem.route"
                  class="block px-4 xl:px-5 py-3.5 text-[13px] text-white/90 tracking-wide hover:text-white transition-colors relative group-hover:text-gold-400 font-medium">
                  {{ navItem.label }}
                  <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-[2px] bg-gold-400 transition-all duration-300"></span>
                </a>
                @if (navItem.megaMenu) {
                  <!-- JOS Alukkas-style mega dropdown -->
                  <div class="absolute top-full left-1/2 -translate-x-1/2 w-screen bg-white shadow-lg border-t-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-[100]">
                    <div class="max-w-[1400px] mx-auto px-8 py-6 flex items-start">

                      <!-- COL 1: SHOP FOR -->
                      @if (navItem.megaMenu.genders.length) {
                        <div class="w-[140px] shrink-0 pr-7 border-r border-gray-100">
                          <p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-700 border-b-2 border-gold-500 pb-1.5 mb-5 inline-block">Shop For</p>
                          @for (g of navItem.megaMenu.genders; track g.label) {
                            <a [routerLink]="navItem.route" [queryParams]="{gender: g.label}"
                              class="flex items-center gap-3 py-2.5 text-[13px] text-gray-600 hover:text-primary-900 transition-colors">
                              <img [src]="g.image" [alt]="g.label" class="w-8 h-auto object-contain shrink-0">
                              <span>{{ g.label }}</span>
                            </a>
                          }
                        </div>
                      }

                      <!-- COL 2: BY CATEGORY — 2-col horizontal list with natural images -->
                      <div class="flex-1 px-7 border-r border-gray-100">
                        <p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-700 border-b-2 border-gold-500 pb-1.5 mb-5 inline-block">By Category</p>
                        <div class="grid grid-cols-2 gap-x-8 gap-y-0">
                          @for (cat of navItem.megaMenu.categories; track cat.label) {
                            <a [routerLink]="cat.route"
                              class="flex items-center gap-3 py-2 text-[13px] text-gray-600 hover:text-primary-900 transition-colors">
                              <img [src]="cat.image" [alt]="cat.label" class="w-8 h-auto object-contain shrink-0">
                              <span>{{ cat.label }}</span>
                            </a>
                          }
                        </div>
                        <div class="mt-5 pt-3 border-t border-gray-100">
                          <a [routerLink]="navItem.route" class="inline-flex items-center gap-1.5 text-[11px] text-primary-900 font-semibold uppercase tracking-wider hover:text-gold-600 transition-colors">
                            View All <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                          </a>
                        </div>
                      </div>

                      <!-- COL 3: FEATURE IMAGE — clean, no overlay (JOS style) -->
                      @if (navItem.megaMenu.featureImage) {
                        <div class="w-[300px] shrink-0 pl-7 self-stretch min-h-[210px] overflow-hidden">
                          <a [routerLink]="navItem.route" class="block w-full h-full">
                            <img [src]="navItem.megaMenu.featureImage" [alt]="navItem.label"
                              class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
                          </a>
                        </div>
                      }

                    </div>
                  </div>
                }
              </li>
            }
            <li><a routerLink="/gold-rate" class="block px-4 xl:px-5 py-3.5 text-[13px] text-gold-400 font-medium tracking-wide hover:text-gold-300">Gold Rate</a></li>
            <li><a routerLink="/our-brands" class="block px-4 xl:px-5 py-3.5 text-[13px] text-gold-400 font-medium tracking-wide hover:text-gold-300">Our Brands</a></li>
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
                @if (navItem.megaMenu) {
                  <svg class="w-4 h-4 transition-transform text-gray-400" [class.rotate-180]="mobileExpanded() === navItem.label" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                } @else {
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                }
              </button>
              @if (navItem.megaMenu && mobileExpanded() === navItem.label) {
                <div class="bg-gray-50 pb-3">
                  <!-- Gender links -->
                  <p class="px-7 pt-3 pb-1 text-[10px] text-brown-600 font-bold uppercase tracking-widest">Shop For</p>
                  @for (g of navItem.megaMenu.genders; track g.label) {
                    <a [routerLink]="navItem.route" [queryParams]="{gender: g.label}" (click)="closeMobile()"
                      class="flex items-center gap-3 px-8 py-1.5 text-xs text-gray-700 hover:text-primary-900 hover:bg-brown-200/30">
                      <div class="w-7 h-7 rounded-full overflow-hidden border border-gray-200 shrink-0">
                        <img [src]="g.image" [alt]="g.label" class="w-full h-full object-cover">
                      </div>
                      {{ g.label }}
                    </a>
                  }
                  <!-- Category links -->
                  <p class="px-7 pt-3 pb-1 text-[10px] text-brown-600 font-bold uppercase tracking-widest">By Category</p>
                  @for (cat of navItem.megaMenu.categories; track cat.label) {
                    <a [routerLink]="cat.route" (click)="closeMobile()"
                      class="block px-9 py-1.5 text-xs text-gray-600 hover:text-primary-900 hover:bg-brown-200/30">{{ cat.label }}</a>
                  }
                </div>
              }
            </div>
          }
          <div class="p-4 bg-brown-200/30 grid grid-cols-2 gap-2 text-xs">
            <a routerLink="/gold-rate" (click)="closeMobile()" class="flex items-center gap-2 py-2 font-medium text-gray-700">📈 Gold Rate</a>
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
export class HeaderComponent implements OnInit, OnDestroy {
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
  searchResultProducts = signal<{ id: number; name: string; slug: string; imageUrl: string; price: number }[]>([]);
  private searchSubject = new Subject<string>();
  private searchSub?: Subscription;
  navItems: {
    label: string; route: string;
    megaMenu?: {
      genders: { label: string; image: string }[];
      categories: { label: string; route: string; image: string }[];
      featureImage?: string;
    };
  }[] = [];
  private isBrowser: boolean;

  constructor(
    public auth: AuthService,
    public cart: CartService,
    public wishlist: WishlistService,
    private analytics: AnalyticsService,
    private api: ApiService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.api.getCategories().subscribe(cats => { this.categories.set(cats); this.buildNavItems(cats); });
    this.api.getGoldRates().subscribe(r => this.goldRates.set(r));
    this.api.getFeaturedProducts(6).subscribe(p => this.searchProducts.set(p));

    // Debounced live search suggestions from backend API
    this.searchSub = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => q.length > 1
        ? this.api.getSearchSuggestions(q, 6)
        : of({ products: [], suggestions: [] })
      ),
    ).subscribe({
      next: (res) => {
        this.searchSuggestions = res.suggestions || [];
        this.searchResultProducts.set(res.products || []);
      },
      error: () => {
        this.searchSuggestions = [];
        this.searchResultProducts.set([]);
      },
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  @HostListener('window:scroll') onScroll(): void {
    if (this.isBrowser) {
      this.isScrolled.set(window.scrollY > 50);
    }
  }

  buildNavItems(cats: Category[]): void {
    const genders = [
      { label: 'Women', image: '/assets/images/navbar/women.avif' },
      { label: 'Men',   image: '/assets/images/navbar/men.avif' },
      { label: 'Kids',  image: '/assets/images/navbar/kids.avif' },
    ];
    // Per-menu category icons from downloaded menu assets
    const menuCats: Record<string, { label: string; route: string; image: string }[]> = {
      '/gold-jewellery': [
        { label: 'Necklaces',    route: '/gold-jewellery/necklaces',    image: '/assets/images/menu/necklaces.avif' },
        { label: 'Earrings',     route: '/gold-jewellery/earrings',     image: '/assets/images/menu/earrings.avif' },
        { label: 'Bangles',      route: '/gold-jewellery/bangles',      image: '/assets/images/menu/bangles.avif' },
        { label: 'Rings',        route: '/gold-jewellery/rings',        image: '/assets/images/menu/rings.avif' },
        { label: 'Pendants',     route: '/gold-jewellery/pendants',     image: '/assets/images/menu/pendants.avif' },
        { label: 'Mangalsutra',  route: '/gold-jewellery/mangalsutras', image: '/assets/images/menu/mangalsutra.avif' },
        { label: 'Chains',       route: '/gold-jewellery/chains',       image: '/assets/images/menu/necklaces.avif' },
        { label: 'Anklets',      route: '/gold-jewellery/anklets',      image: '/assets/images/menu/bangles.avif' },
      ],
      '/diamond-jewellery': [
        { label: 'D. Necklaces', route: '/diamond-jewellery/necklaces', image: '/assets/images/menu/diamond-necklaces.avif' },
        { label: 'D. Earrings',  route: '/diamond-jewellery/earrings',  image: '/assets/images/menu/diamond-earrings.avif' },
        { label: 'D. Rings',     route: '/diamond-jewellery/rings',     image: '/assets/images/menu/diamond-rings.avif' },
        { label: 'D. Pendants',  route: '/diamond-jewellery/pendants',  image: '/assets/images/menu/diamond-pendant.avif' },
        { label: 'D. Bangles',   route: '/diamond-jewellery/bangles',   image: '/assets/images/menu/gold-bangles.avif' },
        { label: 'Solitaire',    route: '/diamond-jewellery/rings',     image: '/assets/images/menu/diamond-ring.avif' },
      ],
      '/platinum-jewellery': [
        { label: 'Pt. Rings',    route: '/platinum-jewellery/rings',    image: '/assets/images/menu/rings.avif' },
        { label: 'Pt. Pendants', route: '/platinum-jewellery/pendants', image: '/assets/images/menu/pendants.avif' },
        { label: 'Pt. Earrings', route: '/platinum-jewellery/earrings', image: '/assets/images/menu/earrings.avif' },
        { label: 'Pt. Bangles',  route: '/platinum-jewellery/bangles',  image: '/assets/images/menu/bangles.avif' },
      ],
      '/silver-jewellery': [
        { label: 'Sv. Necklaces', route: '/silver-jewellery/necklaces', image: '/assets/images/menu/necklaces.avif' },
        { label: 'Sv. Rings',     route: '/silver-jewellery/rings',     image: '/assets/images/menu/rings.avif' },
        { label: 'Sv. Earrings',  route: '/silver-jewellery/earrings',  image: '/assets/images/menu/earrings.avif' },
        { label: 'Sv. Bangles',   route: '/silver-jewellery/bangles',   image: '/assets/images/menu/bangles.avif' },
      ],
      '/18k-jewellery': [
        { label: 'Rings',        route: '/18k-jewellery/rings',         image: '/assets/images/menu/rings.avif' },
        { label: 'Earrings',     route: '/18k-jewellery/earrings',      image: '/assets/images/menu/earrings.avif' },
        { label: 'Necklaces',    route: '/18k-jewellery/necklaces',     image: '/assets/images/menu/necklaces.avif' },
        { label: 'Pendants',     route: '/18k-jewellery/pendants',      image: '/assets/images/menu/pendants.avif' },
      ],
    };

    const featureImages: Record<string, string> = {
      '/gold-jewellery':      '/assets/images/navbar/Gold-jewellery-banner.avif',
      '/diamond-jewellery':   '/assets/images/navbar/Diamond-jewellery-banner.avif',
      '/platinum-jewellery':  '/assets/images/navbar/Platinum-banner.avif',
      '/silver-jewellery':    '/assets/images/navbar/Silver-banner.avif',
      '/18k-jewellery':       '/assets/images/navbar/Daily-wear-banner.avif',
      '/gold-coin':           '/assets/images/navbar/coin-gift-banner.avif',
    };

    const metals = [
      { label: 'Gold Jewellery',      route: '/gold-jewellery' },
      { label: 'Diamond Jewellery',   route: '/diamond-jewellery' },
      { label: 'Platinum Jewellery',  route: '/platinum-jewellery' },
      { label: 'Silver Jewellery',    route: '/silver-jewellery' },
      { label: 'Daily Wear / 18KT',   route: '/18k-jewellery' },
    ];

    this.navItems = metals.map(mt => ({
      label: mt.label, route: mt.route,
      megaMenu: {
        genders,
        categories: menuCats[mt.route] ?? [],
        featureImage: featureImages[mt.route],
      },
    }));

    this.navItems.push({
      label: 'Coins & Gifts', route: '/gold-coin',
      megaMenu: {
        genders,
        categories: [
          { label: 'Gold Coins',   route: '/gold-coin',   image: '/assets/images/misc/gold-coin.avif' },
          { label: 'Gift Cards',   route: '/gift-cards',  image: '/assets/images/misc/gift-card.avif' },
          { label: 'Digi Gold',    route: '/digi-gold',   image: '/assets/images/misc/digi-gold.avif' },
        ],
        featureImage: featureImages['/gold-coin'],
      },
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.searchFocused.set(false);
      this.analytics.trackSearch(this.searchQuery.trim());
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery.trim() } });
      this.searchQuery = '';
    }
  }
  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }
  onSearchBlur(): void { setTimeout(() => this.searchFocused.set(false), 200); }
  getProductImage(p: Product): string {
    const primary = p.images?.find(i => i.isPrimary);
    return primary?.imageUrl || p.images?.[0]?.imageUrl || '/assets/images/misc/placeholder.svg';
  }
  toggleMobileNav(label: string): void { this.mobileExpanded.set(this.mobileExpanded() === label ? '' : label); }
  closeMobile(): void { this.mobileMenuOpen.set(false); this.mobileExpanded.set(''); }
}
