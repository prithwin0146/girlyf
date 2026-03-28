import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-[70vh] flex items-center justify-center bg-brown-200/30 py-10">
      <div class="w-full max-w-md mx-4">
        <div class="bg-white shadow-xl border border-gray-100">
          <!-- HEADER -->
          <div class="bg-primary-900 p-6 text-center">
            <h1 class="font-heading text-xl text-white tracking-wider">SIGN IN</h1>
            <p class="text-white/60 text-xs mt-1">Welcome back to Girlyf Jewellery</p>
          </div>

          <div class="p-6">
            <!-- DUAL MODE TABS (JA: Password + OTP) -->
            <div class="flex border-b border-gray-200 mb-6">
              <button (click)="mode.set('password')" class="flex-1 py-2.5 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors"
                [class.border-gold-500]="mode() === 'password'" [class.text-primary-900]="mode() === 'password'"
                [class.border-transparent]="mode() !== 'password'" [class.text-gray-400]="mode() !== 'password'">
                Password
              </button>
              <button (click)="mode.set('otp')" class="flex-1 py-2.5 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors"
                [class.border-gold-500]="mode() === 'otp'" [class.text-primary-900]="mode() === 'otp'"
                [class.border-transparent]="mode() !== 'otp'" [class.text-gray-400]="mode() !== 'otp'">
                OTP Login
              </button>
            </div>

            @if (mode() === 'password') {
              <form (ngSubmit)="loginWithPassword()">
                <div class="mb-4">
                  <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Email / Phone</label>
                  <input type="text" [(ngModel)]="email" name="email" required class="w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500" placeholder="Enter email or phone">
                </div>
                <div class="mb-4">
                  <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Password</label>
                  <div class="relative">
                    <input [type]="showPassword() ? 'text' : 'password'" [(ngModel)]="password" name="password" required class="w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500 pr-10" placeholder="Enter password">
                    <button type="button" (click)="showPassword.set(!showPassword())" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{{ showPassword() ? 'HIDE' : 'SHOW' }}</button>
                  </div>
                </div>
                <div class="flex items-center justify-between mb-6">
                  <label class="flex items-center gap-2 text-xs text-gray-500"><input type="checkbox" class="accent-gold-500"> Remember me</label>
                  <a href="#" class="text-xs text-primary-900 font-semibold hover:text-gold-600">Forgot Password?</a>
                </div>
                @if (error()) { <p class="text-xs text-red-600 mb-3">{{ error() }}</p> }
                <button type="submit" [disabled]="loading()" class="w-full btn-primary py-3 text-sm">
                  @if (loading()) { <span class="animate-spin inline-block mr-1">⏳</span> } SIGN IN
                </button>
              </form>
            } @else {
              <!-- OTP MODE (JA: 180s timer) -->
              <form (ngSubmit)="otpStep() === 'phone' ? sendOtp() : verifyOtp()">
                @if (otpStep() === 'phone') {
                  <div class="mb-4">
                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Mobile Number</label>
                    <div class="flex">
                      <span class="px-3 py-2.5 bg-gray-50 border border-r-0 border-gray-200 text-sm text-gray-500">+91</span>
                      <input type="tel" [(ngModel)]="phone" name="phone" maxlength="10" required class="flex-1 px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500" placeholder="Enter 10-digit number">
                    </div>
                  </div>
                  <button type="submit" [disabled]="loading()" class="w-full btn-primary py-3 text-sm">SEND OTP</button>
                } @else {
                  <div class="mb-4 text-center">
                    <p class="text-sm text-gray-600">OTP sent to <strong>+91 {{ phone }}</strong></p>
                    <button type="button" (click)="otpStep.set('phone')" class="text-xs text-primary-900 font-semibold mt-1">Change</button>
                  </div>
                  <div class="mb-4">
                    <label class="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider text-center">Enter OTP</label>
                    <div class="flex justify-center gap-3">
                      @for (i of [0,1,2,3,4,5]; track i) {
                        <input type="text" maxlength="1" class="otp-input" [(ngModel)]="otpDigits[i]" [name]="'otp'+i"
                          (input)="onOtpInput($event, i)" (keydown)="onOtpKeydown($event, i)">
                      }
                    </div>
                  </div>
                  <div class="text-center mb-4">
                    @if (otpTimer() > 0) {
                      <p class="text-xs text-gray-400">Resend OTP in <span class="text-primary-900 font-bold font-price">{{ otpTimerDisplay() }}</span></p>
                    } @else {
                      <button type="button" (click)="sendOtp()" class="text-xs text-primary-900 font-bold">RESEND OTP</button>
                    }
                  </div>
                  @if (error()) { <p class="text-xs text-red-600 mb-3 text-center">{{ error() }}</p> }
                  <button type="submit" [disabled]="loading()" class="w-full btn-primary py-3 text-sm">VERIFY & SIGN IN</button>
                }
              </form>
            }

            <div class="mt-6 text-center">
              <p class="text-xs text-gray-500">Don't have an account? <a routerLink="/register" class="text-primary-900 font-bold hover:text-gold-600">Create Account</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  mode = signal<'password' | 'otp'>('password');
  otpStep = signal<'phone' | 'verify'>('phone');
  showPassword = signal(false);
  loading = signal(false);
  error = signal('');
  otpTimer = signal(0);

  email = '';
  password = '';
  phone = '';
  otpDigits: string[] = ['', '', '', '', '', ''];
  private timerInterval: any;

  constructor(private auth: AuthService, private router: Router) {}

  loginWithPassword(): void {
    this.loading.set(true);
    this.error.set('');
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => { this.loading.set(false); this.router.navigate(['/']); },
      error: (err) => { this.loading.set(false); this.error.set(err?.error?.message || 'Invalid credentials'); }
    });
  }

  sendOtp(): void {
    if (this.phone.length !== 10) { this.error.set('Enter a valid 10-digit number'); return; }
    this.loading.set(true);
    // Simulate OTP send
    setTimeout(() => {
      this.loading.set(false);
      this.otpStep.set('verify');
      this.startTimer(180);
    }, 500);
  }

  verifyOtp(): void {
    const otp = this.otpDigits.join('');
    if (otp.length !== 6) { this.error.set('Enter complete 6-digit OTP'); return; }
    this.loading.set(true);
    // Simulate OTP verify
    setTimeout(() => {
      this.loading.set(false);
      this.router.navigate(['/']);
    }, 500);
  }

  private startTimer(seconds: number): void {
    clearInterval(this.timerInterval);
    this.otpTimer.set(seconds);
    this.timerInterval = setInterval(() => {
      const current = this.otpTimer();
      if (current <= 1) { clearInterval(this.timerInterval); this.otpTimer.set(0); }
      else this.otpTimer.set(current - 1);
    }, 1000);
  }

  otpTimerDisplay(): string {
    const t = this.otpTimer();
    return `${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, '0')}`;
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
