import { Component, OnInit, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { Product, Category, ProductFilter, PagedResult, GoldRate } from '@core/models';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent],
  template: `
    <!-- ═══════ BREADCRUMB ═══════ -->
    <nav class="bg-brown-200 py-3">
      <div class="max-w-7xl mx-auto px-4 flex items-center gap-2 text-xs text-gray-500">
        <a routerLink="/" class="hover:text-primary-900 transition-colors">Home</a>
        <span>/</span>
        @if (metalType()) {
          <a [routerLink]="'/' + metalType() + '-jewellery'" class="hover:text-primary-900 capitalize transition-colors">{{ metalType() }} Jewellery</a>
          <span>/</span>
        }
        <span class="text-primary-900 font-semibold capitalize">{{ pageTitle() }}</span>
      </div>
    </nav>

    <!-- ═══════ PAGE HEADER ═══════ -->
    <div class="bg-white border-b border-gray-100 py-6">
      <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-xl md:text-2xl font-heading font-bold text-gray-800 uppercase tracking-wider">{{ pageTitle() }}</h1>
          <p class="text-xs text-gray-400 mt-1">{{ totalCount() }} products found</p>
        </div>

        <!-- Live Gold Rate -->
        @if (currentGoldRate()) {
          <div class="flex items-center gap-3 bg-gold-50 px-4 py-2 rounded text-xs">
            <span class="text-gray-500">Today's Gold Rate:</span>
            <span class="font-price font-bold text-primary-900">₹{{ currentGoldRate()!.ratePerGram | number:'1.0-0' }}/g</span>
            <span class="text-gray-400">({{ currentGoldRate()!.karat }})</span>
          </div>
        }
      </div>
    </div>

    <!-- ═══════ FILTER BAR ═══════ -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <!-- Mobile filter toggle -->
        <div class="md:hidden flex items-center justify-between mb-3">
          <button (click)="showMobileFilters = !showMobileFilters" class="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            FILTERS
          </button>
          <select [(ngModel)]="sortBy" (ngModelChange)="applyFilters()" class="input-field text-xs w-40 py-1.5">
            <option value="">Sort By</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="popular">Popularity</option>
            <option value="weight_asc">Weight: Light First</option>
            <option value="weight_desc">Weight: Heavy First</option>
          </select>
        </div>

        <!-- Desktop filter row -->
        <div class="hidden md:flex items-center gap-3 flex-wrap">
          <!-- Sort -->
          <select [(ngModel)]="sortBy" (ngModelChange)="applyFilters()" class="input-field text-xs w-44 py-2">
            <option value="">Sort By</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="popular">Popularity</option>
            <option value="weight_asc">Weight: Light First</option>
            <option value="weight_desc">Weight: Heavy First</option>
          </select>

          <div class="h-6 w-px bg-gray-200"></div>

          <!-- Gender filter chips -->
          <div class="flex gap-1.5">
            @for (g of genderOptions; track g) {
              <button (click)="toggleFilter('gender', g)" class="filter-chip"
                [class.active]="selectedGender() === g">{{ g }}</button>
            }
          </div>

          <div class="h-6 w-px bg-gray-200"></div>

          <!-- Karat filter chips -->
          <div class="flex gap-1.5">
            @for (k of karatOptions; track k) {
              <button (click)="toggleFilter('karat', k)" class="filter-chip"
                [class.active]="selectedKarat() === k">{{ k }}</button>
            }
          </div>

          <div class="h-6 w-px bg-gray-200"></div>

          <!-- Metal Color filter -->
          <div class="flex gap-1.5 items-center">
            <span class="text-[10px] text-gray-400 uppercase font-semibold">Color:</span>
            @for (mc of metalColors; track mc.name) {
              <button (click)="toggleFilter('metalColor', mc.name)" class="w-6 h-6 rounded-full border-2 transition-all"
                [style.background]="mc.color"
                [class.border-primary-900]="selectedMetalColor() === mc.name"
                [class.border-gray-200]="selectedMetalColor() !== mc.name"
                [class.ring-2]="selectedMetalColor() === mc.name"
                [class.ring-primary-300]="selectedMetalColor() === mc.name"
                [title]="mc.name">
              </button>
            }
          </div>

          <div class="h-6 w-px bg-gray-200"></div>

          <!-- Price presets -->
          <div class="flex gap-1.5">
            @for (p of pricePresets; track p.label) {
              <button (click)="setPrice(p.min, p.max)" class="filter-chip"
                [class.active]="activePrice() === p.label">{{ p.label }}</button>
            }
          </div>

          <div class="flex-1"></div>

          <!-- Grid toggle & count -->
          <div class="flex items-center gap-2">
            <button (click)="gridCols = 4" class="p-1.5 rounded" [class.bg-gray-100]="gridCols === 4">
              <svg class="w-4 h-4 text-gray-500" viewBox="0 0 16 16" fill="currentColor"><rect x="0" y="0" width="3.5" height="3.5"/><rect x="4.5" y="0" width="3.5" height="3.5"/><rect x="9" y="0" width="3.5" height="3.5"/><rect x="0" y="4.5" width="3.5" height="3.5"/><rect x="4.5" y="4.5" width="3.5" height="3.5"/><rect x="9" y="4.5" width="3.5" height="3.5"/></svg>
            </button>
            <button (click)="gridCols = 5" class="p-1.5 rounded" [class.bg-gray-100]="gridCols === 5">
              <svg class="w-4 h-4 text-gray-500" viewBox="0 0 16 16" fill="currentColor"><rect x="0" y="0" width="2.5" height="2.5"/><rect x="3.3" y="0" width="2.5" height="2.5"/><rect x="6.6" y="0" width="2.5" height="2.5"/><rect x="9.9" y="0" width="2.5" height="2.5"/><rect x="13.2" y="0" width="2.5" height="2.5"/><rect x="0" y="3.3" width="2.5" height="2.5"/><rect x="3.3" y="3.3" width="2.5" height="2.5"/><rect x="6.6" y="3.3" width="2.5" height="2.5"/><rect x="9.9" y="3.3" width="2.5" height="2.5"/><rect x="13.2" y="3.3" width="2.5" height="2.5"/></svg>
            </button>
          </div>
        </div>

        <!-- Mobile filters (slide down) -->
        @if (showMobileFilters) {
          <div class="md:hidden space-y-4 pb-4 border-t border-gray-100 pt-4 animate-fade-in-up">
            <!-- Gender -->
            <div>
              <p class="text-[10px] font-bold text-gray-500 uppercase mb-2">Gender</p>
              <div class="flex flex-wrap gap-1.5">
                @for (g of genderOptions; track g) {
                  <button (click)="toggleFilter('gender', g)" class="filter-chip"
                    [class.active]="selectedGender() === g">{{ g }}</button>
                }
              </div>
            </div>
            <!-- Karat -->
            <div>
              <p class="text-[10px] font-bold text-gray-500 uppercase mb-2">Karat</p>
              <div class="flex flex-wrap gap-1.5">
                @for (k of karatOptions; track k) {
                  <button (click)="toggleFilter('karat', k)" class="filter-chip"
                    [class.active]="selectedKarat() === k">{{ k }}</button>
                }
              </div>
            </div>
            <!-- Metal Color -->
            <div>
              <p class="text-[10px] font-bold text-gray-500 uppercase mb-2">Metal Color</p>
              <div class="flex gap-3">
                @for (mc of metalColors; track mc.name) {
                  <button (click)="toggleFilter('metalColor', mc.name)" class="flex items-center gap-2 text-xs"
                    [class.font-bold]="selectedMetalColor() === mc.name">
                    <span class="w-5 h-5 rounded-full border" [style.background]="mc.color"></span>
                    {{ mc.name }}
                  </button>
                }
              </div>
            </div>
            <!-- Occasion -->
            <div>
              <p class="text-[10px] font-bold text-gray-500 uppercase mb-2">Occasion</p>
              <div class="flex flex-wrap gap-1.5">
                @for (o of occasionOptions; track o) {
                  <button (click)="toggleFilter('occasion', o)" class="filter-chip"
                    [class.active]="selectedOccasion() === o">{{ o }}</button>
                }
              </div>
            </div>
            <!-- Brand -->
            <div>
              <p class="text-[10px] font-bold text-gray-500 uppercase mb-2">Collection / Brand</p>
              <div class="flex flex-wrap gap-1.5">
                @for (b of brandOptions; track b) {
                  <button (click)="toggleFilter('brand', b)" class="filter-chip"
                    [class.active]="selectedBrand() === b">{{ b }}</button>
                }
              </div>
            </div>
            <!-- Price -->
            <div>
              <p class="text-[10px] font-bold text-gray-500 uppercase mb-2">Price Range</p>
              <div class="flex flex-wrap gap-1.5">
                @for (p of pricePresets; track p.label) {
                  <button (click)="setPrice(p.min, p.max)" class="filter-chip"
                    [class.active]="activePrice() === p.label">{{ p.label }}</button>
                }
              </div>
            </div>
            <!-- Weight -->
            <div>
              <p class="text-[10px] font-bold text-gray-500 uppercase mb-2">Weight Range</p>
              <div class="flex flex-wrap gap-1.5">
                @for (w of weightPresets; track w.label) {
                  <button (click)="setWeight(w.min, w.max)" class="filter-chip"
                    [class.active]="activeWeight() === w.label">{{ w.label }}</button>
                }
              </div>
            </div>

            <button (click)="clearFilters()" class="text-xs text-primary-700 font-semibold hover:underline">CLEAR ALL FILTERS</button>
          </div>
        }

        <!-- Active filters bar -->
        @if (activeFilters().length) {
          <div class="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
            <span class="text-[10px] text-gray-400 uppercase font-semibold">Active:</span>
            @for (af of activeFilters(); track af) {
              <span class="inline-flex items-center gap-1 bg-primary-50 text-primary-900 text-[10px] px-2 py-1 rounded-full font-semibold">
                {{ af }}
                <button (click)="removeFilter(af)" class="hover:text-red-500 ml-0.5">×</button>
              </span>
            }
            <button (click)="clearFilters()" class="text-[10px] text-gray-400 hover:text-primary-900 ml-2">Clear All</button>
          </div>
        }
      </div>
    </div>

    <!-- ═══════ DESKTOP SIDEBAR + GRID ═══════ -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex gap-6">
        <!-- Desktop Sidebar Filters -->
        <aside class="hidden lg:block w-56 flex-shrink-0 space-y-6">
          <!-- Occasion -->
          <div>
            <h3 class="text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-3">Occasion</h3>
            <div class="space-y-1.5">
              @for (o of occasionOptions; track o) {
                <button (click)="toggleFilter('occasion', o)"
                  class="block w-full text-left text-xs px-3 py-1.5 rounded hover:bg-brown-200 transition-colors"
                  [class.bg-primary-900]="selectedOccasion() === o"
                  [class.text-white]="selectedOccasion() === o"
                  [class.text-gray-600]="selectedOccasion() !== o">{{ o }}</button>
              }
            </div>
          </div>

          <!-- Brand / Collection -->
          <div>
            <h3 class="text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-3">Collection</h3>
            <div class="space-y-1.5">
              @for (b of brandOptions; track b) {
                <button (click)="toggleFilter('brand', b)"
                  class="block w-full text-left text-xs px-3 py-1.5 rounded hover:bg-brown-200 transition-colors"
                  [class.bg-primary-900]="selectedBrand() === b"
                  [class.text-white]="selectedBrand() === b"
                  [class.text-gray-600]="selectedBrand() !== b">{{ b }}</button>
              }
            </div>
          </div>

          <!-- Metal Color -->
          <div>
            <h3 class="text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-3">Metal Color</h3>
            <div class="space-y-2">
              @for (mc of metalColors; track mc.name) {
                <button (click)="toggleFilter('metalColor', mc.name)"
                  class="flex items-center gap-2 text-xs text-gray-600 hover:text-primary-900 w-full"
                  [class.font-bold]="selectedMetalColor() === mc.name"
                  [class.text-primary-900]="selectedMetalColor() === mc.name">
                  <span class="w-5 h-5 rounded-full border border-gray-300" [style.background]="mc.color"></span>
                  {{ mc.name }}
                </button>
              }
            </div>
          </div>

          <!-- Weight presets -->
          <div>
            <h3 class="text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-3">Weight</h3>
            <div class="space-y-1.5">
              @for (w of weightPresets; track w.label) {
                <button (click)="setWeight(w.min, w.max)"
                  class="block w-full text-left text-xs px-3 py-1.5 rounded hover:bg-brown-200 transition-colors"
                  [class.bg-primary-900]="activeWeight() === w.label"
                  [class.text-white]="activeWeight() === w.label"
                  [class.text-gray-600]="activeWeight() !== w.label">{{ w.label }}</button>
              }
            </div>
          </div>
        </aside>

        <!-- Product Grid -->
        <div class="flex-1">
          @if (isLoading()) {
            <!-- Skeleton Grid -->
            <div class="grid gap-3" [ngClass]="gridClasses()">
              @for (s of skeletonArray; track $index) {
                <div class="bg-white border border-gray-100">
                  <div class="skeleton aspect-square"></div>
                  <div class="p-3 space-y-2">
                    <div class="skeleton h-2 w-16"></div>
                    <div class="skeleton h-3 w-full"></div>
                    <div class="skeleton h-3 w-24"></div>
                  </div>
                </div>
              }
            </div>
          } @else if (products().length === 0) {
            <div class="text-center py-20">
              <svg class="w-16 h-16 mx-auto text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <p class="mt-4 text-gray-400 font-heading">No products found</p>
              <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or explore our categories</p>
              <a routerLink="/products" class="btn-primary mt-4 inline-block">VIEW ALL PRODUCTS</a>
            </div>
          } @else {
            <div class="grid gap-3" [ngClass]="gridClasses()">
              @for (product of products(); track product.id) {
                <app-product-card [product]="product" />
              }
            </div>

            <!-- Load More -->
            @if (hasMore()) {
              <div class="text-center mt-8">
                <button (click)="loadMore()" class="btn-outline" [disabled]="isLoadingMore()">
                  @if (isLoadingMore()) {
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Loading...
                  } @else {
                    LOAD MORE ({{ products().length }} of {{ totalCount() }})
                  }
                </button>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class ProductListComponent implements OnInit, OnDestroy {
  // ── Signals ──
  products = signal<Product[]>([]);
  totalCount = signal(0);
  isLoading = signal(true);
  isLoadingMore = signal(false);
  currentGoldRate = signal<GoldRate | null>(null);
  pageTitle = signal('All Jewellery');
  metalType = signal('');

  // Filter signals
  selectedGender = signal('');
  selectedKarat = signal('');
  selectedMetalColor = signal('');
  selectedOccasion = signal('');
  selectedBrand = signal('');
  activePrice = signal('');
  activeWeight = signal('');

  hasMore = computed(() => this.products().length < this.totalCount());

  gridCols = 5;
  gridClasses = computed(() => {
    return this.gridCols === 5
      ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
      : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  });

  activeFilters = computed(() => {
    const filters: string[] = [];
    if (this.selectedGender()) filters.push(this.selectedGender());
    if (this.selectedKarat()) filters.push(this.selectedKarat());
    if (this.selectedMetalColor()) filters.push(this.selectedMetalColor());
    if (this.selectedOccasion()) filters.push(this.selectedOccasion());
    if (this.selectedBrand()) filters.push(this.selectedBrand());
    if (this.activePrice()) filters.push(this.activePrice());
    if (this.activeWeight()) filters.push(this.activeWeight());
    return filters;
  });

  sortBy = '';
  showMobileFilters = false;
  private page = 1;
  private pageSize = 20;
  private routeSub?: Subscription;

  // Filter data (JA-specific)
  private filter: ProductFilter = {};

  // ── Static filter options ──
  genderOptions = ['Women', 'Men', 'Kids', 'Unisex'];
  karatOptions = ['22K', '18K', '14K', '24K'];
  metalColors = [
    { name: 'Yellow Gold', color: '#FFD700' },
    { name: 'White Gold', color: '#E8E8E8' },
    { name: 'Rose Gold', color: '#B76E79' },
  ];
  occasionOptions = ['Wedding', 'Engagement', 'Daily Wear', 'Party', 'Festival', 'Office Wear', 'Anniversary'];
  brandOptions = ['IVY', 'Butterfly', 'Mirage', 'Orchid', 'Solo'];
  pricePresets = [
    { label: 'Under ₹10K', min: 0, max: 10000 },
    { label: '₹10K-₹25K', min: 10000, max: 25000 },
    { label: '₹25K-₹50K', min: 25000, max: 50000 },
    { label: '₹50K-₹1L', min: 50000, max: 100000 },
    { label: 'Above ₹1L', min: 100000, max: undefined as any },
  ];
  weightPresets = [
    { label: '0-2g', min: 0, max: 2 },
    { label: '2-5g', min: 2, max: 5 },
    { label: '5-10g', min: 5, max: 10 },
    { label: '10-20g', min: 10, max: 20 },
    { label: '20g+', min: 20, max: undefined as any },
  ];

  skeletonArray = new Array(10);

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Load gold rates
    this.api.getGoldRates().subscribe({
      next: (rates) => {
        const rate22k = rates.find(r => r.karat === '22K') || rates[0];
        if (rate22k) this.currentGoldRate.set(rate22k);
      },
    });

    this.routeSub = this.route.params.subscribe((params) => {
      this.parseRouteAndLoad(params);
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  private parseRouteAndLoad(params: any): void {
    const url = this.router.url;
    this.filter = {};
    this.page = 1;
    let title = 'All Jewellery';
    let metal = '';

    // Parse JA-style URLs
    if (url.startsWith('/gold-jewellery')) {
      metal = 'gold';
      this.filter.karat = '22K';
      title = params['category'] ? this.formatTitle(params['category']) : 'Gold Jewellery';
      if (params['category']) this.filter.categorySlug = params['category'];
    } else if (url.startsWith('/diamond-jewellery')) {
      metal = 'diamond';
      title = params['category'] ? this.formatTitle(params['category']) : 'Diamond Jewellery';
      if (params['category']) this.filter.categorySlug = params['category'];
    } else if (url.startsWith('/platinum-jewellery')) {
      metal = 'platinum';
      title = params['category'] ? this.formatTitle(params['category']) : 'Platinum Jewellery';
      if (params['category']) this.filter.categorySlug = params['category'];
    } else if (url.startsWith('/silver-jewellery')) {
      metal = 'silver';
      title = params['category'] ? this.formatTitle(params['category']) : 'Silver Jewellery';
      if (params['category']) this.filter.categorySlug = params['category'];
    } else if (url.startsWith('/kids-jewellery')) {
      this.filter.gender = 'Kids';
      title = params['category'] ? this.formatTitle(params['category']) : 'Kids Jewellery';
      if (params['category']) this.filter.categorySlug = params['category'];
    } else if (url.startsWith('/18k-jewellery')) {
      this.filter.karat = '18K';
      title = '18K Jewellery';
    } else if (url.startsWith('/gold-coin')) {
      this.filter.categorySlug = 'gold-coins';
      title = 'Gold Coins';
    } else if (url.startsWith('/collections/')) {
      title = this.formatTitle(params['collection'] || 'Collection');
    } else if (url.startsWith('/category/')) {
      this.filter.categorySlug = params['slug'];
      title = this.formatTitle(params['slug'] || 'Category');
    } else if (params['slug']) {
      this.filter.categorySlug = params['slug'];
      title = this.formatTitle(params['slug']);
    }

    // Apply query params
    const qp = this.route.snapshot.queryParams;
    if (qp['gender']) { this.filter.gender = qp['gender']; this.selectedGender.set(qp['gender']); }
    if (qp['search']) { this.filter.search = qp['search']; title = `Search: "${qp['search']}"`; }
    if (qp['maxPrice']) { this.filter.maxPrice = +qp['maxPrice']; }

    this.metalType.set(metal);
    this.pageTitle.set(title);
    this.loadProducts(false);
  }

  private formatTitle(slug: string): string {
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  toggleFilter(type: string, value: string): void {
    switch (type) {
      case 'gender':
        this.selectedGender.set(this.selectedGender() === value ? '' : value);
        break;
      case 'karat':
        this.selectedKarat.set(this.selectedKarat() === value ? '' : value);
        break;
      case 'metalColor':
        this.selectedMetalColor.set(this.selectedMetalColor() === value ? '' : value);
        break;
      case 'occasion':
        this.selectedOccasion.set(this.selectedOccasion() === value ? '' : value);
        break;
      case 'brand':
        this.selectedBrand.set(this.selectedBrand() === value ? '' : value);
        break;
    }
    this.applyFilters();
  }

  setPrice(min: number, max: number | undefined): void {
    const label = this.pricePresets.find(p => p.min === min && p.max === max)?.label || '';
    this.activePrice.set(this.activePrice() === label ? '' : label);
    if (this.activePrice()) {
      this.filter.minPrice = min;
      this.filter.maxPrice = max;
    } else {
      delete this.filter.minPrice;
      delete this.filter.maxPrice;
    }
    this.page = 1;
    this.loadProducts(false);
  }

  setWeight(min: number, max: number | undefined): void {
    const label = this.weightPresets.find(w => w.min === min && w.max === max)?.label || '';
    this.activeWeight.set(this.activeWeight() === label ? '' : label);
    if (this.activeWeight()) {
      this.filter.minWeight = min;
      this.filter.maxWeight = max;
    } else {
      delete this.filter.minWeight;
      delete this.filter.maxWeight;
    }
    this.page = 1;
    this.loadProducts(false);
  }

  removeFilter(label: string): void {
    if (this.selectedGender() === label) this.selectedGender.set('');
    if (this.selectedKarat() === label) this.selectedKarat.set('');
    if (this.selectedMetalColor() === label) this.selectedMetalColor.set('');
    if (this.selectedOccasion() === label) this.selectedOccasion.set('');
    if (this.selectedBrand() === label) this.selectedBrand.set('');
    if (this.activePrice() === label) { this.activePrice.set(''); delete this.filter.minPrice; delete this.filter.maxPrice; }
    if (this.activeWeight() === label) { this.activeWeight.set(''); delete this.filter.minWeight; delete this.filter.maxWeight; }
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedGender.set('');
    this.selectedKarat.set('');
    this.selectedMetalColor.set('');
    this.selectedOccasion.set('');
    this.selectedBrand.set('');
    this.activePrice.set('');
    this.activeWeight.set('');
    this.sortBy = '';
    delete this.filter.minPrice;
    delete this.filter.maxPrice;
    delete this.filter.minWeight;
    delete this.filter.maxWeight;
    this.page = 1;
    this.loadProducts(false);
  }

  applyFilters(): void {
    this.page = 1;
    this.loadProducts(false);
  }

  loadMore(): void {
    this.page++;
    this.loadProducts(true);
  }

  private loadProducts(append: boolean): void {
    if (append) {
      this.isLoadingMore.set(true);
    } else {
      this.isLoading.set(true);
    }

    const f: ProductFilter = {
      ...this.filter,
      page: this.page,
      pageSize: this.pageSize,
      sortBy: this.sortBy || undefined,
    };

    if (this.selectedGender()) f.gender = this.selectedGender();
    if (this.selectedKarat()) f.karat = this.selectedKarat();

    this.api.getProducts(f).subscribe({
      next: (res) => {
        if (append) {
          this.products.set([...this.products(), ...res.items]);
        } else {
          this.products.set(res.items);
        }
        this.totalCount.set(res.totalCount);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
    });
  }
}
