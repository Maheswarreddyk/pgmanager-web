import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private authStatusSubject = new BehaviorSubject<boolean>(false);

  authStatus$ = this.authStatusSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check if user is already logged in
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const user = localStorage.getItem(this.USER_KEY);
    
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
      this.authStatusSubject.next(true);
      console.log('Auth Service - User is authenticated');
    } else {
      this.currentUserSubject.next(null);
      this.authStatusSubject.next(false);
      console.log('Auth Service - User is not authenticated');
      if (window.location.pathname !== '/login') {
        this.router.navigate(['/login']);
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    // // For development, use mock authentication
    // if (!environment.production) {
    //   const mockResponse = {
    //     token: 'mock-jwt-token',
    //     user: {
    //       id: '1',
    //       email: email,
    //       name: 'Test User'
    //     }
    //   };
      
    //   localStorage.setItem(this.TOKEN_KEY, mockResponse.token);
    //   localStorage.setItem(this.USER_KEY, JSON.stringify(mockResponse.user));
    //   this.currentUserSubject.next(mockResponse.user);
    //   this.authStatusSubject.next(true);
    //   console.log('Auth Service - User logged in successfully');
      
    //   return of(mockResponse);
    // }

    // For production, use actual API
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem(this.TOKEN_KEY, response.token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
            this.authStatusSubject.next(true);
            console.log('Auth Service - User logged in successfully');
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return of(null);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.authStatusSubject.next(false);
    console.log('Auth Service - User logged out');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const isAuth = !!token;
    console.log('Auth Service - isAuthenticated:', isAuth);
    return isAuth;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
} 