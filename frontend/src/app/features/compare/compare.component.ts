import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '@core/services/cart.service';
import { WishlistService } from '@core/services/wishlist.service';
import { Product } from '@core/models';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white border-b border-gray-100 py-6">
        <div class="max-w-7xl mx-auto px-4">
          <h1 class="font-heading text-2xl text-gray-800">Compare Products</h1>
          <p class="text-gray-500 text-sm mt-1">Compare up to 4 products side by side</p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-8">
        @if (compareItems().length === 0) {
          <div class="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div class="text-7xl mb-5">⚖️</div>
            <h2 class="font-heading text-xl text-gray-700 mb-2">No products to compare</h2>
            <p class="text-gray-400 text-sm mb-6">Add products from the product listing page to compare them here.</p>
            <a routerLink="/products" class="btn-primary inline-block py-3 px-8 text-sm">BROWSE PRODUCTS</a>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full bg-white rounded-2xl shadow-sm overflow-hidden">
              <thead>
                <tr class="border-b border-gray-100">
                  <th class="p-4 text-left w-40">
                    <span class="font-heading text-xs uppercase tracking-wider text-gray-500">Attribute</span>
                  </th>
                  @for (item of compareItems(); track item.id) {
                    <th class="p-4 text-center min-w-48">
                      <div class="relative">
                        <button (click)="removeItem(item.id)"
                          class="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-500 rounded-full text-xs hover:bg-red-200 transition-colors">✕</button>
                        <img [src]="getImage(item)" [alt]="item.name" class="w-24 h-24 object-cover rounded-xl mx-auto mb-2 bg-gray-50">
                        <p class="font-heading text-xs text-gray-700 leading-tight">{{ item.name }}</p>
                      </div>
                    </th>
                  }
                  @for (i of emptySlots(); track i) {
                    <th class="p-4 text-center min-w-48">
                      <a routerLink="/products" class="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-gold-300 transition-colors text-gray-400 hover:text-gold-600">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        <span class="text-xs">Add Product</span>
                      </a>
                    </th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (row of compareRows; track row.label) {
                  <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td class="p-4 text-xs font-heading uppercase tracking-wider text-gray-500">{{ row.label }}</td>
                    @for (item of compareItems(); track item.id) {
                      <td class="p-4 text-center text-sm text-gray-700" [innerHTML]="row.getValue(item)"></td>
                    }
                    @for (i of emptySlots(); track i) {
                      <td class="p-4 text-center text-gray-200">—</td>
                    }
                  </tr>
                }
                <!-- Actions row -->
                <tr>
                  <td class="p-4"></td>
                  @for (item of compareItems(); track item.id) {
                    <td class="p-4 text-center">
                      <div class="flex flex-col gap-2">
                        <button (click)="addToCart(item)" class="btn-primary text-xs py-2">ADD TO BAG</button>
                        <button (click)="addToWishlist(item)" class="btn-gold text-xs py-2">♡ WISHLIST</button>
                      </div>
                    </td>
                  }
                  @for (i of emptySlots(); track i) {
                    <td class="p-4"></td>
                  }
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 text-right">
            <button (click)="clearAll()" class="text-sm text-red-500 hover:underline">Clear All</button>
          </div>
        }
      </div>
    </div>
  `
})
export class CompareComponent implements OnInit {
  compareItems = signal<Product[]>([]);

  emptySlots() {
    return Array(Math.max(0, 4 - this.compareItems().length)).fill(0);
  }

  compareRows = [
    { label: 'Price', getValue: (p: Product) => `<strong class="text-primary-900 font-heading">₹${(p.calculatedPrice || 0).toLocaleString('en-IN')}</strong>` },
    { label: 'Metal', getValue: (p: Product) => p.metal || '—' },
    { label: 'Karat', getValue: (p: Product) => p.karat ? `${p.karat}KT` : '—' },
    { label: 'Gross Weight', getValue: (p: Product) => p.grossWeight ? `${p.grossWeight}g` : '—' },
    { label: 'Net Weight', getValue: (p: Product) => p.netWeight ? `${p.netWeight}g` : '—' },
    { label: 'Category', getValue: (p: Product) => p.categoryName || '—' },
    { label: 'BIS HUID', getValue: (p: Product) => '<span class="text-green-600 text-xs">✓ Hallmarked</span>' },
    { label: 'In Stock', getValue: (p: Product) => p.stockQuantity > 0 ? '<span class="text-green-600">✓ Yes</span>' : '<span class="text-red-500">✗ No</span>' },
  ];

  constructor(private cart: CartService, private wishlist: WishlistService) {}

  ngOnInit() {
    // Load from localStorage
    try {
      const saved = localStorage.getItem('compareList');
      if (saved) this.compareItems.set(JSON.parse(saved));
    } catch {}
  }

  getImage(p: Product): string {
    const primary = p.images?.find(i => i.isPrimary);
    return primary?.imageUrl || p.images?.[0]?.imageUrl || 'https://placehold.co/200x200/f4eeeb/834e32?text=Jewel';
  }

  removeItem(id: number) {
    const updated = this.compareItems().filter(p => p.id !== id);
    this.compareItems.set(updated);
    localStorage.setItem('compareList', JSON.stringify(updated));
  }

  clearAll() {
    this.compareItems.set([]);
    localStorage.removeItem('compareList');
  }

  addToCart(item: Product) {
    this.cart.addItem({ productId: item.id, productName: item.name, slug: item.slug, imageUrl: item.images?.[0]?.imageUrl || '', karat: item.karat, grossWeight: item.grossWeight, unitPrice: item.calculatedPrice, quantity: 1 });
  }
  addToWishlist(item: Product) { this.wishlist.toggle(item.id); }
}
