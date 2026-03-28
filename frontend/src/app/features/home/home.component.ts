import { Component, OnInit, OnDestroy, signal, computed, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ApiService } from '@core/services/api.service';
import { CartService } from '@core/services/cart.service';
import { SeoService } from '@core/services/seo.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { Product, Category, GoldRate, Banner, BlogPost, Testimonial, CmsSection } from '@core/models';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

type TabId = 'featured' | 'bestsellers' | 'new';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, CarouselModule, ProductCardComponent],
  template: `

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- 1. FULL-BLEED HERO IMAGE                               -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section class="parakkat-hero relative w-full">
      <img src="/assets/images/hero/Heroimage.webp"
        alt="Girlyf — Exquisite Jewellery"
        class="ph-hero-img ph-anim-img"
        loading="eager">
    </section>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- 2. PREMIUM GOLD RATE TICKER                            -->
    <!-- ═══════════════════════════════════════════════════════ -->
    @if (goldRates().length) {
      <div class="relative overflow-hidden py-0" style="background: linear-gradient(90deg, #1a0505, #571613, #911b1e, #571613, #1a0505)">
        <!-- Shine edge overlay -->
        <div class="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style="background: linear-gradient(90deg, #1a0505, transparent)"></div>
        <div class="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style="background: linear-gradient(-90deg, #1a0505, transparent)"></div>
        <div class="gold-ticker-track py-3">
          @for (rate of duplicatedGoldRates(); track $index) {
            <span class="inline-flex items-center gap-3 px-8 text-xs whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0"></span>
              <span class="text-white/60 uppercase tracking-widest text-[10px]">{{ rate.karat }}</span>
              <span class="text-white font-medium">Gold Rate</span>
              <span class="font-price font-bold text-gold-400 text-sm">&#8377;{{ rate.ratePerGram | number:'1.0-0' }}/g</span>
              <span class="text-white/30 text-lg">|</span>
            </span>
          }
        </div>
      </div>
    }

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- 4. SHOP BY CATEGORY ← KEEP                            -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section class="py-10 md:py-14 bg-white scroll-reveal">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="section-title">SHOP BY CATEGORY</h2>
        <div class="gold-divider"></div>
        <p class="section-subtitle mb-8">Discover jewellery for every occasion</p>
        @if (isBrowser) {
          <owl-carousel-o [options]="categoryOptions">
            @for (cat of categoryCards; track cat.name) {
              <ng-template carouselSlide>
                <a [routerLink]="cat.link" class="block text-center group px-2">
                  <div class="category-ring mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-transparent group-hover:border-gold-500 transition-all duration-300 bg-brown-200">
                    <img [src]="cat.image" [alt]="cat.name"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy">
                  </div>
                  <p class="mt-3 text-xs font-heading font-semibold text-gray-700 group-hover:text-primary-900 uppercase tracking-wider">{{ cat.name }}</p>
                </a>
              </ng-template>
            }
          </owl-carousel-o>
        } @else {
          <div class="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            @for (cat of categoryCards; track cat.name) {
              <a [routerLink]="cat.link" class="flex-shrink-0 text-center w-28">
                <div class="mx-auto w-24 h-24 rounded-full overflow-hidden bg-brown-200">
                  <img [src]="cat.image" [alt]="cat.name" class="w-full h-full object-cover">
                </div>
                <p class="mt-3 text-xs font-heading font-semibold text-gray-700 uppercase tracking-wider">{{ cat.name }}</p>
              </a>
            }
          </div>
        }
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- 6. TABBED PRODUCT SHOWCASE — BlueStone-inspired       -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section class="py-12 md:py-16 bg-white scroll-reveal">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Tab headers -->
        <div class="flex items-end justify-between mb-2 flex-wrap gap-3">
          <h2 class="section-title text-left" style="width: auto">HANDPICKED FOR YOU</h2>
          <a routerLink="/products" class="text-xs text-primary-700 font-semibold uppercase tracking-wider hover:text-primary-900 flex items-center gap-1">
            View All <mat-icon class="text-sm">arrow_forward</mat-icon>
          </a>
        </div>
        <div class="gold-divider" style="margin-left: 0; margin-right: auto"></div>

        <div class="flex gap-0 border-b border-gray-100 mb-8 mt-4 overflow-x-auto scrollbar-hide">
          @for (tab of productTabs; track tab.id) {
            <button class="product-tab-btn flex-shrink-0" [class.active]="activeTab() === tab.id"
              (click)="setTab(tab.id)">{{ tab.label }}</button>
          }
        </div>

        <!-- Tab content -->
        @if (isBrowser && activeTabProducts().length) {
          <owl-carousel-o [options]="productCarouselOptions">
            @for (product of activeTabProducts(); track product.id) {
              <ng-template carouselSlide>
                <div class="px-2">
                  <app-product-card [product]="product" />
                </div>
              </ng-template>
            }
          </owl-carousel-o>
        } @else {
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            @for (product of activeTabProducts(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        }
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- 7. OUR COLLECTIONS ← KEEP                             -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section class="py-10 md:py-14 scroll-reveal" style="background: #faf7f3">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="section-title">OUR COLLECTIONS</h2>
        <div class="gold-divider"></div>
        <p class="section-subtitle mb-10">Curated collections for the modern woman</p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <!-- First 4 as regular cards -->
          @for (collection of collections.slice(0, 4); track collection.name; let i = $index) {
            <a [routerLink]="['/collections', collection.slug]"
              class="scroll-reveal collection-card group relative overflow-hidden rounded-lg bg-white shadow-sm"
              [class]="'scroll-reveal-delay-' + (i + 1)">
              <div class="aspect-[3/4] overflow-hidden">
                <img [src]="collection.image" [alt]="collection.name"
                  class="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-700" loading="lazy">
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
              <!-- Gold top-border reveal on hover -->
              <div class="absolute top-0 left-0 right-0 h-[3px] bg-gold-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div class="absolute bottom-0 left-0 right-0 p-4 text-center">
                <h3 class="text-white font-heading text-sm md:text-base font-bold tracking-wider uppercase">{{ collection.name }}</h3>
                <span class="inline-block mt-1 text-gold-400 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore →</span>
              </div>
            </a>
          }
          <!-- Last 2 — span wide as editorial banners -->
          @for (collection of collections.slice(4, 6); track collection.name; let i = $index) {
            <a [routerLink]="['/collections', collection.slug]"
              class="scroll-reveal collection-card group relative overflow-hidden rounded-lg bg-white shadow-sm md:col-span-2"
              [class]="'scroll-reveal-delay-' + (i + 5)">
              <div class="aspect-[3/2] overflow-hidden">
                <img [src]="collection.image" [alt]="collection.name"
                  class="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" loading="lazy">
              </div>
              <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
              <div class="absolute top-0 left-0 right-0 h-[3px] bg-gold-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div class="absolute inset-0 flex items-center px-8 md:px-12">
                <div>
                  <p class="text-gold-400 text-[10px] uppercase tracking-[0.3em] font-accent">Girlyf Collection</p>
                  <h3 class="text-white font-heading text-xl md:text-3xl font-bold tracking-wider uppercase mt-1">{{ collection.name }}</h3>
                  <span class="inline-flex items-center gap-2 mt-3 text-white/80 text-xs uppercase tracking-widest border-b border-white/40 pb-0.5 group-hover:border-gold-400 group-hover:text-gold-400 transition-all duration-300">
                    Shop Collection
                  </span>
                </div>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- 9. LUMINA VIDEO (cinematic collection reveal)         -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section class="scroll-reveal">
      <a routerLink="/collections/lumina" class="block relative group overflow-hidden">
        <video class="w-full h-auto hidden md:block" style="aspect-ratio: 16/7"
          autoplay [muted]="true" loop playsinline
          src="/assets/images/videos/aira-banner.mp4">
        </video>
        <video class="w-full h-auto md:hidden" autoplay [muted]="true" loop playsinline
          src="/assets/images/videos/aira-responsive.mp4">
        </video>
        <!-- Elegant overlay -->
        <div class="absolute inset-0 pointer-events-none"
          style="background: linear-gradient(135deg, rgba(0,0,0,0.5) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)">
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <p class="text-gold-400 text-[10px] uppercase tracking-[0.4em] font-accent mb-2">Girlyf Exclusive</p>
            <h2 class="text-white font-heading text-3xl md:text-6xl font-bold tracking-[0.15em] uppercase"
              style="text-shadow: 0 2px 30px rgba(0,0,0,0.6)">LUMINA</h2>
            <div class="mt-3 flex items-center justify-center gap-3">
              <div class="h-px w-12 bg-gold-400/60"></div>
              <span class="text-white/70 text-[10px] uppercase tracking-[0.25em]">Explore Collection</span>
              <div class="h-px w-12 bg-gold-400/60"></div>
            </div>
          </div>
        </div>
        <!-- Film grain -->
        <div class="film-grain absolute inset-0 pointer-events-none"></div>
      </a>
    </section>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- 10. SHOP FOR ← KEEP (redesigned with stats strip)     -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section class="py-10 md:py-14 bg-white scroll-reveal">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="section-title">SHOP FOR</h2>
        <div class="gold-divider"></div>

        <div class="grid grid-cols-3 gap-3 md:gap-6 mt-8">
          @for (gc of genderCards; track gc.label) {
            <a [routerLink]="gc.link" [queryParams]="gc.params"
              class="group relative overflow-hidden rounded-lg bg-brown-200">
              <div class="aspect-[3/4] md:aspect-[4/5] overflow-hidden">
                <img [src]="gc.image" [alt]="gc.label"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy">
              </div>
              <!-- Gold accent line reveal -->
              <div class="absolute bottom-0 left-0 right-0 h-[3px] bg-gold-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
              <div class="absolute bottom-4 left-0 right-0 text-center px-2">
                <h3 class="text-white text-base md:text-xl font-heading font-bold tracking-wider">{{ gc.label }}</h3>
                <span class="inline-block mt-1 text-gold-400 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">Shop Now</span>
              </div>
            </a>
          }
        </div>
      </div>
    </section>



    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- 12. SHOP BY EARRING TYPE ← KEEP (redesigned cards)   -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section class="py-10 md:py-14 scroll-reveal" style="background: #faf7f3">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="section-title">SHOP BY EARRING TYPE</h2>
        <div class="gold-divider"></div>
        <p class="section-subtitle mb-8">Find the perfect style for every look</p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          @for (type of earringTypes; track type.label; let i = $index) {
            <a [routerLink]="type.link"
              class="earring-card scroll-reveal" [class]="'scroll-reveal-delay-' + (i + 1)">
              <div class="aspect-square overflow-hidden rounded-xl">
                <img [src]="type.image" [alt]="type.label"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy">
              </div>
              <div class="earring-label rounded-b-xl">
                <h3 class="text-sm font-heading font-bold tracking-wider uppercase">{{ type.label }}</h3>
                <p class="text-[10px] text-white/70 mt-0.5">Shop Now →</p>
              </div>
              <!-- Always-visible label below -->
              <div class="text-center mt-3 px-2 pb-2">
                <h3 class="text-sm font-heading font-bold text-gray-800 uppercase tracking-wider">{{ type.label }}</h3>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- 15b. STYLE FEED — hashtag reel strip                  -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section class="py-10 md:py-14 bg-white scroll-reveal">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-8">
          <p class="text-gold-500 font-accent text-xs uppercase tracking-[0.3em] mb-1">Real Style, Real People</p>
          <h2 class="section-title text-base md:text-lg">#GIRLYF STYLE FEED</h2>
          <div class="gold-divider"></div>
          <p class="section-subtitle mt-1">Style it your way — wear it, share it</p>
        </div>
      </div>

      <!-- Snap-scroll reel strip -->
      <div class="style-feed-wrap">
        <div class="style-feed-track">
          @for (reel of styleReels; track reel.tag) {
            <div class="style-reel-card">
              <p class="style-reel-tag">{{ reel.tag }}</p>
              <div class="style-reel-video">
                <video [src]="reel.src" autoplay [muted]="true" loop playsinline
                  class="w-full h-full object-cover reel-video-inner">
                </video>
                <div class="style-reel-overlay">
                  <span class="text-white text-xs font-semibold tracking-wider uppercase">{{ reel.tag }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- 17. TESTIMONIALS — BlueStone clip-card style         -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section class="clip-cards-section w-full py-8 md:py-12 relative bg-white">
      <!-- Heading stays fixed — only cards slide in -->
      <div class="max-w-7xl mx-auto px-4 mb-6 text-center">
        <p style="color:#9D7792;font-size:0.75rem;letter-spacing:0.3em;text-transform:uppercase;text-align:center;margin-bottom:4px">Happy Customers</p>
        <h2 class="section-title">Customer Testimonials</h2>
        <div class="gold-divider"></div>
        <p style="color:#9D7792;font-size:0.875rem;text-align:center">#GirlyfAndMe</p>
      </div>
      <!-- Cards row slides from right on scroll -->
      <div class="clip-cards-content clip-reveal-right">
        <div class="relative bg-white overflow-visible">
          <div class="clip-cards-scroll overflow-x-auto overflow-y-hidden py-8"
            style="scrollbar-width:thin;scrollbar-color:#FFE5E8 transparent">
            <div class="flex min-w-max">
              @for (t of displayTestimonials; track t.id; let i = $index) {
                <div class="flex-shrink-0 relative">
                  <div class="clip-card-outer">
                    <div class="clip-card relative p-[15px] w-[50vw] md:w-[300px]"
                      [style.transform]="'rotate(' + clipCardRots[i % clipCardRots.length] + ')'">
                      <!-- Photo -->
                      <div class="w-full overflow-hidden" style="aspect-ratio:427/373">
                        <img [src]="t.customerImage" [alt]="t.customerName"
                          class="w-full h-full object-cover" loading="lazy">
                      </div>
                      <!-- Name + age -->
                      <div class="pt-3 relative" style="z-index:20">
                        <div class="my-1">
                          <h3 style="font-size:0.85rem;font-weight:400;color:#272B64;font-family:Mulish,sans-serif">{{ t.customerName }}, {{ t.location }}</h3>
                        </div>
                        <p style="color:#ACACAC;font-size:0.75rem;line-height:16px">{{ t.comment }}</p>
                      </div>
                      <!-- Binder clip pin -->
                      <div class="absolute" style="top:-20px;width:30px;z-index:20"
                        [style.left]="clipPinConfigs[i % clipPinConfigs.length].pos"
                        [style.transform]="'translateX(-50%) rotate(' + clipPinConfigs[i % clipPinConfigs.length].rot + ')'">
                        <img src="/assets/images/testimonials/pin.png" alt="" class="w-full h-auto" loading="lazy">
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- 18. BLOG — editorial masonry style                    -->
    <!-- ═══════════════════════════════════════════════════════ -->
    @if (blogPosts().length) {
      <section class="py-12 md:py-20 bg-white scroll-reveal">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex items-end justify-between mb-2 flex-wrap gap-3">
            <h2 class="section-title text-left" style="width: auto">FROM THE JOURNAL</h2>
            <a routerLink="/blog" class="text-xs text-primary-700 font-semibold uppercase tracking-wider hover:text-primary-900 flex items-center gap-1">
              All Stories <mat-icon class="text-sm">arrow_forward</mat-icon>
            </a>
          </div>
          <div class="gold-divider" style="margin-left: 0; margin-right: auto"></div>
          <p class="section-subtitle text-left mt-1 mb-8">Style, culture &amp; the art of adornment</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (post of blogPosts(); track post.id; let i = $index) {
              <a [routerLink]="['/blog', post.slug]"
                class="blog-editorial-card scroll-reveal" [class]="'scroll-reveal-delay-' + (i + 1)">
                <div [class]="i === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'" class="overflow-hidden">
                  <img [src]="post.featuredImageUrl || '/assets/images/blog/placeholder.avif'" [alt]="post.title"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
                  <div class="blog-overlay"></div>
                </div>
                <div class="p-5 bg-white">
                  <p class="text-[10px] text-gold-600 uppercase font-accent font-bold tracking-widest mb-2">{{ post.publishedAt | date:'MMM d, y' }}</p>
                  <h3 class="text-sm md:text-base font-heading font-bold text-gray-900 line-clamp-2 leading-snug mb-2">{{ post.title }}</h3>
                  <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{{ post.excerpt }}</p>
                  <span class="inline-flex items-center gap-1 text-xs text-primary-700 font-semibold uppercase tracking-wider hover:gap-2 transition-all">
                    Read More <mat-icon class="text-sm">arrow_forward</mat-icon>
                  </span>
                </div>
              </a>
            }
          </div>
        </div>
      </section>
    }

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- 19. SEO + FAQ                                         -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section class="py-10 md:py-14 bg-white scroll-reveal">
      <div class="max-w-4xl mx-auto px-4">
        <h2 class="section-title text-base md:text-lg">BUY JEWELLERY ONLINE AT GIRLYF</h2>
        <div class="gold-divider"></div>
        <div class="mt-6 text-sm text-gray-600 leading-relaxed space-y-3" [class.line-clamp-3]="!showFullSeo">
          <p>Girlyf is India's most trusted online jewellery store, offering a wide range of gold, diamond, platinum, and silver jewellery.</p>
          <p>Whether you're looking for wedding jewellery, daily wear gold chains, stunning diamond earrings, or elegant platinum rings, Girlyf has it all.</p>
          <p>Shop with confidence knowing every purchase is backed by our lifetime exchange guarantee, certified purity, and secure shipping across India.</p>
        </div>
        <button (click)="showFullSeo = !showFullSeo" class="mt-2 text-xs text-primary-700 font-semibold hover:underline">
          {{ showFullSeo ? 'SHOW LESS' : 'READ MORE' }}
        </button>

        <!-- Category tag cloud -->
        <div class="mt-8 flex flex-wrap gap-2">
          @for (tag of categoryTags; track tag.label) {
            <a [routerLink]="tag.link" class="filter-chip text-[11px] hover:bg-primary-900 hover:text-white hover:border-primary-900">{{ tag.label }}</a>
          }
        </div>

        <div class="mt-10 space-y-2">
          <h3 class="text-sm font-heading font-bold text-gray-800 uppercase tracking-wider mb-4">Frequently Asked Questions</h3>
          @for (faq of homeFaqs; track faq.q; let i = $index) {
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <button (click)="toggleFaq(i)" class="w-full text-left px-4 py-3 flex items-center justify-between text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                {{ faq.q }}
                <mat-icon class="text-base transition-transform flex-shrink-0" [class.rotate-180]="openFaq() === i">expand_more</mat-icon>
              </button>
              @if (openFaq() === i) {
                <div class="px-4 pb-3 text-xs text-gray-500 leading-relaxed animate__animated animate__fadeIn border-t border-gray-100">{{ faq.a }}</div>
              }
            </div>
          }
        </div>
      </div>
    </section>



    <!-- Loading overlay -->
    @if (loading()) {
      <div class="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-brown-200 border-t-gold-500 rounded-full animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-6 h-6 rounded-full bg-gold-400/30 animate-pulse"></div>
          </div>
        </div>
        <p class="mt-5 text-sm text-gray-400 font-heading tracking-[0.2em] uppercase">Girlyf</p>
        <p class="mt-1 text-xs text-gray-300 tracking-wider">Loading your collection...</p>
      </div>
    }
  `,
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  loading = signal(true);
  banners = signal<Banner[]>([]);
  categories = signal<Category[]>([]);
  goldRates = signal<GoldRate[]>([]);
  featured = signal<Product[]>([]);
  bestSellers = signal<Product[]>([]);
  newArrivals = signal<Product[]>([]);
  testimonials = signal<Testimonial[]>([]);
  blogPosts = signal<BlogPost[]>([]);
  openFaq = signal<number | null>(null);
  currentBanner = signal(0);
  showProgress   = signal(true);
  private heroTimer?: ReturnType<typeof setInterval>;
  activeTab = signal<TabId>('featured');

  duplicatedGoldRates = computed(() => [...this.goldRates(), ...this.goldRates()]);

  activeTabProducts = computed<Product[]>(() => {
    const t = this.activeTab();
    if (t === 'bestsellers') return this.bestSellers();
    if (t === 'new') return this.newArrivals();
    return this.featured();
  });

  showFullSeo = false;
  isBrowser: boolean;
  private subs: Subscription[] = [];

  productTabs = [
    { id: 'featured' as TabId, label: 'Featured' },
    { id: 'bestsellers' as TabId, label: 'Bestsellers' },
    { id: 'new' as TabId, label: 'New Arrivals' },
  ];

  brandStats = [
    { value: '1', label: 'Store in Bangalore' },
    { value: '20K+', label: 'Happy Customers' },
    { value: '5000+', label: 'Unique Designs' },
    { value: '20+', label: 'Years of Trust' },
  ];

  heroSlides = [
    { desktop: '/assets/images/banners/desktop/banner-01.avif', mobile: '/assets/images/banners/mobile/banner-01.avif', alt: 'Girlyf Gold Jewellery Collection', label: 'New Season 2025', headline: 'Wear Your Story', subline: 'Exquisite gold & diamond jewellery, crafted for moments that matter', ctaLabel: 'Shop Gold', ctaLink: '/gold-jewellery' },
    { desktop: '/assets/images/banners/desktop/banner-02.avif', mobile: '/assets/images/banners/mobile/banner-02.avif', alt: 'Girlyf Diamond Collection', label: 'Brilliance Redefined', headline: 'Born to Shine', subline: 'Certified diamond jewellery — from solitaires to statement pieces', ctaLabel: 'Shop Diamonds', ctaLink: '/diamond-jewellery' },
    { desktop: '/assets/images/banners/desktop/banner-03.avif', mobile: '/assets/images/banners/mobile/banner-03.avif', alt: 'Girlyf New Arrivals', label: 'Just Arrived', headline: 'Timeless Craft', subline: 'BIS hallmarked gold, shaped by master artisans, worn for generations', ctaLabel: 'New Arrivals', ctaLink: '/products' },
    { desktop: '/assets/images/banners/desktop/banner-04.avif', mobile: '/assets/images/banners/mobile/banner-04.avif', alt: 'Girlyf Wedding Collection', label: 'Wedding Season', headline: 'Made for Her', subline: 'Bridal sets, mangalsutras & rings that make every moment unforgettable', ctaLabel: 'Bridal Collection', ctaLink: '/gold-jewellery' },
    { desktop: '/assets/images/banners/desktop/banner-05.avif', mobile: '/assets/images/banners/mobile/banner-05.avif', alt: 'Girlyf Gift Cards', label: 'Gift with Love', headline: 'Gifted with Grace', subline: 'Give the gift of brilliance — jewellery gift cards for every occasion', ctaLabel: 'Gift Now', ctaLink: '/gift-cards' },
  ];

  categoryOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 500,
    autoplay: true,
    autoplayTimeout: 3000,
    nav: true,
    navText: [
      '<span class="material-icons">chevron_left</span>',
      '<span class="material-icons">chevron_right</span>'
    ],
    responsive: { 0: { items: 3 }, 480: { items: 4 }, 768: { items: 5 }, 1024: { items: 7 } },
  };

  productCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 500,
    autoplay: false,
    nav: true,
    navText: [
      '<span class="material-icons">chevron_left</span>',
      '<span class="material-icons">chevron_right</span>'
    ],
    responsive: { 0: { items: 2 }, 480: { items: 3 }, 768: { items: 4 }, 1024: { items: 5 } },
  };

  testimonialOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    dots: true,
    navSpeed: 500,
    autoplay: true,
    autoplayTimeout: 4000,
    nav: false,
    responsive: { 0: { items: 1 }, 768: { items: 2 }, 1024: { items: 3 } },
  };

  // BlueStone clip-card style — per-card rotation & pin config
  clipCardRots = ['14deg', '-3deg', '-10deg', '7deg', '14deg', '-3deg', '-10deg', '7deg', '-3deg', '14deg', '7deg', '-10deg'];
  clipPinConfigs = [
    { pos: '0%',  rot: '-17deg' },
    { pos: '70%', rot: '5deg'   },
    { pos: '70%', rot: '0deg'   },
    { pos: '5%',  rot: '2deg'   },
    { pos: '0%',  rot: '-17deg' },
    { pos: '85%', rot: '10deg'  },
    { pos: '80%', rot: '0deg'   },
    { pos: '0%',  rot: '-15deg' },
    { pos: '60%', rot: '-5deg'  },
    { pos: '15%', rot: '8deg'   },
    { pos: '75%', rot: '-3deg'  },
    { pos: '5%',  rot: '12deg'  },
  ];

  staticTestimonials = [
    { id: 101, customerName: 'Akanksha Khanna', location: '27', rating: 5, comment: 'Delighted with my engagement ring from Girlyf! It\'s my dream ring, fits perfectly and is stunning to look at. Thank you for helping us find the perfect symbol of love!', customerImage: '/assets/images/testimonials/t1.jpg' },
    { id: 102, customerName: 'Diksha Singh', location: '29', rating: 5, comment: 'I was worried about buying fine jewellery online, but Girlyf\'s customer service gave me full assurance and the delivery was super quick. Their jewellery is certified — no compromise on quality.', customerImage: '/assets/images/testimonials/t2.jpg' },
    { id: 104, customerName: 'Divya Mishra', location: '26', rating: 5, comment: 'On Valentine\'s Day, my husband gifted me a necklace from Girlyf and I haven\'t taken it off since. Everyone asks where it\'s from — I just LOVE how nice it looks on me.', customerImage: '/assets/images/testimonials/t4.jpg' },
    { id: 106, customerName: 'Priya Singh', location: '34', rating: 5, comment: 'I had trouble finding minimalist jewellery that suited my style, but Girlyf\'s sleek and elegant designs were exactly what I was looking for. Pieces for every style and occasion!', customerImage: '/assets/images/testimonials/t6.jpg' },
    { id: 109, customerName: 'Meera Krishnan', location: '31', rating: 5, comment: 'The diamond earrings I ordered from Girlyf are absolutely gorgeous. The packaging was so premium and the quality is impeccable. Already planning my next purchase!', customerImage: '/assets/images/testimonials/t9.jpg' },
    { id: 110, customerName: 'Ritu Agarwal', location: '29', rating: 5, comment: 'I gifted a Girlyf gold mangalsutra to my best friend on her wedding day — she was in tears! The craftsmanship is extraordinary. Will always trust Girlyf for special moments.', customerImage: '/assets/images/testimonials/t10.jpg' },
    { id: 111, customerName: 'Sneha Pillai', location: '25', rating: 5, comment: 'Girlyf\'s silver anklets are so delicate and beautiful. I wore them on my first date and got so many compliments. I\'m now a customer for life — thank you, Girlyf!', customerImage: '/assets/images/testimonials/t11.jpg' },
  ];

  get displayTestimonials() {
    // Always use curated static testimonials — backend data has no images
    return this.staticTestimonials;
  }

  styleReels = [
    { tag: '#OOTD',         src: '/assets/images/videos/1_v0.mp4' },
    { tag: '#StyleInspo',   src: '/assets/images/videos/2_v0.mp4' },
    { tag: '#StackItUp',    src: '/assets/images/videos/3_v0.mp4' },
    { tag: '#MakeBoldMoves',src: '/assets/images/videos/4_v0.mp4' },
    { tag: '#StylingTip',   src: '/assets/images/videos/5_v0.mp4' },
    { tag: '#ArmCandy',     src: '/assets/images/videos/6_v0.mp4' },
    { tag: '#WhatIWore',    src: '/assets/images/videos/7_v0.mp4' },
    { tag: '#GirlyfGlow',   src: '/assets/images/videos/8_v0.mp4' },
  ];

  trustBadges = [
    { icon: '/assets/images/trust-badges/safe.svg', label: 'Safe & Secure' },
    { icon: '/assets/images/trust-badges/shipping.svg', label: 'Free Shipping' },
    { icon: '/assets/images/trust-badges/certified.svg', label: 'Certified Jewellery' },
    { icon: '/assets/images/trust-badges/diamond.svg', label: 'Real Diamonds' },
    { icon: '/assets/images/trust-badges/huid.svg', label: 'HUID Hallmarked' },
    { icon: '/assets/images/trust-badges/return.svg', label: '15 Day Returns' },
    { icon: '/assets/images/trust-badges/maintenance.svg', label: 'Lifetime Maintenance' },
    { icon: '/assets/images/trust-badges/transparency.svg', label: 'Price Transparency' },
    { icon: '/assets/images/trust-badges/buyback.svg', label: '100% Buyback' },
  ];
  trustBadgesDuplicated = [...this.trustBadges, ...this.trustBadges, ...this.trustBadges];

  categoryCards = [
    { name: 'Gold Earrings', image: '/assets/images/categories/earring.avif', link: '/gold-jewellery/earrings' },
    { name: 'Gold Rings', image: '/assets/images/categories/ring.avif', link: '/gold-jewellery/rings' },
    { name: 'Gold Necklaces', image: '/assets/images/categories/necklace.avif', link: '/gold-jewellery/necklaces' },
    { name: 'Gold Bangles', image: '/assets/images/categories/bangle.avif', link: '/gold-jewellery/bangles' },
    { name: 'Diamond Pendants', image: '/assets/images/categories/pendant.avif', link: '/diamond-jewellery/pendants' },
    { name: 'Diamond Rings', image: '/assets/images/categories/diamond-ring.avif', link: '/diamond-jewellery/rings' },
    { name: 'Mangalsutra', image: '/assets/images/categories/mangalsutra.avif', link: '/gold-jewellery/mangalsutras' },
  ];

  collections = [
    { name: 'Ivy', slug: 'ivy', image: '/assets/images/collections/ivy.avif' },
    { name: 'Butterfly', slug: 'butterfly', image: '/assets/images/collections/butterfly.avif' },
    { name: 'Mirage', slug: 'mirage', image: '/assets/images/collections/mirage.avif' },
    { name: 'Orchid', slug: 'orchid', image: '/assets/images/collections/orchid.avif' },
    { name: 'Solo', slug: 'solo', image: '/assets/images/collections/solo.avif' },
    { name: 'Lumina', slug: 'lumina', image: '/assets/images/collections/ensemble.avif' },
    { name: 'Ethereal', slug: 'ethereal', image: '/assets/images/collections/butterfly.avif' },
  ];

  genderCards = [
    { label: 'Women', image: '/assets/images/gender/women.avif', link: '/gold-jewellery', params: { gender: 'Women' } },
    { label: 'Men', image: '/assets/images/gender/men.avif', link: '/gold-jewellery', params: { gender: 'Men' } },
    { label: 'Kids', image: '/assets/images/gender/kids.avif', link: '/kids-jewellery', params: {} },
  ];

  earringTypes = [
    { label: 'Drops', image: '/assets/images/earring-types/drops.avif', link: '/gold-jewellery/earrings' },
    { label: 'Hoops', image: '/assets/images/earring-types/hoops.avif', link: '/gold-jewellery/earrings' },
    { label: 'Jhumkas', image: '/assets/images/earring-types/jhumkas.avif', link: '/gold-jewellery/earrings' },
    { label: 'Studs', image: '/assets/images/earring-types/studs.avif', link: '/gold-jewellery/earrings' },
  ];

  financialCards = [
    { label: 'Easy Buy', image: '/assets/images/misc/easy-buy.avif', link: '/products' },
    { label: 'Gift Cards', image: '/assets/images/misc/gift-card.avif', link: '/gift-cards' },
    { label: 'Gold Coins', image: '/assets/images/misc/gold-coin.avif', link: '/gold-coin' },
  ];

  categoryTags = [
    { label: 'Gold Rings', link: '/gold-jewellery/rings' },
    { label: 'Gold Earrings', link: '/gold-jewellery/earrings' },
    { label: 'Gold Necklaces', link: '/gold-jewellery/necklaces' },
    { label: 'Gold Bangles', link: '/gold-jewellery/bangles' },
    { label: 'Gold Chains', link: '/gold-jewellery/chains' },
    { label: 'Diamond Rings', link: '/diamond-jewellery/rings' },
    { label: 'Diamond Earrings', link: '/diamond-jewellery/earrings' },
    { label: 'Diamond Pendants', link: '/diamond-jewellery/pendants' },
    { label: 'Platinum Rings', link: '/platinum-jewellery/rings' },
    { label: 'Silver Jewellery', link: '/silver-jewellery' },
    { label: 'Kids Jewellery', link: '/kids-jewellery' },
    { label: 'Gold Coins', link: '/gold-coin' },
    { label: 'Wedding Jewellery', link: '/gold-jewellery' },
    { label: '18K Jewellery', link: '/18k-jewellery' },
  ];

  homeFaqs = [
    { q: 'Is Girlyf jewellery BIS hallmarked?', a: 'Yes, all gold jewellery sold at Girlyf is BIS hallmarked ensuring purity and quality. Each piece comes with a unique HUID number for verification.' },
    { q: 'Do you offer lifetime exchange?', a: 'Absolutely! We offer lifetime exchange on all gold and diamond jewellery purchased from Girlyf.' },
    { q: 'How is the gold rate calculated?', a: 'Our prices are updated daily based on the prevailing gold rate. The final price includes gold value, making charges, wastage, GST, and stone charges (if applicable).' },
    { q: 'Is Cash on Delivery available?', a: 'Yes, we offer Cash on Delivery for orders up to 2,00,000. Additional payment options include UPI, PhonePe, Credit/Debit cards, and Net Banking.' },
    { q: 'What is your return policy?', a: 'We offer a 15-day return/exchange policy. Products must be in original condition with all tags and certificates.' },
  ];

  constructor(
    private api: ApiService,
    private cart: CartService,
    private seo: SeoService,
    private analytics: AnalyticsService,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.seo.update({
      title: 'Girlyf — Exquisite Jewellery Online | Gold, Diamond & Silver',
      description: 'Shop exquisite BIS hallmarked gold, diamond and silver jewellery online at Girlyf. Live gold rates, transparent pricing, free insured shipping across India.',
      keywords: 'jewellery online, gold jewellery, diamond jewellery, silver jewellery, BIS hallmarked, Girlyf',
      faq: this.homeFaqs.map(f => ({ question: f.q, answer: f.a })),
    });
    this.loadData();
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initScrollReveal();
      this.startHeroTimer();
      this.initDragScroll();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    if (this.heroTimer) clearInterval(this.heroTimer);
    this.scrollObserver?.disconnect();
  }

  private loadData(): void {
    forkJoin({
      categories: this.api.getCategories(),
      goldRates: this.api.getGoldRates(),
      featured: this.api.getFeaturedProducts(10),
      bestSellers: this.api.getBestSellers(10),
      newArrivals: this.api.getNewArrivals(10),
      testimonials: this.api.getTestimonials(6),
      blogPosts: this.api.getLatestPosts(3),
    }).subscribe({
      next: (data) => {
        this.categories.set(data.categories);
        this.goldRates.set(data.goldRates);
        this.featured.set(data.featured);
        this.bestSellers.set(data.bestSellers);
        this.newArrivals.set(data.newArrivals);
        this.testimonials.set(data.testimonials);
        this.blogPosts.set(data.blogPosts);
        this.loading.set(false);
        // Re-observe after Angular renders the newly added @if sections
        if (this.isBrowser) setTimeout(() => this.initScrollReveal(), 50);
      },
      error: () => this.loading.set(false),
    });
  }

  setTab(id: TabId): void {
    this.activeTab.set(id);
  }

  /* ── Hero slider controls ── */
  goToSlide(index: number): void {
    this.currentBanner.set(index);
    this.resetProgress();
    this.resetHeroTimer();
  }

  nextSlide(): void {
    this.currentBanner.set((this.currentBanner() + 1) % this.heroSlides.length);
    this.resetProgress();
    this.resetHeroTimer();
  }

  prevSlide(): void {
    this.currentBanner.set((this.currentBanner() - 1 + this.heroSlides.length) % this.heroSlides.length);
    this.resetProgress();
    this.resetHeroTimer();
  }

  private resetProgress(): void {
    this.showProgress.set(false);
    setTimeout(() => this.showProgress.set(true), 20);
  }

  private startHeroTimer(): void {
    this.heroTimer = setInterval(() => {
      this.currentBanner.set((this.currentBanner() + 1) % this.heroSlides.length);
      this.resetProgress();
    }, 6000);
  }

  private resetHeroTimer(): void {
    if (this.heroTimer) clearInterval(this.heroTimer);
    this.startHeroTimer();
  }

  toggleFaq(index: number): void {
    this.openFaq.set(this.openFaq() === index ? null : index);
  }

  private scrollObserver?: IntersectionObserver;

  private initScrollReveal(): void {
    if (typeof IntersectionObserver === 'undefined') return;
    if (!this.scrollObserver) {
      this.scrollObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              this.scrollObserver!.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );
    }
    // Observe only elements not yet revealed (safe to call multiple times)
    document.querySelectorAll('.scroll-reveal:not(.revealed), .clip-reveal-right:not(.revealed)').forEach((el) => this.scrollObserver!.observe(el));
  }

  private initDragScroll(): void {
    // Apply mouse-drag scrolling to all .clip-cards-scroll and .style-feed-wrap elements
    const wraps = document.querySelectorAll<HTMLElement>('.clip-cards-scroll, .style-feed-wrap');
    wraps.forEach((el) => {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      el.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
      });
      el.addEventListener('mouseleave', () => { isDown = false; });
      el.addEventListener('mouseup', () => { isDown = false; });
      el.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        el.scrollLeft = scrollLeft - (x - startX) * 1.4;
      });
    });
  }
}
