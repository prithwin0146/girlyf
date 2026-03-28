import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Order } from '@core/models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-brown-200/50 py-3">
      <div class="max-w-7xl mx-auto px-4 flex items-center gap-2 text-xs text-gray-500">
        <a routerLink="/" class="hover:text-primary-900">Home</a><span>/</span>
        <span class="text-primary-900 font-semibold">My Orders</span>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-6">
      <h1 class="font-heading text-lg text-primary-900 mb-6">My Orders</h1>

      @if (orders().length === 0) {
        <div class="text-center py-20">
          <span class="text-6xl">📦</span>
          <h2 class="font-heading text-xl text-gray-700 mt-4">No orders yet</h2>
          <p class="text-sm text-gray-500 mt-2">Your order history will appear here</p>
          <a routerLink="/products" class="btn-gold text-sm mt-6 inline-block">START SHOPPING</a>
        </div>
      } @else {
        <div class="space-y-4">
          @for (order of orders(); track order.id) {
            <div class="bg-white border border-gray-100 overflow-hidden">
              <!-- ORDER HEADER -->
              <div class="bg-gray-50 px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-4">
                  <div><p class="text-[9px] text-gray-400 uppercase">Order #</p><p class="text-xs font-bold font-price">{{ order.orderNumber }}</p></div>
                  <div><p class="text-[9px] text-gray-400 uppercase">Placed On</p><p class="text-xs">{{ order.createdAt | date:'mediumDate' }}</p></div>
                  <div><p class="text-[9px] text-gray-400 uppercase">Total</p><p class="text-xs font-bold price-display">₹{{ order.totalAmount | number:'1.0-0' }}</p></div>
                </div>
                <span class="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider"
                  [ngClass]="getStatusClass(order.status)">{{ order.status }}</span>
              </div>

              <!-- 7-STEP TRACKER (JA-style) -->
              <div class="px-5 py-4">
                <div class="flex items-center justify-between mb-4">
                  @for (s of trackingSteps; track s.key; let i = $index) {
                    <div class="flex items-center" [class.flex-1]="i < trackingSteps.length - 1">
                      <div class="flex flex-col items-center">
                        <div class="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-colors"
                          [ngClass]="getStepIndex(order.status) >= i ?
                            'bg-green-500 border-green-500 text-white' :
                            'bg-white border-gray-300 text-gray-400'">
                          @if (getStepIndex(order.status) >= i) { ✓ } @else { {{ i + 1 }} }
                        </div>
                        <span class="text-[7px] mt-1 text-gray-400 text-center whitespace-nowrap hidden md:block">{{ s.label }}</span>
                      </div>
                      @if (i < trackingSteps.length - 1) {
                        <div class="flex-1 h-0.5 mx-1 transition-colors"
                          [ngClass]="getStepIndex(order.status) > i ? 'bg-green-500' : 'bg-gray-200'"></div>
                      }
                    </div>
                  }
                </div>

                <!-- ORDER ITEMS -->
                <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  @for (item of order.items; track item.productId) {
                    <a [routerLink]="['/product', item.productId]" class="flex-shrink-0 flex items-center gap-2 bg-gray-50 p-2 border border-gray-100 hover:border-gold-500/30">
                      <img [src]="item.imageUrl" class="w-12 h-12 object-cover border">
                      <div>
                        <p class="text-[10px] line-clamp-1 w-32">{{ item.productName }}</p>
                        <p class="text-[9px] text-gray-400">Qty: {{ item.quantity }}</p>
                        <p class="text-[10px] font-price font-bold">₹{{ item.totalPrice | number:'1.0-0' }}</p>
                      </div>
                    </a>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class OrdersComponent implements OnInit {
  orders = signal<Order[]>([]);

  trackingSteps = [
    { key: 'placed', label: 'Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'quality_check', label: 'Quality Check' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
  ];

  ngOnInit(): void {
    // Demo orders
    this.orders.set([
      {
        id: 1, orderNumber: 'GF-2024-001', totalAmount: 45999, status: 'shipped',
        paymentStatus: 'paid', paymentMethod: 'phonepe', createdAt: '2024-11-15',
        items: [
          { productId: 1, productName: 'Gold Floral Pendant Necklace', imageUrl: '', quantity: 1, unitPrice: 45999, totalPrice: 45999 }
        ]
      },
      {
        id: 2, orderNumber: 'GF-2024-002', totalAmount: 28500, status: 'processing',
        paymentStatus: 'paid', paymentMethod: 'upi', createdAt: '2024-11-20',
        items: [
          { productId: 2, productName: '22K Gold Diamond Stud Earrings', imageUrl: '', quantity: 1, unitPrice: 28500, totalPrice: 28500 }
        ]
      },
    ]);
  }

  getStepIndex(status: string): number {
    const map: Record<string, number> = {
      'placed': 0, 'confirmed': 1, 'processing': 2, 'quality_check': 3,
      'shipped': 4, 'out_for_delivery': 5, 'delivered': 6
    };
    return map[status.toLowerCase()] ?? 0;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'placed': 'bg-blue-50 text-blue-700',
      'confirmed': 'bg-blue-50 text-blue-700',
      'processing': 'bg-yellow-50 text-yellow-700',
      'shipped': 'bg-purple-50 text-purple-700',
      'delivered': 'bg-green-50 text-green-700',
      'cancelled': 'bg-red-50 text-red-700',
    };
    return map[status.toLowerCase()] || 'bg-gray-50 text-gray-700';
  }
}
