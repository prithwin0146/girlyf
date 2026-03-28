import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-[70vh] flex items-center justify-center bg-brown-200/30 py-10">
      <div class="w-full max-w-md mx-4">
        <div class="bg-white shadow-xl border border-gray-100">
          <div class="bg-primary-900 p-6 text-center">
            <h1 class="font-heading text-xl text-white tracking-wider">CREATE ACCOUNT</h1>
            <p class="text-white/60 text-xs mt-1">Join the Girlyf family</p>
          </div>

          <!-- STEP INDICATOR (JA: 4-step wizard) -->
          <div class="px-6 pt-6">
            <div class="flex items-center justify-between">
              @for (s of steps; track s.num; let i = $index) {
                <div class="flex items-center" [class.flex-1]="i < steps.length - 1">
                  <div class="flex flex-col items-center">
                    <div class="step-dot" [class.bg-gold-500]="step() >= s.num" [class.text-primary-900]="step() >= s.num"
                      [class.bg-gray-200]="step() < s.num" [class.text-gray-500]="step() < s.num">
                      @if (step() > s.num) { ✓ } @else { {{ s.num }} }
                    </div>
                    <span class="text-[8px] mt-1 text-gray-400 whitespace-nowrap">{{ s.label }}</span>
                  </div>
                  @if (i < steps.length - 1) {
                    <div class="step-line flex-1 mx-2" [class.bg-gold-500]="step() > s.num" [class.bg-gray-200]="step() <= s.num"></div>
                  }
                </div>
              }
            </div>
          </div>

          <div class="p-6">
            @if (error()) { <p class="text-xs text-red-600 mb-3 text-center">{{ error() }}</p> }

            <!-- STEP 1: Username/Email -->
            @if (step() === 1) {
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Email Address</label>
                  <input type="email" [(ngModel)]="formData.email" class="w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500" placeholder="your&#64;email.com">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Mobile Number</label>
                  <div class="flex">
                    <span class="px-3 py-2.5 bg-gray-50 border border-r-0 border-gray-200 text-sm text-gray-500">+91</span>
                    <input type="tel" [(ngModel)]="formData.phone" maxlength="10" class="flex-1 px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500" placeholder="10-digit mobile">
                  </div>
                </div>
                <button (click)="nextStep()" class="w-full btn-primary py-3 text-sm">CONTINUE</button>
              </div>
            }

            <!-- STEP 2: OTP Verification -->
            @if (step() === 2) {
              <div class="text-center space-y-4">
                <p class="text-sm text-gray-600">We sent a verification code to <strong>{{ formData.email }}</strong></p>
                <div class="flex justify-center gap-3">
                  @for (i of [0,1,2,3,4,5]; track i) {
                    <input type="text" maxlength="1" class="otp-input" [(ngModel)]="otpDigits[i]"
                      (input)="onOtpInput($event, i)" (keydown)="onOtpKeydown($event, i)">
                  }
                </div>
                @if (otpTimer() > 0) {
                  <p class="text-xs text-gray-400">Resend in {{ Math.floor(otpTimer() / 60) }}:{{ (otpTimer() % 60).toString().padStart(2, '0') }}</p>
                } @else {
                  <button (click)="resendOtp()" class="text-xs text-primary-900 font-bold">RESEND CODE</button>
                }
                <button (click)="nextStep()" class="w-full btn-primary py-3 text-sm">VERIFY</button>
                <button (click)="step.set(1)" class="text-xs text-gray-500 hover:text-primary-900">← Back</button>
              </div>
            }

            <!-- STEP 3: Password -->
            @if (step() === 3) {
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Create Password</label>
                  <input type="password" [(ngModel)]="formData.password" class="w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500" placeholder="Min 8 characters">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Confirm Password</label>
                  <input type="password" [(ngModel)]="confirmPassword" class="w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500" placeholder="Re-enter password">
                </div>
                <div class="text-[10px] text-gray-400 space-y-1">
                  <p [class.text-green-600]="formData.password.length >= 8">✓ At least 8 characters</p>
                  <p [class.text-green-600]="hasUpperCase()">✓ One uppercase letter</p>
                  <p [class.text-green-600]="hasNumber()">✓ One number</p>
                </div>
                <button (click)="nextStep()" class="w-full btn-primary py-3 text-sm">CONTINUE</button>
                <button (click)="step.set(2)" class="text-xs text-gray-500 hover:text-primary-900 w-full text-center">← Back</button>
              </div>
            }

            <!-- STEP 4: Profile -->
            @if (step() === 4) {
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Full Name</label>
                  <input type="text" [(ngModel)]="formData.name" class="w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500" placeholder="Enter your full name">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Date of Birth (Optional)</label>
                  <input type="date" [(ngModel)]="dob" class="w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Gender (Optional)</label>
                  <div class="flex gap-3">
                    @for (g of ['Male', 'Female', 'Other']; track g) {
                      <label class="flex items-center gap-1.5 text-sm"><input type="radio" [value]="g" [(ngModel)]="gender" name="gender" class="accent-gold-500">{{ g }}</label>
                    }
                  </div>
                </div>
                <label class="flex items-start gap-2 text-[10px] text-gray-500">
                  <input type="checkbox" [(ngModel)]="termsAccepted" class="accent-gold-500 mt-0.5">
                  I agree to the <a href="#" class="text-primary-900 font-bold">Terms & Conditions</a> and <a href="#" class="text-primary-900 font-bold">Privacy Policy</a>
                </label>
                <button (click)="submit()" [disabled]="loading() || !termsAccepted" class="w-full btn-gold py-3 text-sm font-bold">
                  @if (loading()) { <span class="animate-spin inline-block mr-1">⏳</span> } CREATE ACCOUNT
                </button>
                <button (click)="step.set(3)" class="text-xs text-gray-500 hover:text-primary-900 w-full text-center">← Back</button>
              </div>
            }

            <div class="mt-6 text-center">
              <p class="text-xs text-gray-500">Already have an account? <a routerLink="/login" class="text-primary-900 font-bold hover:text-gold-600">Sign In</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  step = signal(1);
  loading = signal(false);
  error = signal('');
  otpTimer = signal(0);
  Math = Math;

  formData = { name: '', email: '', phone: '', password: '' };
  confirmPassword = '';
  otpDigits: string[] = ['', '', '', '', '', ''];
  dob = '';
  gender = '';
  termsAccepted = false;
  private timerInterval: any;

  steps = [
    { num: 1, label: 'Details' },
    { num: 2, label: 'Verify' },
    { num: 3, label: 'Password' },
    { num: 4, label: 'Profile' },
  ];

  constructor(private auth: AuthService, private cart: CartService, private analytics: AnalyticsService, private router: Router) {}

  hasUpperCase(): boolean { return /[A-Z]/.test(this.formData.password); }
  hasNumber(): boolean { return /[0-9]/.test(this.formData.password); }

  nextStep(): void {
    this.error.set('');
    if (this.step() === 1) {
      if (!this.formData.email || !this.formData.phone) { this.error.set('Please fill in all fields'); return; }
      if (this.formData.phone.length !== 10) { this.error.set('Enter a valid 10-digit mobile number'); return; }
      this.step.set(2);
      this.startTimer(180);
    } else if (this.step() === 2) {
      const otp = this.otpDigits.join('');
      if (otp.length !== 6) { this.error.set('Enter complete 6-digit code'); return; }
      this.step.set(3);
    } else if (this.step() === 3) {
      if (this.formData.password.length < 8) { this.error.set('Password must be at least 8 characters'); return; }
      if (this.formData.password !== this.confirmPassword) { this.error.set('Passwords do not match'); return; }
      this.step.set(4);
    }
  }

  resendOtp(): void { this.startTimer(180); }

  submit(): void {
    if (!this.formData.name) { this.error.set('Please enter your name'); return; }
    this.loading.set(true);
    this.auth.register(this.formData).subscribe({
      next: () => {
        this.loading.set(false);
        this.cart.syncOnLogin();
        this.analytics.trackSignUp('email');
        this.router.navigate(['/']);
      },
      error: (err) => { this.loading.set(false); this.error.set(err?.error?.message || 'Registration failed'); }
    });
  }

  private startTimer(seconds: number): void {
    clearInterval(this.timerInterval);
    this.otpTimer.set(seconds);
    this.timerInterval = setInterval(() => {
      if (this.otpTimer() <= 1) { clearInterval(this.timerInterval); this.otpTimer.set(0); }
      else this.otpTimer.set(this.otpTimer() - 1);
    }, 1000);
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value && index < 5) {
      const next = input.parentElement?.querySelectorAll('input')[index + 1] as HTMLInputElement;
      next?.focus();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prev = (event.target as HTMLElement).parentElement?.querySelectorAll('input')[index - 1] as HTMLInputElement;
      prev?.focus();
    }
  }
}
