import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap } from 'rxjs';
import { ToastService } from '@core/services/toast.service';
import { AuthService } from '@core/services/auth.service';

/**
 * Global HTTP error interceptor — catches all API errors and shows user-friendly toasts.
 * On 401: attempts token refresh once before logging out.
 * Handles 403 (forbidden), 404, 422, 429, 500, and network errors.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Attempt silent token refresh on 401 (skip if this IS the refresh/login request)
      if (error.status === 401 && !req.url.includes('/auth/refresh') && !req.url.includes('/auth/login')) {
        return auth.refreshAccessToken().pipe(
          switchMap((newToken) => {
            if (newToken) {
              // Retry the original request with the new token
              const retried = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next(retried);
            }
            toast.show('Your session has expired. Please sign in again.', 'error');
            router.navigate(['/login']);
            return throwError(() => error);
          })
        );
      }

      let message = 'Something went wrong. Please try again.';

      if (error.status === 0) {
        message = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.status === 401) {
        message = 'Your session has expired. Please sign in again.';
        auth.logout();
        router.navigate(['/login']);
      } else if (error.status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        message = 'The requested resource was not found.';
      } else if (error.status === 409) {
        message = error.error?.message || 'This action has already been performed.';
      } else if (error.status === 422 || error.status === 400) {
        message = error.error?.message || extractValidationErrors(error) || 'Invalid input. Please check your details.';
      } else if (error.status === 429) {
        message = 'Too many requests. Please wait a moment and try again.';
      } else if (error.status >= 500) {
        message = 'Server error. Our team has been notified. Please try again later.';
      }

      toast.show(message, 'error');
      return throwError(() => error);
    })
  );
};

/** Extract validation error messages from ASP.NET model state */
function extractValidationErrors(error: HttpErrorResponse): string | null {
  if (error.error?.errors) {
    const errors = error.error.errors;
    const messages: string[] = [];
    for (const key of Object.keys(errors)) {
      if (Array.isArray(errors[key])) {
        messages.push(...errors[key]);
      }
    }
    return messages.length ? messages.join('. ') : null;
  }
  return null;
}
