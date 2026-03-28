import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-heading font-bold text-gray-800">Products</h2>
        <button (click)="showForm = !showForm" class="btn-primary text-xs px-4 py-2 flex items-center gap-1">
          <mat-icon class="text-sm">add</mat-icon> Add Product
        </button>
      </div>

      <!-- Search -->
      <div class="bg-white rounded-lg shadow-sm p-4 border">
        <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="loadProducts()" placeholder="Search by name or SKU..."
          class="w-full px-4 py-2 border rounded text-sm focus:outline-none focus:border-gold-500">
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th class="px-4 py-3 text-left">Product</th>
              <th class="px-4 py-3 text-left">SKU</th>
              <th class="px-4 py-3 text-left">Category</th>
              <th class="px-4 py-3 text-right">Weight</th>
              <th class="px-4 py-3 text-center">Stock</th>
              <th class="px-4 py-3 text-center">Status</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (p of products(); track p.id) {
              <tr class="border-b hover:bg-gray-50/50">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      @if (p.images?.length) {
                        <img [src]="p.images[0].imageUrl" class="w-full h-full object-cover">
                      }
                    </div>
                    <span class="font-medium line-clamp-1">{{ p.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-gray-500">{{ p.sku }}</td>
                <td class="px-4 py-3">{{ p.category?.name }}</td>
                <td class="px-4 py-3 text-right font-price">{{ p.grossWeight }}g</td>
                <td class="px-4 py-3 text-center">{{ p.stockQuantity }}</td>
                <td class="px-4 py-3 text-center">
                  <span class="px-2 py-0.5 text-[10px] rounded-full font-semibold"
                    [class]="p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                    {{ p.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <button (click)="deleteProduct(p.id)" class="text-red-500 hover:text-red-700 text-xs">
                    <mat-icon class="text-base">delete</mat-icon>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-4 py-3 bg-gray-50">
          <span class="text-xs text-gray-500">Showing {{ products().length }} of {{ total() }} products</span>
          <div class="flex gap-1">
            <button (click)="page > 1 && changePage(page - 1)" [disabled]="page <= 1" class="px-3 py-1 text-xs border rounded disabled:opacity-50">Prev</button>
            <button (click)="changePage(page + 1)" [disabled]="page >= totalPages()" class="px-3 py-1 text-xs border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminProductsComponent implements OnInit {
  private api = `${environment.apiUrl}/admin`;
  products = signal<any[]>([]);
  total = signal(0);
  totalPages = signal(0);
  page = 1;
  searchQuery = '';
  showForm = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void { this.loadProducts(); }

  loadProducts(): void {
    const params: any = { page: this.page, pageSize: 20 };
    if (this.searchQuery) params.search = this.searchQuery;
    this.http.get<any>(`${this.api}/products`, { params }).subscribe(data => {
      this.products.set(data.items);
      this.total.set(data.total);
      this.totalPages.set(data.totalPages);
    });
  }

  changePage(p: number): void { this.page = p; this.loadProducts(); }

  deleteProduct(id: number): void {
    if (confirm('Deactivate this product?')) {
      this.http.delete(`${this.api}/products/${id}`).subscribe(() => this.loadProducts());
    }
  }
}
