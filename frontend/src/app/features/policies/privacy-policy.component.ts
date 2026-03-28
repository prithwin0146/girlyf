import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-primary-900 py-10 text-center">
        <h1 class="font-heading text-3xl text-white">Privacy Policy</h1>
        <p class="text-white/50 text-sm mt-2">Last updated: March 2026</p>
      </div>
      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8">
          <div class="p-4 bg-trust border border-gold-200 rounded-xl text-sm text-gray-700">
            <strong class="font-heading text-primary-900">Your privacy matters to us.</strong>
            This Privacy Policy describes how Girlyf collects, uses, and protects your personal information when you use our website and services.
          </div>
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
        </div>
      </div>
    </div>
  `
})
export class PrivacyPolicyComponent {
  sections = [
    {
      heading: '1. Information We Collect',
      paragraphs: ['We collect the following types of personal information when you use our services:'],
      list: [
        'Personal identification: name, email, phone number, date of birth',
        'Address information: shipping and billing addresses',
        'Payment information: payment method details (we do not store full card numbers)',
        'Order history and browsing behaviour on our website',
        'Device information and IP address for security purposes',
      ]
    },
    {
      heading: '2. How We Use Your Information',
      paragraphs: ['Your information is used exclusively for the following purposes:'],
      list: [
        'Processing and delivering your orders',
        'Sending order confirmations and shipping updates',
        'Providing customer support',
        'Personalising your shopping experience',
        'Sending promotional offers (only with your consent)',
        'Fraud prevention and website security',
      ]
    },
    {
      heading: '3. Data Sharing',
      paragraphs: [
        'We do not sell, trade, or rent your personal information to third parties.',
        'We may share your information with trusted third parties only to the extent necessary for: shipping and delivery services, payment processing, and fraud detection.',
        'All third-party partners are contractually bound to maintain the confidentiality of your information.',
      ]
    },
    {
      heading: '4. Data Security',
      paragraphs: [
        'We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits.',
        'All payment transactions are processed through PCI-DSS compliant payment gateways.',
        'Despite our best efforts, no data transmission over the internet is 100% secure. If you suspect any security breach, contact us immediately.',
      ]
    },
    {
      heading: '5. Cookies',
      paragraphs: [
        'Our website uses cookies to improve your browsing experience, remember your preferences, and analyse website traffic.',
        'You can control cookie settings through your browser. Disabling cookies may affect some website functionality.',
        'We use Google Analytics, which may use cookies to collect anonymous usage data.',
      ]
    },
    {
      heading: '6. Your Rights',
      paragraphs: ['You have the right to:'],
      list: [
        'Access the personal information we hold about you',
        'Request correction of inaccurate information',
        'Request deletion of your personal data',
        'Opt out of marketing communications at any time',
        'Lodge a complaint with the relevant data protection authority',
      ]
    },
    {
      heading: '7. Contact Us',
      paragraphs: [
        'For any privacy-related queries or to exercise your rights, contact our Data Protection Officer at: support@girlyf.com or +91 8606083922.',
      ]
    },
  ];
}
