import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-trust flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-block">
            <div class="text-3xl font-heading font-bold text-primary-900 tracking-wider">GIRLYF</div>
            <div class="text-xs text-brown-700 tracking-[0.2em] uppercase">Jewellery</div>
          </a>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8">
          <!-- Step 1: Enter Username -->
          @if (step() === 1) {
            <div>
              <h1 class="font-heading text-2xl text-gray-800 mb-1">Forgot Password?</h1>
              <p class="text-sm text-gray-500 mb-6">Enter your registered email or mobile number</p>
              <form [formGroup]="usernameForm" (ngSubmit)="sendOtp()">
                <div class="mb-4">
                  <label class="block text-sm text-gray-700 mb-1">Email / Mobile Number</label>
                  <input formControlName="username" type="text"
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-500"
                    placeholder="Enter email or mobile number">
                  @if (usernameForm.get('username')?.invalid && usernameForm.get('username')?.touched) {
                    <p class="text-red-500 text-xs mt-1">Please enter a valid email or mobile number</p>
                  }
                </div>
                <button type="submit" [disabled]="loading()"
                  class="w-full btn-primary py-3 text-sm tracking-widest disabled:opacity-50">
                  @if (loading()) { <span>SENDING...</span> } @else { <span>SEND OTP</span> }
                </button>
              </form>
            </div>
          }

          <!-- Step 2: OTP Verification -->
          @if (step() === 2) {
            <div>
              <h1 class="font-heading text-2xl text-gray-800 mb-1">Verify OTP</h1>
              <p class="text-sm text-gray-500 mb-6">OTP sent to <strong>{{ maskedUsername() }}</strong></p>
              <form [formGroup]="otpForm" (ngSubmit)="verifyOtp()">
                <div class="mb-4">
                  <label class="block text-sm text-gray-700 mb-2">Enter 6-digit OTP</label>
                  <div class="flex gap-2 justify-center">
                    @for (i of [0,1,2,3,4,5]; track i) {
                      <input type="text" maxlength="1" inputmode="numeric"
                        class="otp-input w-12 h-12 text-center text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 font-heading"
                        (input)="onOtpInput($event, i)" (keydown.backspace)="onOtpBackspace($event, i)"
                        [id]="'otp-fp-' + i">
                    }
                  </div>
                </div>
                <!-- Timer -->
                <div class="text-center text-sm mb-4">
                  @if (timer() > 0) {
                    <span class="text-gray-500">Resend OTP in <strong class="text-primary-900">{{ formatTimer() }}</strong></span>
                  } @else {
                    <button type="button" (click)="sendOtp()" class="text-gold-600 hover:underline font-medium">Resend OTP?</button>
                  }
                </div>
                <button type="submit" [disabled]="loading()"
                  class="w-full btn-gold py-3 text-sm tracking-widest disabled:opacity-50">
                  @if (loading()) { <span>VERIFYING...</span> } @else { <span>VERIFY</span> }
                </button>
              </form>
            </div>
          }

          <!-- Step 3: New Password -->
          @if (step() === 3) {
            <div>
              <h1 class="font-heading text-2xl text-gray-800 mb-1">Set New Password</h1>
              <p class="text-sm text-gray-500 mb-6">Create a strong password for your account</p>
              <form [formGroup]="passwordForm" (ngSubmit)="resetPassword()">
                <div class="mb-4 relative">
                  <label class="block text-sm text-gray-700 mb-1">New Password</label>
                  <input formControlName="password" [type]="showPwd() ? 'text' : 'password'"
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:border-gold-500"
                    placeholder="Min. 8 characters">
                  <button type="button" (click)="showPwd.set(!showPwd())"
                    class="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
                    @if (showPwd()) {
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    } @else {
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    }
                  </button>
                </div>
                <div class="mb-6 relative">
                  <label class="block text-sm text-gray-700 mb-1">Confirm Password</label>
                  <input formControlName="confirmPassword" [type]="showConfirmPwd() ? 'text' : 'password'"
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:border-gold-500"
                    placeholder="Re-enter password">
                  <button type="button" (click)="showConfirmPwd.set(!showConfirmPwd())"
                    class="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                  @if (passwordForm.errors?.['mismatch'] && passwordForm.get('confirmPassword')?.touched) {
                    <p class="text-red-500 text-xs mt-1">Passwords do not match</p>
                  }
                </div>
                <button type="submit" [disabled]="loading()"
                  class="w-full btn-primary py-3 text-sm tracking-widest disabled:opacity-50">
                  @if (loading()) { UPDATING... } @else { UPDATE PASSWORD }
                </button>
              </form>
            </div>
          }

          <!-- Step 4: Success -->
          @if (step() === 4) {
            <div class="text-center py-6">
              <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h2 class="font-heading text-2xl text-gray-800 mb-2">Password Updated!</h2>
              <p class="text-sm text-gray-500 mb-6">Your password has been reset successfully.</p>
              <a routerLink="/login" class="btn-primary inline-block py-3 px-8 text-sm tracking-widest">SIGN IN NOW</a>
            </div>
          }

          @if (error()) {
            <div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{{ error() }}</div>
          }

          <div class="mt-6 text-center text-sm text-gray-500">
            Remember your password?
            <a routerLink="/login" class="text-gold-600 hover:underline ml-1 font-medium">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  step = signal(1);
  loading = signal(false);
  error = signal('');
  showPwd = signal(false);
  showConfirmPwd = signal(false);
  timer = signal(180);
  maskedUsername = signal('');
  private timerInterval: any;
  private otpValue = '';

  usernameForm: FormGroup;
  otpForm: FormGroup;
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.usernameForm = this.fb.group({ username: ['', [Validators.required, Validators.minLength(5)]] });
    this.otpForm = this.fb.group({ otp: [''] });
    this.passwordForm = this.fb.group(
      { password: ['', [Validators.required, Validators.minLength(8)]], confirmPassword: ['', Validators.required] },
      { validators: this.matchPasswords }
    );
  }

  matchPasswords(group: FormGroup) {
    return group.get('password')?.value === group.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  sendOtp() {
    if (this.usernameForm.invalid) { this.usernameForm.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');
    const username = this.usernameForm.value.username;
    this.maskedUsername.set(username.length > 6 ? username.slice(0, 3) + '***' + username.slice(-2) : '***');
    setTimeout(() => {
      this.loading.set(false);
      this.step.set(2);
      this.startTimer();
    }, 1500);
  }

  startTimer() {
    this.timer.set(180);
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      const t = this.timer();
      if (t <= 0) { clearInterval(this.timerInterval); return; }
      this.timer.set(t - 1);
    }, 1000);
  }

  formatTimer(): string {
    const m = Math.floor(this.timer() / 60);
    const s = this.timer() % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  onOtpInput(event: Event | KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '');
    input.value = val;
    if (val && index < 5) {
      const next = document.getElementById(`otp-fp-${index + 1}`) as HTMLInputElement;
      next?.focus();
    }
    // Build OTP string
    this.otpValue = Array.from({ length: 6 }, (_, i) => {
      const el = document.getElementById(`otp-fp-${i}`) as HTMLInputElement;
      return el?.value || '';
    }).join('');
  }

  onOtpBackspace(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (!input.value && index > 0) {
      const prev = document.getElementById(`otp-fp-${index - 1}`) as HTMLInputElement;
      prev?.focus();
    }
  }

  verifyOtp() {
    if (this.otpValue.length < 6) { this.error.set('Please enter the complete 6-digit OTP'); return; }
    this.loading.set(true);
    this.error.set('');
    setTimeout(() => { this.loading.set(false); this.step.set(3); }, 1500);
  }

  resetPassword() {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');
    setTimeout(() => { this.loading.set(false); this.step.set(4); }, 1500);
  }

  ngOnDestroy() { clearInterval(this.timerInterval); }
}
