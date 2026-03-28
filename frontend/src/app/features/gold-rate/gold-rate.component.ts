import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { GoldRate } from '@core/models';

@Component({
  selector: 'app-gold-rate',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="bg-primary-900 py-12">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <p class="text-gold-400 font-accent text-xs uppercase tracking-[0.3em] mb-3">Updated Daily</p>
        <h1 class="font-heading text-3xl text-white">Today's Gold Rate</h1>
        <div class="gold-divider mx-auto mt-4"></div>
        <p class="text-white/60 text-xs mt-3">Last updated: {{ today | date:'medium' }}</p>
      </div>
    </section>

    <div class="max-w-5xl mx-auto px-4 py-10">
      <!-- MAIN RATES -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        @for (rate of goldRates(); track rate.karat) {
          <div class="bg-white border-2 p-6 text-center hover:border-gold-500 transition-colors"
            [class.border-gold-500]="rate.karat === '22K'" [class.border-gray-100]="rate.karat !== '22K'">
            @if (rate.karat === '22K') {
              <span class="text-[9px] bg-gold-500 text-primary-900 px-2 py-0.5 uppercase font-bold tracking-wider">Most Popular</span>
            }
            <p class="font-heading text-lg text-primary-900 mt-2">{{ rate.karat }} Gold</p>
            <p class="text-3xl font-price font-bold text-gold-600 mt-2">₹{{ rate.ratePerGram | number:'1.0-0' }}</p>
            <p class="text-xs text-gray-400 mt-1">per gram</p>
            <div class="mt-3 grid grid-cols-2 gap-2 text-[10px]">
              <div class="bg-gray-50 p-2 rounded"><p class="text-gray-400">Per 8g (1 Pavan)</p><p class="font-price font-bold">₹{{ rate.ratePerGram * 8 | number:'1.0-0' }}</p></div>
              <div class="bg-gray-50 p-2 rounded"><p class="text-gray-400">Per 10g</p><p class="font-price font-bold">₹{{ rate.ratePerGram * 10 | number:'1.0-0' }}</p></div>
            </div>
          </div>
        }
      </div>

      <!-- CITY-WISE RATES -->
      <h2 class="section-title text-center">City-wise Gold Rates</h2>
      <div class="gold-divider mx-auto mb-6"></div>
      <div class="mb-6 flex justify-center">
        <select [(ngModel)]="selectedCity" class="px-4 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500 min-w-[200px]">
          <option value="">All Cities</option>
          @for (city of cities; track city) { <option [value]="city">{{ city }}</option> }
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-primary-900 text-white">
              <th class="px-4 py-3 text-left text-[10px] uppercase tracking-wider">City</th>
              <th class="px-4 py-3 text-right text-[10px] uppercase tracking-wider">24K / gram</th>
              <th class="px-4 py-3 text-right text-[10px] uppercase tracking-wider">22K / gram</th>
              <th class="px-4 py-3 text-right text-[10px] uppercase tracking-wider">18K / gram</th>
            </tr>
          </thead>
          <tbody>
            @for (city of filteredCities; track city; let odd = $odd) {
              <tr [class.bg-brown-200]="odd" [class.bg-white]="!odd" class="border-b border-gray-100">
                <td class="px-4 py-3 font-semibold">{{ city }}</td>
                <td class="px-4 py-3 text-right font-price">₹{{ getCityRate(city, '24K') | number:'1.0-0' }}</td>
                <td class="px-4 py-3 text-right font-price font-bold text-gold-600">₹{{ getCityRate(city, '22K') | number:'1.0-0' }}</td>
                <td class="px-4 py-3 text-right font-price">₹{{ getCityRate(city, '18K') | number:'1.0-0' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- GOLD CALCULATOR -->
      <div class="mt-10 p-6 bg-brown-200/30 border border-brown-500/10">
        <h3 class="font-heading text-sm uppercase tracking-wider text-primary-900 mb-4">Gold Price Calculator</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Weight (grams)</label>
            <input type="number" [(ngModel)]="calcWeight" min="0" step="0.1" class="w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Karat</label>
            <select [(ngModel)]="calcKarat" class="w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500">
              <option value="24K">24K</option>
              <option value="22K">22K</option>
              <option value="18K">18K</option>
            </select>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">Estimated Gold Value</p>
            <p class="text-2xl font-price font-bold text-gold-600">₹{{ calculatedValue | number:'1.0-0' }}</p>
          </div>
        </div>
        <p class="text-[10px] text-gray-400 mt-3">* This is the gold value only. Final jewellery price includes making charges, wastage, stones, and GST.</p>
      </div>

      <!-- INFO -->
      <div class="mt-10 space-y-4">
        <h3 class="font-heading text-sm uppercase tracking-wider text-primary-900">About Gold Rates</h3>
        <p class="text-sm text-gray-600 leading-relaxed">Gold rates in India are influenced by international bullion markets, the USD-INR exchange rate, and local demand. Rates can vary between cities due to local taxes and demand patterns.</p>
        <p class="text-sm text-gray-600 leading-relaxed">At Girlyf, we update our gold rates twice daily (10 AM and 5 PM) to ensure you always get the most current pricing. The rate displayed on any product page is the rate at which your order will be processed.</p>
      </div>
    </div>
  `,
})
export class GoldRateComponent implements OnInit {
  goldRates = signal<GoldRate[]>([]);
  today = new Date();
  selectedCity = '';
  calcWeight = 10;
  calcKarat = '22K';

  cities = ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Kochi', 'Hyderabad', 'Kolkata', 'Pune'];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getGoldRates().subscribe(rates => this.goldRates.set(rates));
  }

  get filteredCities(): string[] {
    return this.selectedCity ? [this.selectedCity] : this.cities;
  }

  getCityRate(city: string, karat: string): number {
    const baseRate = this.goldRates().find(r => r.karat === karat)?.ratePerGram || 0;
    const cityVariation: Record<string, number> = {
      'Chennai': 0, 'Mumbai': 50, 'Delhi': 30, 'Bangalore': 20,
      'Kochi': -10, 'Hyderabad': 15, 'Kolkata': 40, 'Pune': 35
    };
    return baseRate + (cityVariation[city] || 0);
  }

  get calculatedValue(): number {
    const rate = this.goldRates().find(r => r.karat === this.calcKarat)?.ratePerGram || 0;
    return rate * this.calcWeight;
  }
}
