import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-return-exchange-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-primary-900 py-10 text-center">
        <h1 class="font-heading text-3xl text-white">Return &amp; Exchange Policy</h1>
        <p class="text-white/50 text-sm mt-2">7-Day Return Policy | Last updated: March 2026</p>
      </div>
      <div class="max-w-4xl mx-auto px-4 py-12">
        <!-- Policy Highlight -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          @for (badge of highlights; track badge.title) {
            <div class="bg-white rounded-2xl p-5 shadow-sm text-center border border-gray-100">
              <div class="text-3xl mb-2">{{ badge.icon }}</div>
              <div class="font-heading text-sm text-primary-900">{{ badge.title }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ badge.desc }}</div>
            </div>
          }
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8">
          @for (section of sections; track section.heading) {
            <div>
              <h2 class="font-heading text-lg text-primary-900 mb-3 pb-2 border-b border-gold-200">{{ section.heading }}</h2>
              <div class="text-sm text-gray-600 leading-relaxed space-y-2">
                @for (para of section.paragraphs; track para) { <p>{{ para }}</p> }
                @if (section.list) {
                  <ul class="list-disc pl-5 space-y-1">
                    @for (item of section.list; track item) { <li>{{ item }}</li> }
                  </ul>
                }
              </div>
            </div>
          }

          <!-- How to Initiate Return -->
          <div class="bg-trust rounded-2xl p-6">
            <h3 class="font-heading text-base text-primary-900 mb-4">How to Initiate a Return</h3>
            <div class="space-y-3">
              @for (step of returnSteps; track step.num) {
                <div class="flex items-start gap-3">
                  <div class="w-7 h-7 bg-primary-900 text-gold-400 rounded-full flex items-center justify-center text-xs font-heading font-bold flex-shrink-0 mt-0.5">{{ step.num }}</div>
                  <p class="text-sm text-gray-700">{{ step.text }}</p>
                </div>
              }
            </div>
          </div>

          <div class="pt-4 text-xs text-gray-400">
            Contact: <a href="tel:+918606083922" class="text-gold-600">+91 8606083922</a> |
            <a href="mailto:support@girlyf.com" class="text-gold-600">support&#64;girlyf.com</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReturnExchangePolicyComponent {
  highlights = [
    { icon: '↩️', title: '7-Day Returns', desc: 'From date of delivery' },
    { icon: '🔄', title: 'Easy Exchange', desc: 'At any Girlyf store' },
    { icon: '💰', title: 'Full Refund', desc: 'On eligible returns' },
  ];

  sections = [
    {
      heading: 'Return Eligibility',
      paragraphs: ['You may return your purchase within 7 days of delivery, provided:'],
      list: [
        'The product is unused and in its original condition',
        'Original packaging, tags, and certificates are intact',
        'The product is not a custom/personalised order',
        'The product is not a gold coin or Digi Gold purchase',
        'The product has not been resized or altered after delivery',
      ]
    },
    {
      heading: 'Non-Returnable Items',
      paragraphs: ['The following items cannot be returned or exchanged:'],
      list: [
        'Custom and personalised jewellery pieces',
        'Gold coins and bullion',
        'Items damaged due to misuse or accidental damage after delivery',
        'Products without original packaging or certificates',
        'Earrings (for hygiene reasons, unless defective)',
      ]
    },
    {
      heading: 'Exchange Policy',
      paragraphs: [
        'Exchange is available for a different size, design, or metal colour of the same or higher value, subject to availability.',
        'Exchanges can be done at any Girlyf store or by initiating an exchange request online.',
        'If the exchanged item has a higher value, the difference must be paid. If lower, store credit is issued.',
      ]
    },
    {
      heading: 'Refund Process',
      paragraphs: [
        'Once your returned item is received and inspected (typically 2-3 business days), the refund is processed.',
        'Refunds are credited to the original payment method within 5-7 business days after approval.',
        'Shipping charges, if any, are non-refundable unless the return is due to a product defect.',
      ]
    },
  ];

  returnSteps = [
    { num: '1', text: 'Log in to your account and go to My Orders. Select the order and click "Return/Exchange".' },
    { num: '2', text: 'Select the reason for return and upload photos of the product (required for damaged/defective claims).' },
    { num: '3', text: 'Our team will review your request within 24-48 hours and confirm pickup details.' },
    { num: '4', text: 'A courier will be arranged for free pickup from your address. Package the item securely with all original materials.' },
    { num: '5', text: 'Once received and verified, refund or exchange will be processed within 5-7 business days.' },
  ];
}
