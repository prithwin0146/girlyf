import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Component({
  selector: 'app-admin-gold-rates',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-xl font-heading font-bold text-gray-800">Gold Rate Management</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        @for (rate of rates(); track rate.id) {
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-heading font-bold text-gold-600">{{ rate.karat }}</h3>
              <mat-icon class="text-gold-400">auto_awesome</mat-icon>
            </div>
            <div class="mb-4">
              <label class="text-xs text-gray-500 block mb-1">Rate per gram (₹)</label>
              <input type="number" [(ngModel)]="rate.ratePerGram"
                class="w-full px-4 py-2 border rounded text-lg font-price font-bold focus:outline-none focus:border-gold-500">
            </div>
            <p class="text-[10px] text-gray-400 mb-3">Last updated: {{ rate.effectiveDate | date:'medium' }}</p>
            <button (click)="updateRate(rate)" class="btn-gold text-xs w-full py-2">
              <mat-icon class="text-sm mr-1">save</mat-icon> Update Rate
            </button>
          </div>
        }
      </div>

      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 class="font-heading font-bold text-gray-800 mb-3">Bulk Update All Rates</h3>
        <button (click)="bulkUpdate()" class="btn-primary text-xs px-6 py-2">
          <mat-icon class="text-sm mr-1">sync</mat-icon> Save All Rates
        </button>
      </div>
    </div>
  `
})
export class AdminGoldRatesComponent implements OnInit {
  private api = `${environment.apiUrl}/admin`;
  rates = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${this.api}/gold-rates`).subscribe(r => this.rates.set(r));
  }

  updateRate(rate: any): void {
    this.http.put(`${this.api}/gold-rates/${rate.id}`, { ratePerGram: rate.ratePerGram }).subscribe(updated => {
      alert(`${rate.karat} rate updated successfully!`);
    });
  }

  bulkUpdate(): void {
    const payload = this.rates().map(r => ({ karat: r.karat, ratePerGram: r.ratePerGram }));
    this.http.post(`${this.api}/gold-rates/bulk-update`, payload).subscribe(() => {
      alert('All rates updated!');
    });
  }
}
