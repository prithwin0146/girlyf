import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-trust flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-lg">
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <!-- Success Header -->
          <div class="bg-gradient-to-r from-primary-900 to-primary-800 py-10 px-8 text-center">
            <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h1 class="font-heading text-2xl text-white mb-1">Order Placed Successfully!</h1>
            <p class="text-white/70 text-sm">Thank you for shopping with Girlyf</p>
          </div>

          <!-- Order Details -->
          <div class="p-8">
            <div class="border border-gray-100 rounded-xl p-5 mb-6 bg-gray-50">
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm text-gray-500">Order ID</span>
                <span class="font-heading font-semibold text-primary-900">#{{ orderId() }}</span>
              </div>
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm text-gray-500">Order Date</span>
                <span class="text-sm text-gray-700">{{ today }}</span>
              </div>
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm text-gray-500">Payment Status</span>
                <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Confirmed</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">Expected Delivery</span>
                <span class="text-sm font-medium text-gold-700">{{ deliveryDate }}</span>
              </div>
            </div>

            <!-- Delivery Steps -->
            <div class="mb-6">
              <h3 class="font-heading text-sm uppercase tracking-wider text-gray-600 mb-4">Order Status</h3>
              <div class="relative">
                <div class="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>
                @for (step of orderSteps; track step.label; let i = $index) {
                  <div class="flex items-start gap-4 mb-4 relative">
                    <div class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold z-10"
                      [ngClass]="i === 0 ? 'bg-primary-900 text-white' : 'bg-gray-200 text-gray-400'">
                      @if (i === 0) {
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                      } @else {
                        {{ i + 1 }}
                      }
                    </div>
                    <div class="pt-1">
                      <p class="text-sm font-medium" [ngClass]="i === 0 ? 'text-primary-900' : 'text-gray-400'">{{ step.label }}</p>
                      <p class="text-xs text-gray-400">{{ i === 0 ? step.time : '—' }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Trust Badges -->
            <div class="grid grid-cols-3 gap-3 mb-6">
              @for (badge of trustBadges; track badge.text) {
                <div class="text-center p-3 bg-trust rounded-xl">
                  <div class="text-2xl mb-1">{{ badge.icon }}</div>
                  <p class="text-xs text-gray-600 leading-tight">{{ badge.text }}</p>
                </div>
              }
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <a routerLink="/orders" class="flex-1 btn-primary py-3 text-center text-sm tracking-widest">TRACK ORDER</a>
              <a routerLink="/" class="flex-1 btn-gold py-3 text-center text-sm tracking-widest">CONTINUE SHOPPING</a>
            </div>
          </div>
        </div>

        <!-- WhatsApp support -->
        <div class="text-center mt-6">
          <p class="text-sm text-gray-500">Need help? Chat with us on</p>
          <a href="https://api.whatsapp.com/send?phone=918606083922&text=Hi%2C%20I%20need%20help%20with%20my%20order%20{{ orderId() }}"
            target="_blank"
            class="inline-flex items-center gap-2 mt-2 bg-green-500 text-white px-5 py-2 rounded-full text-sm hover:bg-green-600 transition-colors">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  `
})
export class OrderSuccessComponent implements OnInit {
  orderId = signal('');
  today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  deliveryDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  })();

  orderSteps = [
    { label: 'Order Placed', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
    { label: 'Payment Confirmed', time: '' },
    { label: 'Order Processed', time: '' },
    { label: 'Order Dispatched', time: '' },
    { label: 'Out for Delivery', time: '' },
    { label: 'Delivered', time: '' },
  ];

  trustBadges = [
    { icon: '🔒', text: 'Secure Payment' },
    { icon: '🚚', text: 'Free Shipping' },
    { icon: '✅', text: 'Authenticated' },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('orderId');
    this.orderId.set(id || 'GF' + Date.now().toString().slice(-8));
  }
}
