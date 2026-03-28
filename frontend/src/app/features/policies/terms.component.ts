import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-primary-900 py-10 text-center">
        <h1 class="font-heading text-3xl text-white">Terms &amp; Conditions</h1>
        <p class="text-white/50 text-sm mt-2">Last updated: March 2026</p>
      </div>
      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8">
          @for (section of sections; track section.heading) {
            <div>
              <h2 class="font-heading text-lg text-primary-900 mb-3 pb-2 border-b border-gold-200">{{ section.heading }}</h2>
              <p class="text-sm text-gray-600 leading-relaxed">{{ section.content }}</p>
            </div>
          }
          <div class="pt-6 border-t border-gray-100 text-xs text-gray-400">
            For queries: <a href="mailto:support@girlyf.com" class="text-gold-600 hover:underline">support&#64;girlyf.com</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TermsComponent {
  sections = [
    { heading: '1. Acceptance of Terms', content: 'By accessing and using the Girlyf website and services, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.' },
    { heading: '2. Use of the Website', content: 'You may use this website only for lawful purposes and in accordance with these Terms. You agree not to use this website in any way that violates applicable local, national, or international law or regulation.' },
    { heading: '3. Product Information', content: 'We make every effort to display the colours and images of our products as accurately as possible. All jewellery products are subject to availability. Descriptions of products are subject to change without notice.' },
    { heading: '4. Pricing & Payment', content: 'All prices are in Indian Rupees (INR) and are inclusive of applicable taxes. Gold jewellery prices are dynamic and calculated based on live gold rates at the time of purchase. We reserve the right to change prices at any time.' },
    { heading: '5. Order Processing', content: 'Orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order at any time. If an order is cancelled after payment, a full refund will be initiated within 5-7 business days.' },
    { heading: '6. Intellectual Property', content: 'All content on this website including text, graphics, logos, images, and software is the property of Girlyf and is protected by applicable intellectual property laws. Reproduction is strictly prohibited.' },
    { heading: '7. Limitation of Liability', content: 'Girlyf shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website or products purchased through it.' },
    { heading: '8. Governing Law', content: 'These terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Kerala, India.' },
  ];
}
