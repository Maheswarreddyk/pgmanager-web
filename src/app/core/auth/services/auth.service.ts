import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PropertySelectorDialogComponent } from '../../../features/property/components/property-selector-dialog/property-selector-dialog.component';
import { PropertyService } from '../../services/property.service';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'currentUser';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private propertyService: PropertyService
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    try {
      const storedUser = localStorage.getItem(this.USER_KEY);
      const token = localStorage.getItem(this.TOKEN_KEY);
      
      if (storedUser && storedUser !== 'undefined' && token) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id && parsedUser.email && parsedUser.name) {
          this.currentUserSubject.next(parsedUser);
        } else {
          this.clearAuthState();
        }
      } else {
        this.clearAuthState();
      }
    } catch (error) {
      console.error('Error initializing auth state:', error);
      this.clearAuthState();
    }
  }

  private clearAuthState(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('selectedProperty');
    this.currentUserSubject.next(null);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap(response => {
          if (!response.token) {
            throw new Error('No token received from server');
          }

          const userData = {
            id: response.id,
            email: response.email,
            name: `${response.firstName} ${response.lastName}`
          };

          // Store auth data
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
          this.currentUserSubject.next(userData);

          // Verify auth state
          if (!this.verifyAuthState()) {
            throw new Error('Failed to establish valid auth state');
          }
        })
      );
  }

  private verifyAuthState(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const storedUser = localStorage.getItem(this.USER_KEY);
    const memoryUser = this.currentUserSubject.value;
    
    if (!token || !storedUser || !memoryUser) {
      return false;
    }
    
    try {
      const parsedUser = JSON.parse(storedUser);
      return !!(parsedUser.id && parsedUser.email && parsedUser.name);
    } catch (e) {
      return false;
    }
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');
    
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, { firstName, lastName, email, password })
      .pipe(
        tap(response => {
          const userData = {
            id: response.id,
            email: response.email,
            name: `${response.firstName} ${response.lastName}`
          };
          
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
          this.currentUserSubject.next(userData);
          this.checkAndHandlePropertySelection();
        })
      );
  }

  logout(): void {
    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const user = this.currentUserSubject.value;
    return !!(token && user);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private checkAndHandlePropertySelection(): void {
    this.propertyService.getProperties().subscribe({
      next: (properties) => {
        if (properties.length === 0) {
          const dialogRef = this.dialog.open(PropertySelectorDialogComponent, {
            width: '500px',
            disableClose: true
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result && (result.action === 'select' || result.action === 'create')) {
              this.propertyService.selectProperty(result.property);
              this.router.navigate(['/dashboard']);
            }
          });
        } else if (properties.length === 1) {
          // If there's only one property, select it automatically
          this.propertyService.selectProperty(properties[0]);
          this.router.navigate(['/dashboard']);
        } else {
          // If there are multiple properties, show the selector dialog
          const dialogRef = this.dialog.open(PropertySelectorDialogComponent, {
            width: '500px'
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result && (result.action === 'select' || result.action === 'create')) {
              this.propertyService.selectProperty(result.property);
            }
            this.router.navigate(['/dashboard']);
          });
        }
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.router.navigate(['/dashboard']);
      }
    });
  }
} 