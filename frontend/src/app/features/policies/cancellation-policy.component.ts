import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cancellation-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-primary-900 py-10 text-center">
        <h1 class="font-heading text-3xl text-white">Cancellation Policy</h1>
        <p class="text-white/50 text-sm mt-2">Last updated: March 2026</p>
      </div>
      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8">
          @for (section of sections; track section.heading) {
            <div>
              <h2 class="font-heading text-lg text-primary-900 mb-3 pb-2 border-b border-gold-200">{{ section.heading }}</h2>
              <div class="text-sm text-gray-600 leading-relaxed space-y-2">
                @for (para of section.paragraphs; track para) { <p>{{ para }}</p> }
              </div>
            </div>
          }
          <!-- Refund Timeline -->
          <div>
            <h2 class="font-heading text-lg text-primary-900 mb-4 pb-2 border-b border-gold-200">Refund Timeline</h2>
            <div class="space-y-3">
              @for (item of refundTimeline; track item.method) {
                <div class="flex items-center gap-4 p-3 bg-trust rounded-xl">
                  <span class="text-2xl">{{ item.icon }}</span>
                  <div>
                    <p class="font-heading text-sm text-gray-700">{{ item.method }}</p>
                    <p class="text-xs text-gray-500">{{ item.time }}</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CancellationPolicyComponent {
  sections = [
    {
      heading: 'Order Cancellation by Customer',
      paragraphs: [
        'You can cancel your order within 24 hours of placing it, provided the order has not been dispatched.',
        'To cancel, go to "My Orders" in your account dashboard and click "Cancel Order", or contact our support team immediately.',
        'Custom/personalised orders cannot be cancelled once production has begun.',
      ]
    },
    {
      heading: 'Orders That Cannot Be Cancelled',
      paragraphs: [
        'Orders that have already been dispatched cannot be cancelled. In such cases, you may initiate a return after delivery.',
        'Custom jewellery orders and made-to-order items are non-cancellable once confirmed.',
        'Gold coin orders are non-cancellable once payment is confirmed due to live gold rate pricing.',
      ]
    },
    {
      heading: 'Cancellation by Girlyf',
      paragraphs: [
        'Girlyf reserves the right to cancel any order due to: product unavailability, pricing errors, suspected fraudulent activity, or inability to deliver to your location.',
        'In case of cancellation by Girlyf, a full refund will be initiated immediately to the original payment source.',
      ]
    },
    {
      heading: 'Refund Process',
      paragraphs: [
        'Approved refunds are processed within 2-3 business days of cancellation confirmation.',
        'The refund amount will be credited to your original payment method. Digi Gold wallet deductions are refunded to the wallet.',
        'Gift card payments are refunded as store credit to the original gift card.',
      ]
    },
  ];

  refundTimeline = [
    { icon: '💳', method: 'Credit/Debit Card', time: '5-7 business days' },
    { icon: '🏦', method: 'Net Banking', time: '3-5 business days' },
    { icon: '📱', method: 'UPI / PhonePe', time: '2-3 business days' },
    { icon: '💰', method: 'Digi Gold Wallet', time: 'Instant' },
  ];
}
