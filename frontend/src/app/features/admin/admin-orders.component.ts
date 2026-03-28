import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-heading font-bold text-gray-800">Orders</h2>

      <!-- Filter -->
      <div class="bg-white rounded-lg shadow-sm p-4 border flex gap-3 items-center">
        <label class="text-xs text-gray-500">Filter:</label>
        @for (s of statuses; track s) {
          <button (click)="filterStatus = filterStatus === s ? '' : s; loadOrders()"
            class="px-3 py-1 text-xs border rounded transition-colors"
            [class]="filterStatus === s ? 'bg-primary-900 text-white border-primary-900' : 'bg-white text-gray-600 hover:bg-gray-50'">
            {{ s }}
          </button>
        }
      </div>

      <!-- Orders Table -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th class="px-4 py-3 text-left">Order #</th>
              <th class="px-4 py-3 text-left">Customer</th>
              <th class="px-4 py-3 text-right">Amount</th>
              <th class="px-4 py-3 text-center">Items</th>
              <th class="px-4 py-3 text-center">Status</th>
              <th class="px-4 py-3 text-center">Payment</th>
              <th class="px-4 py-3 text-left">Date</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (o of orders(); track o.orderNumber) {
              <tr class="border-b hover:bg-gray-50/50">
                <td class="px-4 py-3 font-medium">{{ o.orderNumber }}</td>
                <td class="px-4 py-3">
                  <p>{{ o.customerName }}</p>
                  <p class="text-[10px] text-gray-400">{{ o.customerEmail }}</p>
                </td>
                <td class="px-4 py-3 text-right font-price font-bold">₹{{ o.totalAmount | number:'1.0-0' }}</td>
                <td class="px-4 py-3 text-center">{{ o.itemCount }}</td>
                <td class="px-4 py-3 text-center">
                  <select [(ngModel)]="o.status" (change)="updateStatus(o.id, o.status)" class="text-xs border rounded px-2 py-1">
                    @for (s of statuses; track s) { <option [value]="s">{{ s }}</option> }
                  </select>
                </td>
                <td class="px-4 py-3 text-center">
                  <span class="text-xs" [class]="o.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'">{{ o.paymentStatus }}</span>
                </td>
                <td class="px-4 py-3 text-gray-500">{{ o.createdAt | date:'short' }}</td>
                <td class="px-4 py-3 text-right">
                  <span class="text-xs text-gray-400">{{ o.shippingCity }}</span>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  private api = `${environment.apiUrl}/admin`;
  orders = signal<any[]>([]);
  filterStatus = '';
  statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void { this.loadOrders(); }

  loadOrders(): void {
    const params: any = { page: 1, pageSize: 50 };
    if (this.filterStatus) params.status = this.filterStatus;
    this.http.get<any>(`${this.api}/orders`, { params }).subscribe(d => this.orders.set(d.items));
  }

  updateStatus(orderId: number, status: string): void {
    this.http.put(`${this.api}/orders/${orderId}/status`, { status }).subscribe();
  }
}
