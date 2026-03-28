import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipping-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-primary-900 py-10 text-center">
        <h1 class="font-heading text-3xl text-white">Shipping Policy</h1>
        <p class="text-white/50 text-sm mt-2">Last updated: March 2026</p>
      </div>
      <div class="max-w-4xl mx-auto px-4 py-12">
        <!-- Quick Summary -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          @for (badge of quickSummary; track badge.title) {
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
                @for (para of section.paragraphs; track para) {
                  <p>{{ para }}</p>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ShippingPolicyComponent {
  quickSummary = [
    { icon: '🚚', title: 'Free Nationwide Shipping', desc: 'On all orders above ₹500' },
    { icon: '📦', title: '5-7 Business Days', desc: 'Standard delivery time' },
    { icon: '🔒', title: 'Insured Delivery', desc: '100% safe & secure' },
  ];

  sections = [
    {
      heading: 'Shipping Coverage',
      paragraphs: [
        'We ship across all major cities and towns in India. We currently do not offer international shipping.',
        'Delivery is available at all pincodes serviceable by our logistics partners — India Post, Blue Dart, and Delhivery.',
        'You can check pincode availability on our FAQ page before placing an order.',
      ]
    },
    {
      heading: 'Shipping Charges',
      paragraphs: [
        'Free shipping is available on all orders. No minimum order value required.',
        'For remote or difficult-to-reach areas, a nominal shipping surcharge may apply. This will be clearly shown at checkout.',
        'All shipments are fully insured against loss or damage during transit at no extra cost to you.',
      ]
    },
    {
      heading: 'Delivery Timeline',
      paragraphs: [
        'Standard Orders: 5-7 business days from the date of order confirmation.',
        'Custom/Personalised Orders: 10-15 business days depending on the complexity of customisation.',
        'Express Delivery: Available for select pincodes at an additional charge. Option shown at checkout if available for your area.',
        'All orders are dispatched within 24-48 hours of payment confirmation (excluding weekends and public holidays).',
      ]
    },
    {
      heading: 'Order Tracking',
      paragraphs: [
        'Once your order is dispatched, you will receive an SMS and email with the tracking number and courier partner details.',
        'You can track your order in real-time using the "Track Order" feature in your account dashboard.',
        'For any delivery-related queries, contact us at support@girlyf.com or +91 8606083922.',
      ]
    },
    {
      heading: 'Packaging',
      paragraphs: [
        'All jewellery is packed in our premium Girlyf gift box with protective padding and anti-tarnish materials.',
        'Each shipment is sealed with tamper-evident packaging to ensure product integrity.',
        'A detailed invoice and product certificate are included with every order.',
      ]
    },
  ];
}
