import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-digi-gold',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Hero Banner -->
    <section class="relative bg-gradient-to-r from-primary-900 via-primary-800 to-yellow-700 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <img src="/assets/images/banners/hero-2.avif" alt="" class="w-full h-full object-cover">
      </div>
      <div class="relative max-w-7xl mx-auto px-4 py-20 text-center">
        <div class="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/30 rounded-full px-4 py-1.5 mb-6">
          <span class="text-gold-300 text-xs uppercase tracking-widest">Digital Gold Investment</span>
        </div>
        <h1 class="font-heading text-4xl md:text-5xl text-white mb-4">Buy Digital Gold</h1>
        <p class="text-white/70 text-lg max-w-2xl mx-auto mb-8">
          Invest in 24KT pure gold digitally. Start with as little as ₹1. Safe, secure, and backed by physical gold.
        </p>
        <div class="flex flex-wrap justify-center gap-6 text-center">
          @for (stat of stats; track stat.label) {
            <div class="bg-white/10 backdrop-blur rounded-2xl px-8 py-4 border border-white/20">
              <p class="font-heading text-2xl text-gold-300 font-bold">{{ stat.value }}</p>
              <p class="text-white/70 text-xs mt-1">{{ stat.label }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Live Gold Rate -->
    <section class="bg-gold-500 py-3">
      <div class="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 text-sm">
        <span class="text-primary-900 font-heading font-bold">Today's Live 24KT Gold Rate:</span>
        <span class="font-heading text-primary-900 font-bold text-lg">₹{{ goldRate24() | number }} / gram</span>
        <span class="text-primary-900/70 text-xs">Updated: {{ updateTime }}</span>
      </div>
    </section>

    <!-- Buy Digi Gold Section -->
    <section class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        <!-- Calculator Card -->
        <div class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 class="font-heading text-xl text-gray-800 mb-6">Buy Digi Gold</h2>

          <!-- Toggle: Amount / Weight -->
          <div class="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button (click)="buyMode.set('amount')" class="flex-1 py-2 rounded-lg text-sm font-heading transition-all"
              [ngClass]="buyMode() === 'amount' ? 'bg-primary-900 text-white shadow' : 'text-gray-600'">By Amount (₹)</button>
            <button (click)="buyMode.set('weight')" class="flex-1 py-2 rounded-lg text-sm font-heading transition-all"
              [ngClass]="buyMode() === 'weight' ? 'bg-primary-900 text-white shadow' : 'text-gray-600'">By Weight (gm)</button>
          </div>

          <form [formGroup]="buyForm" (ngSubmit)="initiateBuy()">
            @if (buyMode() === 'amount') {
              <div class="mb-4">
                <label class="block text-sm text-gray-600 mb-2">Enter Amount (₹)</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-heading">₹</span>
                  <input formControlName="amount" type="number" min="1"
                    class="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold-400 text-lg font-heading"
                    placeholder="100">
                </div>
                @if (buyForm.value.amount > 0) {
                  <p class="text-xs text-gray-500 mt-2">You get ≈ <strong class="text-gold-700">{{ (buyForm.value.amount / goldRate24()).toFixed(4) }} gm</strong> of 24KT gold</p>
                }
              </div>
            } @else {
              <div class="mb-4">
                <label class="block text-sm text-gray-600 mb-2">Enter Weight (grams)</label>
                <div class="relative">
                  <input formControlName="weight" type="number" min="0.001" step="0.001"
                    class="w-full px-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold-400 text-lg font-heading"
                    placeholder="0.1">
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">gm</span>
                </div>
                @if (buyForm.value.weight > 0) {
                  <p class="text-xs text-gray-500 mt-2">You pay ≈ <strong class="text-gold-700">₹{{ (buyForm.value.weight * goldRate24()) | number: '1.0-0' }}</strong></p>
                }
              </div>
            }

            <!-- Quick Amount Presets -->
            <div class="flex flex-wrap gap-2 mb-6">
              @for (preset of amountPresets; track preset) {
                <button type="button" (click)="setPreset(preset)"
                  class="px-3 py-1.5 text-xs border border-gray-200 rounded-full hover:border-gold-400 hover:bg-gold-50 transition-all font-heading">
                  ₹{{ preset | number }}
                </button>
              }
            </div>

            <button type="submit" class="w-full btn-primary py-4 text-sm tracking-widest">BUY NOW</button>
          </form>

          <p class="text-center text-xs text-gray-400 mt-4">
            24KT Pure Gold | Audited by MMTC-PAMP | Stored in secure vaults
          </p>
        </div>

        <!-- Features -->
        <div>
          <h2 class="font-heading text-xl text-gray-800 mb-6">Why Digi Gold?</h2>
          <div class="space-y-4">
            @for (feature of features; track feature.title) {
              <div class="flex gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-50 hover:border-gold-200 transition-all">
                <div class="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span class="text-2xl">{{ feature.icon }}</span>
                </div>
                <div>
                  <h3 class="font-heading text-sm text-gray-800 mb-1">{{ feature.title }}</h3>
                  <p class="text-xs text-gray-500 leading-relaxed">{{ feature.desc }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="bg-trust py-12">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="section-title text-center">How It Works</h2>
        <div class="gold-divider mx-auto mb-10"></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (step of steps; track step.num) {
            <div class="text-center">
              <div class="w-16 h-16 bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white font-heading font-bold">{{ step.num }}</div>
              <h3 class="font-heading text-sm text-gray-800 mb-2">{{ step.title }}</h3>
              <p class="text-xs text-gray-500 leading-relaxed">{{ step.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="max-w-7xl mx-auto px-4 py-12">
      <h2 class="section-title text-center mb-8">Frequently Asked Questions</h2>
      <div class="max-w-3xl mx-auto space-y-3">
        @for (faq of faqs; track faq.q; let i = $index) {
          <div class="border border-gray-200 rounded-xl overflow-hidden">
            <button (click)="toggleFaq(i)"
              class="w-full flex justify-between items-center p-4 text-left hover:bg-trust transition-colors">
              <span class="font-heading text-sm text-gray-700">{{ faq.q }}</span>
              <span class="text-gray-400 transition-transform" [ngClass]="openFaq() === i ? 'rotate-180' : ''">▼</span>
            </button>
            @if (openFaq() === i) {
              <div class="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">{{ faq.a }}</div>
            }
          </div>
        }
      </div>
    </section>
  `
})
export class DigiGoldComponent implements OnInit {
  buyMode = signal<'amount' | 'weight'>('amount');
  goldRate24 = signal(7200);
  openFaq = signal<number | null>(null);
  updateTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  buyForm: FormGroup;

  stats = [
    { value: '24KT', label: 'Pure Gold' },
    { value: '₹1', label: 'Min. Investment' },
    { value: '100%', label: 'Secure & Audited' },
    { value: '24/7', label: 'Buy & Sell' },
  ];

  amountPresets = [100, 500, 1000, 5000, 10000];

  features = [
    { icon: '🏦', title: '100% Pure 24KT Gold', desc: 'Backed by physical gold stored in secured, insured vaults by MMTC-PAMP India.' },
    { icon: '💳', title: 'Start with ₹1', desc: 'No minimum investment. Buy any amount of gold digitally at live market prices.' },
    { icon: '🔒', title: 'Fully Secured', desc: 'Your digital gold is stored in insured vaults with multi-layer security protocols.' },
    { icon: '🏪', title: 'Convert to Jewellery', desc: 'Redeem your Digi Gold at any Girlyf store to get beautiful jewellery of your choice.' },
    { icon: '💰', title: 'Zero Making Charges', desc: 'Buy and sell at real-time gold rates with no hidden charges or commissions.' },
    { icon: '📊', title: 'Track Investments', desc: 'View your gold portfolio, transaction history, and real-time value in your account.' },
  ];

  steps = [
    { num: '1', title: 'Register/Login', desc: 'Create your Girlyf account or sign in to your existing account.' },
    { num: '2', title: 'Enter Amount', desc: 'Choose how much gold you want to buy — by amount (₹) or by weight (gm).' },
    { num: '3', title: 'Verify & Pay', desc: 'Complete OTP verification and make secure payment via UPI/Card/Net Banking.' },
    { num: '4', title: 'Gold Allocated', desc: 'Digital gold is instantly credited to your wallet. Track value in real-time.' },
  ];

  faqs = [
    { q: 'What is Digi Gold?', a: 'Digi Gold is a digital gold investment product that allows you to buy 24KT pure gold online in small quantities, starting from as little as ₹1.' },
    { q: 'Is my investment safe?', a: 'Yes, 100%. Your gold is stored in secured, insured vaults maintained by MMTC-PAMP India. It is regularly audited by independent third-party auditors.' },
    { q: 'How can I sell my Digi Gold?', a: 'You can sell your Digi Gold anytime at current market rates from your Digi Wallet. The amount will be credited to your registered bank account within 24 hours.' },
    { q: 'Can I convert Digi Gold to physical jewellery?', a: 'Yes! Visit any Girlyf store with your Digi Gold wallet details to convert your digital gold holdings into beautiful jewellery.' },
    { q: 'What are the charges for buying Digi Gold?', a: 'Digi Gold is bought and sold at live market prices with no hidden charges. GST of 3% is applicable on purchases as per government regulations.' },
  ];

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.buyForm = this.fb.group({
      amount: [1000, [Validators.min(1)]],
      weight: [0.1, [Validators.min(0.001)]],
    });
  }

  ngOnInit() {
    this.api.getGoldRates().subscribe((rates: any[]) => {
      const rate24 = rates.find((r: any) => r.karat === '24KT' || r.karat === 24);
      if (rate24) this.goldRate24.set(rate24.ratePerGram || rate24.rate);
    });
  }

  setPreset(amount: number) {
    this.buyMode.set('amount');
    this.buyForm.patchValue({ amount });
  }

  toggleFaq(i: number) { this.openFaq.set(this.openFaq() === i ? null : i); }

  initiateBuy() { alert('OTP verification flow will proceed here.'); }
}
