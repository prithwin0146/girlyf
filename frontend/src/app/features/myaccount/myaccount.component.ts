import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-myaccount',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Page Header -->
      <div class="bg-primary-900 py-8">
        <div class="max-w-7xl mx-auto px-4">
          <h1 class="font-heading text-2xl text-white">My Account</h1>
          <p class="text-white/60 text-sm mt-1">{{ user()?.name || 'Welcome' }}, manage your orders and preferences</p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex flex-col lg:flex-row gap-6">

          <!-- Left Sidebar -->
          <div class="lg:w-64 flex-shrink-0">
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
              <!-- User avatar section -->
              <div class="bg-gradient-to-br from-primary-900 to-primary-800 p-6 text-center">
                <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <p class="text-white font-heading font-semibold">{{ user()?.name }}</p>
                <p class="text-white/60 text-xs mt-1">{{ user()?.email }}</p>
              </div>

              <!-- Menu -->
              <nav class="p-2">
                @for (item of menuItems; track item.id) {
                  <button (click)="setActive(item.id)"
                    class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all mb-1"
                    [ngClass]="activeTab() === item.id ? 'bg-primary-900 text-white' : 'text-gray-600 hover:bg-trust hover:text-primary-900'">
                    <span class="text-xl">{{ item.icon }}</span>
                    <span class="font-heading tracking-wide">{{ item.label }}</span>
                  </button>
                }
                <button (click)="logout()"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all mt-2">
                  <span class="text-xl">🚪</span>
                  <span class="font-heading tracking-wide">LOGOUT</span>
                </button>
              </nav>
            </div>
          </div>

          <!-- Right Content -->
          <div class="flex-1">

            <!-- MY ORDERS TAB -->
            @if (activeTab() === 'orders') {
              <div class="bg-white rounded-2xl shadow-sm p-6">
                <h2 class="font-heading text-lg text-gray-800 mb-6">My Orders</h2>
                @if (orders().length === 0) {
                  <div class="text-center py-16">
                    <div class="text-6xl mb-4">📦</div>
                    <p class="font-heading text-gray-600 text-lg mb-2">No orders yet</p>
                    <p class="text-gray-400 text-sm mb-6">Start shopping and your orders will appear here</p>
                    <a routerLink="/products" class="btn-primary inline-block py-3 px-8 text-sm">SHOP NOW</a>
                  </div>
                } @else {
                  @for (order of orders(); track order.id) {
                    <div class="border border-gray-100 rounded-xl p-4 mb-4 hover:border-gold-300 transition-colors">
                      <div class="flex justify-between items-start mb-3">
                        <div>
                          <p class="font-heading font-semibold text-primary-900">#{{ order.id }}</p>
                          <p class="text-xs text-gray-400 mt-0.5">{{ order.date }}</p>
                        </div>
                        <span class="text-xs px-3 py-1 rounded-full font-medium"
                          [ngClass]="order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'">
                          {{ order.status }}
                        </span>
                      </div>
                      <div class="flex items-center gap-3 border-t border-gray-50 pt-3">
                        <img [src]="order.image" [alt]="order.name" class="w-14 h-14 object-cover rounded-lg bg-gray-100">
                        <div class="flex-1">
                          <p class="text-sm font-medium text-gray-700">{{ order.name }}</p>
                          <p class="text-sm font-heading text-primary-900 mt-0.5">₹{{ order.total | number }}</p>
                        </div>
                        <a [routerLink]="['/orders']" class="text-xs text-gold-600 hover:underline">Track →</a>
                      </div>
                    </div>
                  }
                }
              </div>
            }

            <!-- WISHLIST TAB -->
            @if (activeTab() === 'wishlist') {
              <div class="bg-white rounded-2xl shadow-sm p-6">
                <h2 class="font-heading text-lg text-gray-800 mb-6">My Wishlist</h2>
                <div class="text-center py-12">
                  <div class="text-6xl mb-4">❤️</div>
                  <p class="text-gray-500 mb-4">Your wishlist is empty</p>
                  <a routerLink="/products" class="btn-gold inline-block py-2 px-6 text-sm">Browse Products</a>
                </div>
              </div>
            }

            <!-- DIGI WALLET TAB -->
            @if (activeTab() === 'wallet') {
              <div class="bg-white rounded-2xl shadow-sm p-6">
                <h2 class="font-heading text-lg text-gray-800 mb-6">Digi Gold Wallet</h2>
                <div class="bg-gradient-to-r from-gold-400 to-yellow-400 rounded-2xl p-6 mb-6 text-primary-900">
                  <p class="text-xs uppercase tracking-wider mb-2 opacity-70">Available Balance</p>
                  <p class="font-heading text-3xl font-bold">₹0.00</p>
                  <p class="text-xs mt-2 opacity-70">0.000 gm of Digital Gold</p>
                </div>
                <a routerLink="/digi-gold" class="btn-primary inline-block py-3 px-6 text-sm">Buy Digi Gold</a>
              </div>
            }

            <!-- ACCOUNT SETTINGS TAB -->
            @if (activeTab() === 'settings') {
              <div class="bg-white rounded-2xl shadow-sm p-6">
                <h2 class="font-heading text-lg text-gray-800 mb-6">Account Settings</h2>
                <div class="grid gap-4">
                  @for (field of profileFields; track field.label) {
                    <div class="border border-gray-100 rounded-xl p-4">
                      <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">{{ field.label }}</p>
                      <p class="text-sm font-medium text-gray-700">{{ field.value }}</p>
                    </div>
                  }
                </div>
                <button class="btn-primary mt-6 py-3 px-6 text-sm">EDIT PROFILE</button>
              </div>
            }

            <!-- HELP TAB -->
            @if (activeTab() === 'help') {
              <div class="bg-white rounded-2xl shadow-sm p-6">
                <h2 class="font-heading text-lg text-gray-800 mb-6">Help & Support</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  @for (item of helpItems; track item.title) {
                    <a [href]="item.href" target="_blank"
                      class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-gold-300 hover:bg-trust transition-all">
                      <span class="text-3xl">{{ item.icon }}</span>
                      <div>
                        <p class="font-heading text-sm text-gray-700">{{ item.title }}</p>
                        <p class="text-xs text-gray-400 mt-0.5">{{ item.desc }}</p>
                      </div>
                    </a>
                  }
                </div>
              </div>
            }

          </div>
        </div>
      </div>
    </div>
  `
})
export class MyAccountComponent implements OnInit {
  activeTab = signal('orders');
  orders = signal<any[]>([]);

  menuItems = [
    { id: 'orders', icon: '📦', label: 'MY ORDERS' },
    { id: 'wishlist', icon: '❤️', label: 'WISHLIST' },
    { id: 'wallet', icon: '💰', label: 'DIGI WALLET' },
    { id: 'settings', icon: '⚙️', label: 'ACCOUNT SETTINGS' },
    { id: 'help', icon: '🎧', label: 'HELP & SUPPORT' },
  ];

  helpItems = [
    { icon: '📞', title: 'Call Us', desc: '0091 8606083922', href: 'tel:+918606083922' },
    { icon: '💬', title: 'WhatsApp', desc: 'Chat with us', href: 'https://api.whatsapp.com/send?phone=918606083922' },
    { icon: '📧', title: 'Email Us', desc: 'ecomsupport@girlyf.com', href: 'mailto:support@girlyf.com' },
    { icon: '❓', title: 'FAQ', desc: 'Common questions', href: '/faq' },
  ];

  get user() { return this.auth.user; }

  get profileFields() {
    const u = this.user();
    return [
      { label: 'Full Name', value: u?.name || '—' },
      { label: 'Email Address', value: u?.email || '—' },
      { label: 'Mobile Number', value: '—' },
      { label: 'Member Since', value: '2025' },
    ];
  }

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {}

  setActive(tab: string) { this.activeTab.set(tab); }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
