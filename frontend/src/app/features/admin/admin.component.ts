import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, MatIconModule],
  template: `
    <div class="min-h-screen bg-gray-100 flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-primary-900 text-white flex-shrink-0 hidden lg:block">
        <div class="p-6 border-b border-white/10">
          <h1 class="font-heading text-lg tracking-wider text-gold-400">GIRLYF ADMIN</h1>
          <p class="text-xs text-white/50 mt-1">Management Dashboard</p>
        </div>
        <nav class="p-4 space-y-1">
          @for (item of navItems; track item.route) {
            <a [routerLink]="item.route" routerLinkActive="bg-white/10 text-gold-400"
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
              <mat-icon class="text-lg">{{ item.icon }}</mat-icon>
              {{ item.label }}
            </a>
          }
        </nav>
      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-auto">
        <header class="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h2 class="text-lg font-heading font-bold text-gray-800">Admin Panel</h2>
          <a routerLink="/" class="text-sm text-primary-700 hover:text-primary-900 flex items-center gap-1">
            <mat-icon class="text-base">storefront</mat-icon> View Store
          </a>
        </header>
        <div class="p-6">
          <router-outlet />
        </div>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin' },
    { label: 'Products', icon: 'inventory_2', route: '/admin/products' },
    { label: 'Orders', icon: 'receipt_long', route: '/admin/orders' },
    { label: 'Gold Rates', icon: 'trending_up', route: '/admin/gold-rates' },
    { label: 'Banners', icon: 'image', route: '/admin/banners' },
    { label: 'Users', icon: 'people', route: '/admin/users' },
  ];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        @for (stat of stats(); track stat.label) {
          <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wider">{{ stat.label }}</p>
                <p class="text-2xl font-bold text-gray-900 mt-1 font-price">{{ stat.value }}</p>
              </div>
              <div class="w-12 h-12 rounded-full flex items-center justify-center" [class]="stat.bg">
                <mat-icon class="text-xl" [class]="stat.iconColor">{{ stat.icon }}</mat-icon>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Recent Orders -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-heading font-bold text-gray-800">Recent Orders</h3>
          <a routerLink="/admin/orders" class="text-xs text-primary-700 hover:text-primary-900 font-semibold">VIEW ALL →</a>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th class="px-5 py-3 text-left">Order #</th>
                <th class="px-5 py-3 text-left">Amount</th>
                <th class="px-5 py-3 text-left">Status</th>
                <th class="px-5 py-3 text-left">Payment</th>
                <th class="px-5 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              @for (order of recentOrders(); track order.orderNumber) {
                <tr class="border-b border-gray-50 hover:bg-gray-50/50">
                  <td class="px-5 py-3 font-medium">{{ order.orderNumber }}</td>
                  <td class="px-5 py-3 font-price font-bold">₹{{ order.totalAmount | number:'1.0-0' }}</td>
                  <td class="px-5 py-3"><span class="px-2 py-0.5 text-[10px] rounded-full font-semibold" [class]="getStatusClass(order.status)">{{ order.status }}</span></td>
                  <td class="px-5 py-3"><span class="text-xs" [class]="order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'">{{ order.paymentStatus }}</span></td>
                  <td class="px-5 py-3 text-gray-500">{{ order.createdAt | date:'short' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private api = `${environment.apiUrl}/admin`;
  stats = signal<{ label: string; value: string; icon: string; bg: string; iconColor: string }[]>([]);
  recentOrders = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>(`${this.api}/dashboard`).subscribe(data => {
      this.stats.set([
        { label: 'Total Products', value: data.totalProducts.toString(), icon: 'inventory_2', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
        { label: 'Total Orders', value: data.totalOrders.toString(), icon: 'receipt_long', bg: 'bg-green-50', iconColor: 'text-green-600' },
        { label: 'Monthly Revenue', value: `₹${(data.monthlyRevenue || 0).toLocaleString('en-IN')}`, icon: 'payments', bg: 'bg-gold-50', iconColor: 'text-gold-600' },
        { label: 'Total Users', value: data.totalUsers.toString(), icon: 'people', bg: 'bg-purple-50', iconColor: 'text-purple-600' },
      ]);
      this.recentOrders.set(data.recentOrders || []);
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      Pending: 'bg-amber-100 text-amber-700',
      Confirmed: 'bg-blue-100 text-blue-700',
      Shipped: 'bg-indigo-100 text-indigo-700',
      Delivered: 'bg-green-100 text-green-700',
      Cancelled: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  }
}
