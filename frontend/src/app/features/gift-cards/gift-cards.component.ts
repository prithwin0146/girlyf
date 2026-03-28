import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gift-cards',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-brown-700">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 20% 50%, #e9bb2c33 0%, transparent 50%), radial-gradient(circle at 80% 20%, #e9bb2c22 0%, transparent 40%)"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 py-16 text-center">
        <p class="text-gold-400 text-xs uppercase tracking-[0.3em] mb-3">Thoughtful Gifting</p>
        <h1 class="font-heading text-4xl md:text-5xl text-white mb-4">Girlyf Gift Cards</h1>
        <p class="text-white/70 max-w-xl mx-auto text-lg">
          The perfect gift for every occasion. Let your loved ones choose their favourite jewellery.
        </p>
      </div>
    </section>

    <!-- Gift Card Denominations -->
    <section class="max-w-7xl mx-auto px-4 py-12">
      <h2 class="section-title text-center">Choose a Denomination</h2>
      <div class="gold-divider mx-auto mb-10"></div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        @for (card of denominations; track card.amount) {
          <div (click)="selectedCard.set(card)" class="cursor-pointer group"
            [ngClass]="selectedCard()?.amount === card.amount ? 'ring-2 ring-primary-900' : ''">
            <div class="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all bg-gradient-to-br from-gold-400 to-yellow-500 p-6 text-center">
              <div class="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">🎁</div>
              <div class="font-heading text-3xl font-bold text-primary-900 mb-2">₹{{ card.amount | number }}</div>
              <div class="text-primary-900/70 text-xs">Gift Card</div>
              @if (card.bonus) {
                <div class="mt-2 bg-primary-900 text-gold-400 text-xs px-2 py-1 rounded-full font-heading">+ ₹{{ card.bonus }} Bonus</div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Buy Form -->
      <div class="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h3 class="font-heading text-lg text-gray-800 mb-6">Send a Gift Card</h3>
        <form [formGroup]="giftForm" (ngSubmit)="buyCard()">
          <div class="mb-4">
            <label class="block text-sm text-gray-600 mb-1">Recipient Name</label>
            <input formControlName="recipientName" type="text"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400"
              placeholder="Enter recipient name">
          </div>
          <div class="mb-4">
            <label class="block text-sm text-gray-600 mb-1">Recipient Email</label>
            <input formControlName="recipientEmail" type="email"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400"
              placeholder="Enter recipient email">
          </div>
          <div class="mb-4">
            <label class="block text-sm text-gray-600 mb-1">Personal Message (optional)</label>
            <textarea formControlName="message" rows="3"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400 resize-none"
              placeholder="Write a heartfelt message..."></textarea>
          </div>
          <div class="mb-6">
            <label class="block text-sm text-gray-600 mb-1">Selected Amount</label>
            <div class="border border-gold-300 bg-gold-50 rounded-xl px-4 py-3 font-heading text-primary-900 font-bold">
              @if (selectedCard()) {
                ₹{{ selectedCard()!.amount | number }}
              } @else {
                Please select a denomination above
              }
            </div>
          </div>
          <button type="submit" [disabled]="!selectedCard()" class="w-full btn-primary py-4 text-sm tracking-widest disabled:opacity-40">
            BUY NOW – PAY ₹{{ selectedCard()?.amount || 0 | number }}
          </button>
        </form>
      </div>
    </section>

    <!-- How to Use -->
    <section class="bg-trust py-12">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="section-title text-center">How to Use a Gift Card</h2>
        <div class="gold-divider mx-auto mb-10"></div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          @for (step of howToUse; track step.num) {
            <div>
              <div class="w-14 h-14 bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4 text-gold-400 font-heading text-xl font-bold">{{ step.num }}</div>
              <h3 class="font-heading text-sm text-gray-800 mb-2">{{ step.title }}</h3>
              <p class="text-xs text-gray-500">{{ step.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Check Balance -->
    <section class="max-w-7xl mx-auto px-4 py-12">
      <div class="max-w-lg mx-auto text-center">
        <h2 class="section-title mb-3">Check Gift Card Balance</h2>
        <p class="text-gray-500 text-sm mb-6">Enter your gift card number and PIN to check the available balance</p>
        <div class="flex gap-3 mb-3">
          <input [(ngModel)]="cardNumber" [ngModelOptions]="{standalone: true}" type="text"
            class="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400"
            placeholder="Gift Card Number">
          <input [(ngModel)]="cardPin" [ngModelOptions]="{standalone: true}" type="text"
            class="w-28 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400"
            placeholder="PIN">
        </div>
        <button (click)="checkBalance()" class="w-full btn-gold py-3 text-sm tracking-widest">CHECK BALANCE</button>
        @if (balanceResult()) {
          <div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-heading">{{ balanceResult() }}</div>
        }
      </div>
    </section>

    <!-- Policy Note -->
    <section class="bg-gray-50 py-8 border-t border-gray-100">
      <div class="max-w-4xl mx-auto px-4 text-xs text-gray-500 text-center leading-relaxed">
        Funds will be deducted from your e-Gift Voucher at the time you place your order. In case of any adjustment or cancellation at a later stage, we will re-issue funds as credit to your voucher. For purchase of more than five gift vouchers, contact us at <a href="mailto:support&#64;girlyf.com" class="text-gold-600 hover:underline">support&#64;girlyf.com</a>.
        <a routerLink="/gift-policy" class="text-primary-900 hover:underline ml-2">Gift Card Policy →</a>
      </div>
    </section>
  `
})
export class GiftCardsComponent {
  selectedCard = signal<{ amount: number; bonus?: number } | null>(null);
  balanceResult = signal('');
  cardNumber = '';
  cardPin = '';
  giftForm: FormGroup;

  denominations = [
    { amount: 500 },
    { amount: 1000, bonus: 50 },
    { amount: 2000, bonus: 100 },
    { amount: 5000, bonus: 300 },
    { amount: 10000, bonus: 700 },
    { amount: 25000, bonus: 2000 },
    { amount: 50000, bonus: 5000 },
    { amount: 100000, bonus: 12000 },
  ];

  howToUse = [
    { num: '1', title: 'Add to Cart', desc: 'Browse our collection and add your favourite jewellery to the shopping bag.' },
    { num: '2', title: 'Apply at Checkout', desc: 'Enter the gift card number and PIN in the Gift Voucher section at checkout.' },
    { num: '3', title: 'Enjoy!', desc: 'The gift card value is instantly deducted from your order total. Happy shopping!' },
  ];

  constructor(private fb: FormBuilder) {
    this.giftForm = this.fb.group({
      recipientName: ['', Validators.required],
      recipientEmail: ['', [Validators.required, Validators.email]],
      message: [''],
    });
  }

  buyCard() {
    if (!this.selectedCard()) return;
    alert(`Proceeding to payment for ₹${this.selectedCard()!.amount} gift card`);
  }

  checkBalance() {
    if (!this.cardNumber || !this.cardPin) { alert('Please enter card number and PIN'); return; }
    this.balanceResult.set(`Gift Card Balance: ₹2,500 | Valid till: 31 Dec 2026`);
  }
}
