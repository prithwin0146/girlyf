import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, of, catchError, switchMap, BehaviorSubject, filter, take } from 'rxjs';
import { environment } from '@env/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '@core/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'girlyf_token';
  private readonly REFRESH_KEY = 'girlyf_refresh';
  private readonly USER_KEY = 'girlyf_user';
  private readonly isBrowser: boolean;

  private _user = signal<{ name: string; email: string; role: string } | null>(null);

  // Refresh token state to prevent multiple concurrent refresh calls
  private isRefreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._user());
  readonly isAdmin = computed(() => this._user()?.role === 'admin');

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._user.set(this.loadUser());
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/register`, data).pipe(
      tap((res) => this.handleAuth(res))
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, data).pipe(
      tap((res) => this.handleAuth(res))
    );
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      // Fire-and-forget revoke call
      this.http.post(`${this.base}/revoke`, { refreshToken }).subscribe();
    }
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this._user.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.REFRESH_KEY);
  }

  /**
   * Attempt to refresh the access token using the stored refresh token.
   * Prevents concurrent refresh calls using a BehaviorSubject lock.
   * Returns an Observable that emits the new access token.
   */
  refreshAccessToken(): Observable<string | null> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshSubject.next(null);

      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        this.isRefreshing = false;
        this.logout();
        return of(null);
      }

      return this.http.post<AuthResponse>(`${this.base}/refresh`, { refreshToken }).pipe(
        tap((res) => {
          this.handleAuth(res);
          this.isRefreshing = false;
          this.refreshSubject.next(res.token);
        }),
        switchMap((res) => of(res.token)),
        catchError(() => {
          this.isRefreshing = false;
          this.refreshSubject.next(null);
          this.logout();
          return of(null);
        })
      );
    } else {
      // Another refresh is in progress — wait for it
      return this.refreshSubject.pipe(
        filter((token) => token !== null),
        take(1)
      );
    }
  }

  private handleAuth(res: AuthResponse): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, res.token);
      localStorage.setItem(this.REFRESH_KEY, res.refreshToken);
      const user = { name: res.name, email: res.email, role: res.role };
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this._user.set(user);
    }
  }

  private loadUser(): { name: string; email: string; role: string } | null {
    if (!this.isBrowser) return null;
    try {
      const json = localStorage.getItem(this.USER_KEY);
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  }
}
