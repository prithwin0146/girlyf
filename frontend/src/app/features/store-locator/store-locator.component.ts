import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { StoreLocation } from '@core/models';

@Component({
  selector: 'app-store-locator',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="bg-brown-200/50 py-3">
      <div class="max-w-7xl mx-auto px-4 flex items-center gap-2 text-xs text-gray-500">
        <a routerLink="/" class="hover:text-primary-900">Home</a><span>/</span>
        <span class="text-primary-900 font-semibold">Store Locator</span>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="section-title text-center">Find a Store</h1>
      <div class="gold-divider mx-auto mb-8"></div>

      <!-- CASCADING FILTERS (JA: State → District → Store) -->
      <div class="flex flex-col md:flex-row items-center gap-3 justify-center mb-8">
        <select [(ngModel)]="selectedState" (ngModelChange)="onStateChange()" class="px-4 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500 min-w-[200px]">
          <option value="">Select State</option>
          @for (state of states(); track state) { <option [value]="state">{{ state }}</option> }
        </select>
        <select [(ngModel)]="selectedCity" (ngModelChange)="filterStores()" class="px-4 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500 min-w-[200px]">
          <option value="">Select City</option>
          @for (city of cities(); track city) { <option [value]="city">{{ city }}</option> }
        </select>
        @if (selectedState || selectedCity) {
          <button (click)="clearFilters()" class="text-xs text-primary-900 font-bold hover:text-gold-600">Clear Filters</button>
        }
      </div>

      <!-- MAP PLACEHOLDER -->
      <div class="bg-gray-100 h-64 md:h-80 mb-8 flex items-center justify-center border border-gray-200 rounded">
        <div class="text-center">
          <span class="text-4xl">🗺️</span>
          <p class="text-sm text-gray-500 mt-2">Google Maps integration</p>
          <p class="text-[10px] text-gray-400">Showing {{ filteredStores().length }} stores</p>
        </div>
      </div>

      <!-- STORE CARDS -->
      @if (filteredStores().length === 0) {
        <div class="text-center py-10">
          <p class="text-sm text-gray-500">No stores found for the selected filters</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (store of filteredStores(); track store.id) {
            <div class="bg-white border border-gray-100 p-5 hover:border-gold-500/20 hover:shadow-md transition-all">
              @if (store.imageUrl) {
                <div class="aspect-[16/9] overflow-hidden bg-gray-100 mb-3 -mx-5 -mt-5">
                  <img [src]="store.imageUrl" [alt]="store.name" class="w-full h-full object-cover">
                </div>
              }
              <h3 class="font-heading text-sm text-primary-900">{{ store.name }}</h3>
              <p class="text-xs text-gray-500 mt-1">{{ store.address }}</p>
              <p class="text-xs text-gray-400">{{ store.city }}, {{ store.state }}</p>
              @if (store.phone) {
                <p class="text-xs mt-2"><a [href]="'tel:' + store.phone" class="text-primary-900 font-semibold hover:text-gold-600">📞 {{ store.phone }}</a></p>
              }
              @if (store.openingHours) {
                <p class="text-[10px] text-gray-400 mt-1">🕐 {{ store.openingHours }}</p>
              }
              <div class="mt-3 flex gap-2">
                <a [href]="'https://maps.google.com/?q=' + store.latitude + ',' + store.longitude" target="_blank" class="btn-primary text-[10px] py-1.5 px-3">GET DIRECTIONS</a>
                <a [href]="'tel:' + store.phone" class="btn-outline text-[10px] py-1.5 px-3">CALL STORE</a>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class StoreLocatorComponent implements OnInit {
  allStores = signal<StoreLocation[]>([]);
  filteredStores = signal<StoreLocation[]>([]);
  states = signal<string[]>([]);
  cities = signal<string[]>([]);
  selectedState = '';
  selectedCity = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getStores().subscribe(stores => {
      this.allStores.set(stores);
      this.filteredStores.set(stores);
      this.states.set([...new Set(stores.map(s => s.state))].sort());
    });
  }

  onStateChange(): void {
    if (this.selectedState) {
      const stateCities = this.allStores().filter(s => s.state === this.selectedState).map(s => s.city);
      this.cities.set([...new Set(stateCities)].sort());
    } else {
      this.cities.set([]);
    }
    this.selectedCity = '';
    this.filterStores();
  }

  filterStores(): void {
    let result = this.allStores();
    if (this.selectedState) result = result.filter(s => s.state === this.selectedState);
    if (this.selectedCity) result = result.filter(s => s.city === this.selectedCity);
    this.filteredStores.set(result);
  }

  clearFilters(): void {
    this.selectedState = '';
    this.selectedCity = '';
    this.filteredStores.set(this.allStores());
  }
}
