import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="bg-primary-900 py-12">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <p class="text-gold-400 font-accent text-xs uppercase tracking-[0.3em] mb-3">Help Center</p>
        <h1 class="font-heading text-3xl text-white">Frequently Asked Questions</h1>
        <div class="gold-divider mx-auto mt-4"></div>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 py-10">
      <!-- SEARCH -->
      <div class="relative max-w-lg mx-auto mb-8">
        <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="filterFaqs()" placeholder="Search FAQs..." class="w-full px-4 py-3 pl-10 border border-gray-200 text-sm focus:outline-none focus:border-gold-500">
        <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      </div>

      <!-- CATEGORY TABS -->
      <div class="flex flex-wrap gap-2 justify-center mb-8">
        @for (cat of faqCategories; track cat) {
          <button (click)="selectedCategory.set(cat); filterFaqs()" class="filter-chip"
            [class.bg-primary-900]="selectedCategory() === cat" [class.text-white]="selectedCategory() === cat">
            {{ cat }}
          </button>
        }
      </div>

      <!-- FAQ ACCORDION -->
      <div class="space-y-3">
        @for (faq of filteredFaqs(); track faq.q) {
          <div class="border border-gray-100 hover:border-gold-500/20 transition-colors">
            <button (click)="faq.open = !faq.open" class="w-full flex items-center justify-between px-5 py-4 text-left">
              <span class="text-sm font-semibold text-primary-900 pr-4">{{ faq.q }}</span>
              <svg class="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform" [class.rotate-180]="faq.open" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            @if (faq.open) {
              <div class="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">{{ faq.a }}</div>
            }
          </div>
        }
      </div>

      @if (filteredFaqs().length === 0) {
        <div class="text-center py-10">
          <span class="text-4xl">🔍</span>
          <p class="text-sm text-gray-500 mt-3">No FAQs found for "{{ searchQuery }}"</p>
        </div>
      }

      <!-- PINCODE CHECKER -->
      <div class="mt-10 p-6 bg-brown-200/30 border border-brown-500/10">
        <h3 class="font-heading text-sm uppercase tracking-wider text-primary-900 mb-3">Check Delivery Availability</h3>
        <div class="flex gap-2 max-w-sm">
          <input type="text" [(ngModel)]="pincode" maxlength="6" placeholder="Enter pincode" class="flex-1 px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500">
          <button (click)="checkPincode()" class="btn-primary text-xs px-4">CHECK</button>
        </div>
        @if (pincodeResult()) {
          <p class="text-sm mt-2" [class.text-green-600]="pincodeValid()" [class.text-red-600]="!pincodeValid()">{{ pincodeResult() }}</p>
        }
      </div>

      <!-- CONTACT CTA -->
      <div class="mt-10 text-center bg-primary-900 p-8 rounded">
        <h3 class="font-heading text-lg text-white">Still have questions?</h3>
        <p class="text-white/60 text-sm mt-2">Our support team is here to help</p>
        <div class="flex justify-center gap-3 mt-4">
          <a routerLink="/contact" class="btn-gold text-sm">CONTACT US</a>
          <a href="https://wa.me/918001234567" target="_blank" class="bg-green-500 text-white px-4 py-2.5 rounded text-sm font-semibold hover:bg-green-600">💬 WhatsApp</a>
        </div>
      </div>
    </div>
  `,
})
export class FaqComponent {
  searchQuery = '';
  selectedCategory = signal('All');
  filteredFaqs = signal<FaqItem[]>([]);
  pincode = '';
  pincodeResult = signal('');
  pincodeValid = signal(false);

  faqCategories = ['All', 'Orders', 'Payments', 'Shipping', 'Returns', 'Gold Rate', 'Account'];

  faqs: FaqItem[] = [
    { q: 'How do I place an order?', a: 'Browse our collection, add items to your bag, proceed to checkout, fill in your details, and complete payment. You\'ll receive an order confirmation via email and SMS.', category: 'Orders', open: false },
    { q: 'Can I modify or cancel my order?', a: 'You can cancel your order within 1 hour of placing it. After that, the jewellery goes into production and cannot be cancelled. Contact support for modifications.', category: 'Orders', open: false },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards (Visa, Mastercard, Amex), UPI (Google Pay, PhonePe, Paytm), net banking, and Cash on Delivery (up to ₹50,000).', category: 'Payments', open: false },
    { q: 'Is it safe to pay online?', a: 'Absolutely. All payments are processed through secure, PCI-DSS compliant payment gateways (PhonePe/CCAvenue). We never store your card details.', category: 'Payments', open: false },
    { q: 'How long does shipping take?', a: 'Standard delivery takes 5-7 business days. Express delivery (available in select cities) takes 2-3 business days. All shipments are fully insured.', category: 'Shipping', open: false },
    { q: 'Do you offer free shipping?', a: 'Yes! Free insured shipping on all orders above ₹50,000. For orders below that, a nominal fee of ₹150 applies.', category: 'Shipping', open: false },
    { q: 'What is your return policy?', a: 'We offer 30-day easy returns on all products. The item must be in original condition with tags and certificate. Return shipping is free.', category: 'Returns', open: false },
    { q: 'Do you offer lifetime exchange?', a: 'Yes! All gold jewellery comes with lifetime exchange at any Girlyf store. You only pay the making charge difference and any applicable gold rate difference.', category: 'Returns', open: false },
    { q: 'How is the gold rate calculated?', a: 'The gold rate is updated daily based on international bullion rates plus applicable duties. The rate displayed is the rate at which your order will be billed.', category: 'Gold Rate', open: false },
    { q: 'How often is the gold rate updated?', a: 'We update our gold rates twice daily — at 10 AM and 5 PM IST. The rate shown on the website is always the latest applicable rate.', category: 'Gold Rate', open: false },
    { q: 'Is the jewellery BIS Hallmarked?', a: 'Yes, all our gold jewellery is BIS Hallmarked ensuring purity. Each piece comes with a certificate of authenticity and hallmark details.', category: 'Orders', open: false },
    { q: 'How do I create an account?', a: 'Click "Create Account" and follow our 4-step registration process. You\'ll need your email, phone number, and a password.', category: 'Account', open: false },
  ];

  constructor() { this.filteredFaqs.set([...this.faqs]); }

  filterFaqs(): void {
    let result = [...this.faqs];
    if (this.selectedCategory() !== 'All') result = result.filter(f => f.category === this.selectedCategory());
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
    }
    this.filteredFaqs.set(result);
  }

  checkPincode(): void {
    if (this.pincode.length === 6) {
      this.pincodeValid.set(true);
      this.pincodeResult.set('✓ Delivery available! Estimated delivery: 5-7 business days');
    } else {
      this.pincodeValid.set(false);
      this.pincodeResult.set('Please enter a valid 6-digit pincode');
    }
  }
}

interface FaqItem { q: string; a: string; category: string; open: boolean; }
