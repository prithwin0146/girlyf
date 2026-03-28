import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '@core/services/cart.service';
import { AuthService } from '@core/services/auth.service';
import { ApiService } from '@core/services/api.service';
import { Address } from '@core/models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="bg-brown-200 min-h-screen">
      <!-- Header -->
      <div class="bg-primary-900 text-white py-4">
        <div class="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <a routerLink="/" class="text-lg font-heading font-bold tracking-wider">GIRLYF</a>
          <div class="flex items-center gap-4 text-xs">
            <span class="flex items-center gap-1 text-gold-400"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Secure Checkout</span>
            <span class="text-white/50">|</span>
            <span>{{ cart.itemCount() }} item(s)</span>
          </div>
        </div>
      </div>

      <!-- Step Indicator -->
      <div class="bg-white border-b border-gray-200 py-4">
        <div class="max-w-6xl mx-auto px-4">
          <div class="flex items-center justify-center">
            @for (step of steps; track step.id; let i = $index) {
              @if (i > 0) {
                <div class="step-line w-12 md:w-20" [class.completed]="currentStep() > i" [class.pending]="currentStep() <= i"></div>
              }
              <div class="flex flex-col items-center gap-1">
                <div class="step-dot" [class.completed]="currentStep() > step.id" [class.active]="currentStep() === step.id" [class.pending]="currentStep() < step.id">
                  @if (currentStep() > step.id) { ✓ } @else { {{ step.id }} }
                </div>
                <span class="text-[9px] uppercase font-semibold tracking-wider hidden md:block"
                  [class.text-primary-900]="currentStep() === step.id"
                  [class.text-green-600]="currentStep() > step.id"
                  [class.text-gray-400]="currentStep() < step.id">{{ step.label }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- ═══════ MAIN COLUMN ═══════ -->
          <div class="lg:col-span-2 space-y-4">
            <!-- STEP 1: Personal Details -->
            <div class="bg-white rounded shadow-sm overflow-hidden">
              <div class="accordion-header" [class.active]="currentStep() === 1" (click)="goToStep(1)">
                <span class="flex items-center gap-2">
                  @if (currentStep() > 1) { <span class="text-green-500">✓</span> }
                  1. Personal Details
                </span>
                @if (currentStep() > 1) {
                  <span class="text-xs text-green-600 font-normal">{{ personalForm.name }} · {{ personalForm.email }}</span>
                }
              </div>
              @if (currentStep() === 1) {
                <div class="accordion-body space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="text-xs font-semibold text-gray-600 mb-1 block">Full Name *</label>
                      <input [(ngModel)]="personalForm.name" class="input-field" placeholder="Enter full name">
                    </div>
                    <div>
                      <label class="text-xs font-semibold text-gray-600 mb-1 block">Email *</label>
                      <input [(ngModel)]="personalForm.email" type="email" class="input-field" placeholder="email@example.com">
                    </div>
                    <div>
                      <label class="text-xs font-semibold text-gray-600 mb-1 block">Phone *</label>
                      <input [(ngModel)]="personalForm.phone" class="input-field" placeholder="+91 XXXXX XXXXX">
                    </div>
                    <div>
                      <label class="text-xs font-semibold text-gray-600 mb-1 block">Alternate Phone</label>
                      <input [(ngModel)]="personalForm.altPhone" class="input-field" placeholder="Optional">
                    </div>
                  </div>
                  <button (click)="nextStep()" class="btn-primary" [disabled]="!personalForm.name || !personalForm.email || !personalForm.phone">
                    CONTINUE →
                  </button>
                </div>
              }
            </div>

            <!-- STEP 2: Billing Address -->
            <div class="bg-white rounded shadow-sm overflow-hidden">
              <div class="accordion-header" [class.active]="currentStep() === 2" (click)="currentStep() >= 2 && goToStep(2)">
                <span class="flex items-center gap-2">
                  @if (currentStep() > 2) { <span class="text-green-500">✓</span> }
                  2. Billing Address
                </span>
              </div>
              @if (currentStep() === 2) {
                <div class="accordion-body space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                      <label class="text-xs font-semibold text-gray-600 mb-1 block">Address Line 1 *</label>
                      <input [(ngModel)]="billingAddr.line1" class="input-field" placeholder="House/Flat No., Building">
                    </div>
                    <div class="md:col-span-2">
                      <label class="text-xs font-semibold text-gray-600 mb-1 block">Address Line 2</label>
                      <input [(ngModel)]="billingAddr.line2" class="input-field" placeholder="Street, Locality">
                    </div>
                    <div>
                      <label class="text-xs font-semibold text-gray-600 mb-1 block">City *</label>
                      <input [(ngModel)]="billingAddr.city" class="input-field" placeholder="City">
                    </div>
                    <div>
                      <label class="text-xs font-semibold text-gray-600 mb-1 block">State *</label>
                      <select [(ngModel)]="billingAddr.state" class="input-field">
                        <option value="">Select State</option>
                        @for (s of indianStates; track s) { <option [value]="s">{{ s }}</option> }
                      </select>
                    </div>
                    <div>
                      <label class="text-xs font-semibold text-gray-600 mb-1 block">PIN Code *</label>
                      <input [(ngModel)]="billingAddr.pinCode" class="input-field" placeholder="6-digit PIN" maxlength="6">
                    </div>
                  </div>
                  <label class="flex items-center gap-2 text-xs text-gray-600">
                    <input type="checkbox" [(ngModel)]="sameAsShipping" class="accent-primary-900">
                    Shipping address same as billing
                  </label>
                  <button (click)="nextStep()" class="btn-primary" [disabled]="!billingAddr.line1 || !billingAddr.city || !billingAddr.state || !billingAddr.pinCode">
                    CONTINUE →
                  </button>
                </div>
              }
            </div>

            <!-- STEP 3: Shipping Address -->
            <div class="bg-white rounded shadow-sm overflow-hidden">
              <div class="accordion-header" [class.active]="currentStep() === 3" (click)="currentStep() >= 3 && goToStep(3)">
                <span class="flex items-center gap-2">
                  @if (currentStep() > 3) { <span class="text-green-500">✓</span> }
                  3. Shipping Address
                </span>
                @if (sameAsShipping && currentStep() > 3) {
                  <span class="text-[10px] text-gray-400">Same as billing</span>
                }
              </div>
              @if (currentStep() === 3) {
                <div class="accordion-body">
                  @if (sameAsShipping) {
                    <p class="text-sm text-gray-500 mb-4">✓ Using billing address for shipping.</p>
                  } @else {
                    <div class="space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                          <label class="text-xs font-semibold text-gray-600 mb-1 block">Address Line 1 *</label>
                          <input [(ngModel)]="shippingAddr.line1" class="input-field" placeholder="House/Flat No., Building">
                        </div>
                        <div class="md:col-span-2">
                          <label class="text-xs font-semibold text-gray-600 mb-1 block">Address Line 2</label>
                          <input [(ngModel)]="shippingAddr.line2" class="input-field" placeholder="Street, Locality">
                        </div>
                        <div>
                          <label class="text-xs font-semibold text-gray-600 mb-1 block">City *</label>
                          <input [(ngModel)]="shippingAddr.city" class="input-field">
                        </div>
                        <div>
                          <label class="text-xs font-semibold text-gray-600 mb-1 block">State *</label>
                          <select [(ngModel)]="shippingAddr.state" class="input-field">
                            <option value="">Select State</option>
                            @for (s of indianStates; track s) { <option [value]="s">{{ s }}</option> }
                          </select>
                        </div>
                        <div>
                          <label class="text-xs font-semibold text-gray-600 mb-1 block">PIN Code *</label>
                          <input [(ngModel)]="shippingAddr.pinCode" class="input-field" maxlength="6">
                        </div>
                      </div>
                    </div>
                  }
                  <button (click)="nextStep()" class="btn-primary mt-4">CONTINUE →</button>
                </div>
              }
            </div>

            <!-- STEP 4: Review Order -->
            <div class="bg-white rounded shadow-sm overflow-hidden">
              <div class="accordion-header" [class.active]="currentStep() === 4" (click)="currentStep() >= 4 && goToStep(4)">
                <span class="flex items-center gap-2">
                  @if (currentStep() > 4) { <span class="text-green-500">✓</span> }
                  4. Review Order
                </span>
              </div>
              @if (currentStep() === 4) {
                <div class="accordion-body space-y-3">
                  @for (item of cart.items(); track item.productId) {
                    <div class="flex gap-4 border-b border-gray-100 pb-3">
                      <img [src]="item.imageUrl" [alt]="item.productName" class="w-16 h-16 object-cover rounded border border-gray-100">
                      <div class="flex-1">
                        <p class="text-sm font-semibold text-gray-800">{{ item.productName }}</p>
                        <p class="text-[10px] text-gray-400">{{ item.karat }} · {{ item.grossWeight }}g · Qty: {{ item.quantity }}</p>
                        <p class="text-sm font-price font-bold mt-1">₹{{ item.totalPrice | number:'1.0-0' }}</p>
                      </div>
                    </div>
                  }
                  <button (click)="nextStep()" class="btn-primary">CONTINUE TO OFFERS →</button>
                </div>
              }
            </div>

            <!-- STEP 5: Coupons, Gift Voucher, Digi Gold Wallet -->
            <div class="bg-white rounded shadow-sm overflow-hidden">
              <div class="accordion-header" [class.active]="currentStep() === 5" (click)="currentStep() >= 5 && goToStep(5)">
                <span class="flex items-center gap-2">
                  @if (currentStep() > 5) { <span class="text-green-500">✓</span> }
                  5. Offers & Wallet
                </span>
              </div>
              @if (currentStep() === 5) {
                <div class="accordion-body space-y-6">
                  <!-- Special Offers -->
                  <div>
                    <h4 class="text-xs font-heading font-bold text-gray-700 uppercase mb-3">Special Offers</h4>
                    <div class="space-y-2">
                      @for (offer of specialOffers; track offer.code) {
                        <div class="flex items-center justify-between p-3 border border-dashed rounded"
                          [class.border-green-400]="appliedCoupon === offer.code"
                          [class.bg-green-50]="appliedCoupon === offer.code"
                          [class.border-gray-300]="appliedCoupon !== offer.code">
                          <div>
                            <p class="text-xs font-bold text-gray-800">{{ offer.label }}</p>
                            <p class="text-[10px] text-gray-500">Code: <span class="font-mono font-bold text-primary-700">{{ offer.code }}</span></p>
                          </div>
                          <button (click)="applyCoupon(offer.code)"
                            class="text-[10px] font-bold px-3 py-1 rounded"
                            [class.bg-green-500]="appliedCoupon === offer.code"
                            [class.text-white]="appliedCoupon === offer.code"
                            [class.text-primary-700]="appliedCoupon !== offer.code"
                            [class.border]="appliedCoupon !== offer.code"
                            [class.border-primary-700]="appliedCoupon !== offer.code">
                            {{ appliedCoupon === offer.code ? '✓ APPLIED' : 'APPLY' }}
                          </button>
                        </div>
                      }
                    </div>
                  </div>

                  <!-- Coupon Code -->
                  <div>
                    <h4 class="text-xs font-heading font-bold text-gray-700 uppercase mb-3">Have a Coupon Code?</h4>
                    <div class="flex gap-2">
                      <input [(ngModel)]="couponCode" placeholder="Enter coupon code" class="input-field flex-1 text-sm uppercase" style="letter-spacing:0.1em">
                      <button (click)="applyCoupon(couponCode)" class="btn-primary text-xs px-6">APPLY</button>
                    </div>
                    @if (couponMessage()) {
                      <p class="text-xs mt-1" [class.text-green-600]="couponDiscount() > 0" [class.text-red-500]="couponDiscount() === 0">{{ couponMessage() }}</p>
                    }
                  </div>

                  <!-- Gift Voucher (JA-specific: Card Number + PIN) -->
                  <div>
                    <h4 class="text-xs font-heading font-bold text-gray-700 uppercase mb-3">Gift Voucher</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input [(ngModel)]="giftVoucher.cardNumber" placeholder="Card Number (16 digits)" class="input-field text-sm md:col-span-2" maxlength="19">
                      <input [(ngModel)]="giftVoucher.pin" placeholder="PIN" class="input-field text-sm" maxlength="6" type="password">
                    </div>
                    <button (click)="applyGiftVoucher()" class="text-xs text-primary-700 font-bold mt-2 hover:underline" [disabled]="!giftVoucher.cardNumber || !giftVoucher.pin">
                      REDEEM GIFT VOUCHER
                    </button>
                    @if (giftVoucherMessage()) {
                      <p class="text-xs mt-1" [class.text-green-600]="giftVoucherAmount() > 0" [class.text-red-500]="giftVoucherAmount() === 0">{{ giftVoucherMessage() }}</p>
                    }
                  </div>

                  <!-- Digi Gold Wallet (JA-specific: OTP verified) -->
                  <div>
                    <h4 class="text-xs font-heading font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                      Digi Gold Wallet
                      <span class="px-2 py-0.5 bg-gold-100 text-gold-700 text-[9px] rounded font-accent">NEW</span>
                    </h4>
                    <div class="bg-gold-50 p-4 rounded border border-gold-200">
                      <div class="flex items-center justify-between mb-3">
                        <div>
                          <p class="text-xs text-gray-600">Available Balance</p>
                          <p class="font-price font-bold text-lg text-primary-900">₹{{ digiGoldBalance | number:'1.0-0' }}</p>
                        </div>
                        <label class="flex items-center gap-2 text-xs">
                          <input type="checkbox" [(ngModel)]="useDigiGold" class="accent-gold-500" [disabled]="digiGoldBalance === 0">
                          Use Digi Gold
                        </label>
                      </div>
                      @if (useDigiGold && !digiGoldVerified) {
                        <div class="space-y-2">
                          <p class="text-[10px] text-gray-500">Enter OTP sent to your registered mobile</p>
                          <div class="flex gap-2">
                            @for (i of [0,1,2,3,4,5]; track i) {
                              <input maxlength="1" class="otp-input" [(ngModel)]="digiGoldOtp[i]"
                                (input)="onOtpInput($event, i)" (keydown)="onOtpKeydown($event, i)">
                            }
                          </div>
                          <button (click)="verifyDigiGoldOtp()" class="text-xs text-primary-700 font-bold hover:underline">VERIFY OTP</button>
                        </div>
                      }
                      @if (digiGoldVerified) {
                        <p class="text-xs text-green-600 font-semibold">✓ Digi Gold wallet verified. ₹{{ digiGoldRedeemAmount | number:'1.0-0' }} will be deducted.</p>
                      }
                    </div>
                  </div>

                  <button (click)="nextStep()" class="btn-primary">CONTINUE TO PAYMENT →</button>
                </div>
              }
            </div>

            <!-- STEP 6: Payment -->
            <div class="bg-white rounded shadow-sm overflow-hidden">
              <div class="accordion-header" [class.active]="currentStep() === 6" (click)="currentStep() >= 6 && goToStep(6)">
                <span class="flex items-center gap-2">6. Payment</span>
              </div>
              @if (currentStep() === 6) {
                <div class="accordion-body space-y-4">
                  <!-- Payment Methods -->
                  <div class="space-y-2">
                    @for (pm of paymentMethods; track pm.id) {
                      <div class="border rounded p-4 cursor-pointer transition-all"
                        [class.border-primary-900]="selectedPayment === pm.id"
                        [class.bg-primary-50]="selectedPayment === pm.id"
                        [class.border-gray-200]="selectedPayment !== pm.id"
                        (click)="selectedPayment = pm.id">
                        <div class="flex items-center gap-3">
                          <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                            [class.border-primary-900]="selectedPayment === pm.id"
                            [class.border-gray-300]="selectedPayment !== pm.id">
                            @if (selectedPayment === pm.id) {
                              <div class="w-2.5 h-2.5 rounded-full bg-primary-900"></div>
                            }
                          </div>
                          <span class="text-lg">{{ pm.icon }}</span>
                          <div>
                            <p class="text-sm font-semibold text-gray-800">{{ pm.label }}</p>
                            <p class="text-[10px] text-gray-400">{{ pm.desc }}</p>
                          </div>
                        </div>

                        <!-- CCAvenue sub-options -->
                        @if (selectedPayment === 'ccavenue' && pm.id === 'ccavenue') {
                          <div class="mt-3 ml-8 space-y-2">
                            @for (sub of ccavenueSubOptions; track sub.id) {
                              <label class="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                                <input type="radio" name="ccavenue_sub" [value]="sub.id" [(ngModel)]="ccavenueSubOption" class="accent-primary-900">
                                {{ sub.label }}
                              </label>
                            }
                            @if (ccavenueSubOption === 'card') {
                              <div class="mt-2 grid grid-cols-2 gap-2 pl-5">
                                <input placeholder="Card Number" class="input-field text-xs col-span-2" maxlength="19">
                                <input placeholder="MM/YY" class="input-field text-xs" maxlength="5">
                                <input placeholder="CVV" class="input-field text-xs" maxlength="3" type="password">
                                <input placeholder="Name on Card" class="input-field text-xs col-span-2">
                              </div>
                            }
                            @if (ccavenueSubOption === 'netbanking') {
                              <div class="mt-2 pl-5">
                                <select class="input-field text-xs">
                                  <option value="">Select Bank</option>
                                  <option>State Bank of India</option>
                                  <option>HDFC Bank</option>
                                  <option>ICICI Bank</option>
                                  <option>Axis Bank</option>
                                  <option>Kotak Mahindra Bank</option>
                                  <option>Punjab National Bank</option>
                                  <option>Bank of Baroda</option>
                                  <option>Yes Bank</option>
                                </select>
                              </div>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>

                  <!-- CAPTCHA (JA-specific: math captcha at confirm) -->
                  <div class="bg-gray-50 p-4 rounded">
                    <p class="text-xs font-heading font-bold text-gray-700 uppercase mb-2">Verify you're human</p>
                    <div class="flex items-center gap-3">
                      <span class="text-lg font-bold font-price bg-white px-4 py-2 rounded border border-gray-200 select-none">
                        {{ captchaA }} + {{ captchaB }} = ?
                      </span>
                      <input [(ngModel)]="captchaAnswer" type="number" class="input-field w-20 text-center text-lg font-price" placeholder="?">
                      <button (click)="refreshCaptcha()" class="text-gray-400 hover:text-primary-900 transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                      </button>
                    </div>
                    @if (captchaError) {
                      <p class="text-xs text-red-500 mt-1">Incorrect answer. Please try again.</p>
                    }
                  </div>

                  <!-- Place Order -->
                  <button (click)="placeOrder()" class="btn-primary w-full py-4 text-base"
                    [disabled]="!selectedPayment || isPlacing()">
                    @if (isPlacing()) {
                      <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Processing...
                    } @else {
                      CONFIRM ORDER · ₹{{ finalTotal() | number:'1.0-0' }}
                    }
                  </button>

                  <p class="text-[10px] text-gray-400 text-center">
                    By placing this order, you agree to our
                    <a routerLink="/terms-and-conditions" class="text-primary-700 hover:underline">Terms & Conditions</a> and
                    <a routerLink="/privacy-policy" class="text-primary-700 hover:underline">Privacy Policy</a>.
                  </p>
                </div>
              }
            </div>
          </div>

          <!-- ═══════ ORDER SUMMARY SIDEBAR ═══════ -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded shadow-sm p-5 sticky top-4 space-y-4">
              <h3 class="text-sm font-heading font-bold text-gray-800 uppercase tracking-wider">Order Summary</h3>

              <!-- Items preview -->
              <div class="space-y-3 max-h-48 overflow-y-auto">
                @for (item of cart.items(); track item.productId) {
                  <div class="flex gap-3">
                    <img [src]="item.imageUrl" [alt]="item.productName" class="w-12 h-12 object-cover rounded border border-gray-100">
                    <div class="flex-1 min-w-0">
                      <p class="text-xs text-gray-800 font-semibold line-clamp-1">{{ item.productName }}</p>
                      <p class="text-[10px] text-gray-400">Qty: {{ item.quantity }}</p>
                      <p class="text-xs font-price font-bold">₹{{ item.totalPrice | number:'1.0-0' }}</p>
                    </div>
                  </div>
                }
              </div>

              <div class="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span class="font-price">₹{{ cart.subTotal() | number:'1.0-0' }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>GST (3%)</span>
                  <span class="font-price">₹{{ cart.tax() | number:'1.0-0' }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span class="font-price">{{ cart.shipping() === 0 ? 'FREE' : '₹' + cart.shipping() }}</span>
                </div>

                @if (couponDiscount() > 0) {
                  <div class="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span class="font-price">-₹{{ couponDiscount() | number:'1.0-0' }}</span>
                  </div>
                }

                @if (giftVoucherAmount() > 0) {
                  <div class="flex justify-between text-green-600">
                    <span>Gift Voucher</span>
                    <span class="font-price">-₹{{ giftVoucherAmount() | number:'1.0-0' }}</span>
                  </div>
                }

                @if (digiGoldVerified && digiGoldRedeemAmount > 0) {
                  <div class="flex justify-between text-gold-600">
                    <span>Digi Gold Wallet</span>
                    <span class="font-price">-₹{{ digiGoldRedeemAmount | number:'1.0-0' }}</span>
                  </div>
                }
              </div>

              <div class="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span class="font-heading font-bold text-gray-800">Total</span>
                <span class="price-display text-xl">₹{{ finalTotal() | number:'1.0-0' }}</span>
              </div>

              <!-- Trust badges -->
              <div class="border-t border-gray-100 pt-3 grid grid-cols-2 gap-2">
                <div class="flex items-center gap-1.5 text-[10px] text-gray-500"><span>🔒</span> SSL Encrypted</div>
                <div class="flex items-center gap-1.5 text-[10px] text-gray-500"><span>📦</span> Insured Shipping</div>
                <div class="flex items-center gap-1.5 text-[10px] text-gray-500"><span>✅</span> BIS Hallmarked</div>
                <div class="flex items-center gap-1.5 text-[10px] text-gray-500"><span>🔄</span> 15-Day Returns</div>
              </div>

              <!-- Payment icons -->
              <div class="flex items-center justify-center gap-3 flex-wrap pt-2">
                @for (pi of ['Visa','MC','RuPay','UPI','PhonePe']; track pi) {
                  <span class="text-[9px] text-gray-400 bg-gray-50 px-2 py-1 rounded font-semibold">{{ pi }}</span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CheckoutComponent implements OnInit {
  // Step management
  currentStep = signal(1);
  steps = [
    { id: 1, label: 'Personal' },
    { id: 2, label: 'Billing' },
    { id: 3, label: 'Shipping' },
    { id: 4, label: 'Review' },
    { id: 5, label: 'Offers' },
    { id: 6, label: 'Payment' },
  ];

  // Form data
  personalForm = { name: '', email: '', phone: '', altPhone: '' };
  billingAddr = { line1: '', line2: '', city: '', state: '', pinCode: '' };
  shippingAddr = { line1: '', line2: '', city: '', state: '', pinCode: '' };
  sameAsShipping = true;

  // Coupons
  couponCode = '';
  appliedCoupon = '';
  couponMessage = signal('');
  couponDiscount = signal(0);

  // Gift Voucher (JA-specific)
  giftVoucher = { cardNumber: '', pin: '' };
  giftVoucherMessage = signal('');
  giftVoucherAmount = signal(0);

  // Digi Gold Wallet (JA-specific)
  digiGoldBalance = 5000; // Demo balance
  useDigiGold = false;
  digiGoldOtp: string[] = ['', '', '', '', '', ''];
  digiGoldVerified = false;
  digiGoldRedeemAmount = 0;

  // Payment
  selectedPayment = '';
  ccavenueSubOption = '';
  paymentMethods = [
    { id: 'phonepe', icon: '📱', label: 'PhonePe', desc: 'Pay via PhonePe UPI' },
    { id: 'upi', icon: '🏦', label: 'UPI', desc: 'Pay via any UPI app (GPay, Paytm, etc.)' },
    { id: 'ccavenue', icon: '💳', label: 'CCAvenue', desc: 'Credit Card, Debit Card, Net Banking' },
    { id: 'cod', icon: '💰', label: 'Cash on Delivery', desc: 'Pay when your order is delivered (up to ₹2,00,000)' },
  ];
  ccavenueSubOptions = [
    { id: 'card', label: 'Credit / Debit Card' },
    { id: 'netbanking', label: 'Net Banking' },
  ];

  // CAPTCHA
  captchaA = 0;
  captchaB = 0;
  captchaAnswer: number | null = null;
  captchaError = false;

  // Special Offers
  specialOffers = [
    { code: 'GIRLYF500', label: 'Get ₹500 off on orders above ₹25,000' },
    { code: 'FIRST10', label: '10% off on your first purchase' },
    { code: 'WEDDING2024', label: 'Flat ₹2,000 off on wedding jewellery' },
  ];

  isPlacing = signal(false);

  // Indian states
  indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh', 'J&K', 'Ladakh', 'Puducherry',
  ];

  // Final total
  finalTotal = computed(() => {
    let total = this.cart.total();
    total -= this.couponDiscount();
    total -= this.giftVoucherAmount();
    if (this.digiGoldVerified) total -= this.digiGoldRedeemAmount;
    return Math.max(0, total);
  });

  constructor(
    public cart: CartService,
    private auth: AuthService,
    private api: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.refreshCaptcha();

    // Prefill personal details from auth
    const user = this.auth.user();
    if (user) {
      this.personalForm.name = user.name || '';
      this.personalForm.email = user.email || '';
    }
  }

  goToStep(step: number): void {
    if (step <= this.currentStep()) {
      this.currentStep.set(step);
    }
  }

  nextStep(): void {
    if (this.currentStep() < 6) {
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  applyCoupon(code: string): void {
    if (!code) return;
    if (this.appliedCoupon === code) {
      // Remove coupon
      this.appliedCoupon = '';
      this.couponDiscount.set(0);
      this.couponMessage.set('');
      return;
    }
    this.api.validateCoupon(code, this.cart.subTotal()).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.appliedCoupon = code;
          this.couponDiscount.set(res.discountAmount);
          this.couponMessage.set(`✓ Coupon applied! You save ₹${res.discountAmount}`);
        } else {
          this.couponMessage.set(res.message || 'Invalid coupon code');
          this.couponDiscount.set(0);
        }
      },
      error: () => {
        // Demo fallback: apply ₹500 discount
        this.appliedCoupon = code;
        this.couponDiscount.set(500);
        this.couponMessage.set(`✓ Coupon "${code}" applied! You save ₹500`);
      },
    });
  }

  applyGiftVoucher(): void {
    // Simulate gift voucher validation
    if (this.giftVoucher.cardNumber.length >= 12 && this.giftVoucher.pin.length >= 4) {
      this.giftVoucherAmount.set(2000);
      this.giftVoucherMessage.set('✓ Gift Voucher redeemed! ₹2,000 applied.');
    } else {
      this.giftVoucherAmount.set(0);
      this.giftVoucherMessage.set('Invalid card number or PIN. Please check and try again.');
    }
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    this.digiGoldOtp[index] = input.value;
    if (input.value && index < 5) {
      const nextInput = input.parentElement?.querySelectorAll('input')[index + 1];
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.digiGoldOtp[index] && index > 0) {
      const prevInput = (event.target as HTMLElement).parentElement?.querySelectorAll('input')[index - 1];
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
  }

  verifyDigiGoldOtp(): void {
    const otp = this.digiGoldOtp.join('');
    if (otp.length === 6) {
      // Simulate OTP verification
      this.digiGoldVerified = true;
      this.digiGoldRedeemAmount = Math.min(this.digiGoldBalance, this.cart.total());
    }
  }

  refreshCaptcha(): void {
    this.captchaA = Math.floor(Math.random() * 20) + 1;
    this.captchaB = Math.floor(Math.random() * 20) + 1;
    this.captchaAnswer = null;
    this.captchaError = false;
  }

  placeOrder(): void {
    // Validate CAPTCHA
    if (this.captchaAnswer !== this.captchaA + this.captchaB) {
      this.captchaError = true;
      return;
    }
    this.captchaError = false;

    if (!this.selectedPayment) return;
    this.isPlacing.set(true);

    // Simulate order placement
    setTimeout(() => {
      this.isPlacing.set(false);
      this.cart.clearCart();
      this.router.navigate(['/order-success'], {
        queryParams: {
          amount: this.finalTotal(),
          method: this.selectedPayment,
        },
      });
    }, 2500);
  }
}
