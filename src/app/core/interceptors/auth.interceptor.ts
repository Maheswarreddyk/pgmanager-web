import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    console.log('AuthInterceptor initialized');
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('Intercepting request to:', request.url);
    
    // Only add auth header for API requests
    if (!request.url.includes('/api/')) {
      return next.handle(request);
    }

    const token = this.authService.getToken();
    console.log('Found token:', !!token);

    if (!token) {
      return next.handle(request);
    }

    // Add auth header
    const authReq = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });

    console.log('Added auth header:', authReq.headers.get('Authorization'));

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Request error:', error);
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
} 