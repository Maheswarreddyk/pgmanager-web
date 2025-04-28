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

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private propertyService: PropertyService
  ) {
    console.log('AuthService constructor - Initializing auth state');
    try {
      const storedUser = localStorage.getItem('currentUser');
      const token = localStorage.getItem('token');
      
      if (storedUser && storedUser !== 'undefined' && token) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id && parsedUser.email && parsedUser.name) {
          console.log('Found valid stored user and token');
          this.currentUserSubject.next(parsedUser);
        } else {
          console.log('Invalid stored user data, clearing auth state');
          this.clearAuthState();
        }
      } else {
        console.log('No stored auth state found');
        this.clearAuthState();
      }
    } catch (error) {
      console.error('Error initializing auth state:', error);
      this.clearAuthState();
    }
  }

  private clearAuthState(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('selectedProperty');
    this.currentUserSubject.next(null);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap(response => {
          console.log('Processing login response:', response);
          
          // Extract user data and token from response
          const userData = {
            id: response.id,
            email: response.email,
            name: `${response.firstName} ${response.lastName}`
          };
          
          const token = response.token;
          
          if (!token || !userData.id || !userData.email) {
            console.error('Missing required auth data');
            return;
          }

          // Set the user in memory first
          this.currentUserSubject.next(userData);
          
          // Then store in localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('currentUser', JSON.stringify(userData));
          
          console.log('Auth state set - User in memory:', !!this.currentUserSubject.value);
          console.log('Auth state set - Token in storage:', !!localStorage.getItem('token'));
          
          // Verify complete auth state
          const isValid = this.verifyAuthState();
          
          if (isValid) {
            console.log('Authentication verified, proceeding with property selection');
            this.checkAndHandlePropertySelection();
          } else {
            console.error('Failed to establish valid auth state');
            this.clearAuthState();
          }
        })
      );
  }

  private verifyAuthState(): boolean {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('currentUser');
    const memoryUser = this.currentUserSubject.value;
    
    console.log('Verifying auth state components:');
    console.log('- Token:', !!token);
    console.log('- Stored user:', !!storedUser);
    console.log('- Memory user:', !!memoryUser);
    
    if (!token || !storedUser || !memoryUser) {
      console.error('Missing auth state component');
      return false;
    }
    
    try {
      const parsedUser = JSON.parse(storedUser);
      const isValid = !!(parsedUser.id && parsedUser.email && parsedUser.name);
      console.log('Stored user validation:', isValid);
      return isValid;
    } catch (e) {
      console.error('Failed to parse stored user:', e);
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
          
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(userData));
          this.currentUserSubject.next(userData);
          this.checkAndHandlePropertySelection();
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('selectedProperty');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const user = this.currentUserSubject.value;
    console.log('isAuthenticated check - Token:', !!token, 'User:', !!user);
    return !!(token && user);
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('getToken called - retrieved token:', token);
    return token;
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