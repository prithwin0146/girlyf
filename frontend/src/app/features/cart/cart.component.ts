import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '@core/services/cart.service';
import { CartItem } from '@core/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="bg-brown-200/50 py-3">
      <div class="max-w-7xl mx-auto px-4 flex items-center gap-2 text-xs text-gray-500">
        <a routerLink="/" class="hover:text-primary-900">Home</a><span>/</span>
        <span class="text-primary-900 font-semibold">Shopping Bag</span>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-6">
      @if (cart.items().length === 0) {
        <div class="text-center py-20">
          <span class="text-6xl">🛍️</span>
          <h2 class="font-heading text-xl text-gray-700 mt-4">Your shopping bag is empty</h2>
          <p class="text-sm text-gray-500 mt-2">Looks like you haven't added any jewellery yet</p>
          <a routerLink="/products" class="btn-gold text-sm mt-6 inline-block">EXPLORE JEWELLERY</a>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- CART ITEMS -->
          <div class="lg:col-span-2 space-y-4">
            <h1 class="font-heading text-lg text-primary-900">Shopping Bag ({{ cart.itemCount() }} items)</h1>

            @for (item of cart.items(); track item.productId) {
              <div class="bg-white border border-gray-100 p-4 flex gap-4">
                <a [routerLink]="['/product', item.productId]" class="w-20 h-20 md:w-24 md:h-24 bg-gray-50 flex-shrink-0 overflow-hidden">
                  <img [src]="item.imageUrl" [alt]="item.productName" class="w-full h-full object-cover">
                </a>
                <div class="flex-1 min-w-0">
                  <a [routerLink]="['/product', item.productId]" class="text-sm font-heading text-gray-800 hover:text-primary-900 line-clamp-2">{{ item.productName }}</a>
                  <p class="text-[10px] text-gray-400 mt-0.5">{{ item.karat }} · {{ item.grossWeight }}g</p>
                  <p class="price-display text-sm mt-1">₹{{ item.unitPrice | number:'1.0-0' }}</p>

                  <div class="flex items-center gap-3 mt-2">
                    <div class="flex items-center border border-gray-200">
                      <button (click)="updateQty(item, -1)" class="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50">−</button>
                      <span class="w-7 h-7 flex items-center justify-center text-xs font-semibold border-x border-gray-200">{{ item.quantity }}</span>
                      <button (click)="updateQty(item, 1)" class="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50">+</button>
                    </div>
                    <button (click)="saveForLater(item)" class="text-[10px] text-primary-900 font-semibold hover:text-gold-600">SAVE FOR LATER</button>
                    <button (click)="cart.removeItem(item.productId)" class="text-[10px] text-red-500 hover:text-red-700">REMOVE</button>
                  </div>
                </div>
                <div class="text-right">
                  <p class="price-display text-sm font-bold">₹{{ item.totalPrice | number:'1.0-0' }}</p>
                </div>
              </div>
            }
          </div>

          <!-- ORDER SUMMARY -->
          <div class="lg:col-span-1">
            <div class="bg-white border border-gray-100 p-5 sticky top-20">
              <h3 class="font-heading text-sm uppercase tracking-wider text-primary-900 mb-4">Order Summary</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between"><span class="text-gray-500">Subtotal ({{ cart.itemCount() }} items)</span><span class="font-price">₹{{ cart.subTotal() | number:'1.0-0' }}</span></div>
                <div class="flex justify-between"><span class="text-gray-500">GST (3%)</span><span class="font-price">₹{{ cart.tax() | number:'1.0-0' }}</span></div>
                <div class="flex justify-between"><span class="text-gray-500">Shipping</span>
                  <span class="font-price">@if (cart.shipping() === 0) { <span class="text-green-600">FREE</span> } @else { ₹{{ cart.shipping() }} }</span>
                </div>
              </div>

              <!-- COUPON -->
              <div class="mt-4 pt-4 border-t border-gray-100">
                <div class="flex gap-2">
                  <input type="text" [(ngModel)]="couponCode" placeholder="Coupon code" class="flex-1 px-3 py-2 border border-gray-200 text-xs focus:outline-none focus:border-gold-500">
                  <button (click)="applyCoupon()" class="px-3 py-2 bg-primary-900 text-white text-xs hover:bg-primary-700">APPLY</button>
                </div>
                @if (couponMessage()) {
                  <p class="text-[10px] mt-1" [class.text-green-600]="couponValid()" [class.text-red-500]="!couponValid()">{{ couponMessage() }}</p>
                }
              </div>

              <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between text-base font-bold">
                <span>Total</span>
                <span class="price-display">₹{{ cart.total() | number:'1.0-0' }}</span>
              </div>

              <a routerLink="/checkout" class="btn-gold w-full text-center mt-4 py-3 text-sm font-bold block">PROCEED TO CHECKOUT</a>
              <a routerLink="/products" class="block text-center mt-2 text-xs text-primary-900 hover:text-gold-600">← Continue Shopping</a>
            </div>
          </div>
        </div>

        <!-- SAVED FOR LATER (JA-style) -->
        @if (savedItems().length > 0) {
          <div class="mt-10 border-t pt-8">
            <h2 class="section-title">Saved for Later ({{ savedItems().length }})</h2>
            <div class="gold-divider mb-6"></div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              @for (item of savedItems(); track item.productId) {
                <div class="bg-white border border-gray-100 p-3">
                  <div class="aspect-square bg-gray-50 overflow-hidden mb-2">
                    <img [src]="item.imageUrl" [alt]="item.productName" class="w-full h-full object-cover">
                  </div>
                  <p class="text-xs font-heading line-clamp-2">{{ item.productName }}</p>
                  <p class="price-display text-sm mt-1">₹{{ item.unitPrice | number:'1.0-0' }}</p>
                  <div class="flex gap-2 mt-2">
                    <button (click)="moveToCart(item)" class="flex-1 btn-primary text-[9px] py-1.5">MOVE TO BAG</button>
                    <button (click)="removeSaved(item)" class="px-2 text-red-500 text-xs">✕</button>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class CartComponent {
  savedItems = signal<CartItem[]>(this.loadSaved());
  couponCode = '';
  couponMessage = signal('');
  couponValid = signal(false);

  constructor(public cart: CartService) {}

  updateQty(item: CartItem, delta: number): void {
    this.cart.updateQuantity(item.productId, item.quantity + delta);
  }

  saveForLater(item: CartItem): void {
    const saved = [...this.savedItems(), item];
    this.savedItems.set(saved);
    localStorage.setItem('girlyf_saved', JSON.stringify(saved));
    this.cart.removeItem(item.productId);
  }

  moveToCart(item: CartItem): void {
    this.cart.addItem({ ...item, quantity: 1 });
    this.removeSaved(item);
  }

  removeSaved(item: CartItem): void {
    const saved = this.savedItems().filter(s => s.productId !== item.productId);
    this.savedItems.set(saved);
    localStorage.setItem('girlyf_saved', JSON.stringify(saved));
  }

  applyCoupon(): void {
    if (!this.couponCode.trim()) return;
    this.couponMessage.set('Invalid coupon code');
    this.couponValid.set(false);
  }

  private loadSaved(): CartItem[] {
    try { return JSON.parse(localStorage.getItem('girlyf_saved') || '[]'); } catch { return []; }
  }
}
