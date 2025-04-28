import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    RouterLink
  ],
  template: `
    <div class="page-container">
      <nav class="navbar">
        <div class="logo">
          <mat-icon>apartment</mat-icon>
          <span>PG Manager</span>
        </div>
        <div class="nav-links">
          <a href="#">About</a>
          <a href="#">Features</a>
          <a href="#">Contact</a>
          <button mat-flat-button color="primary" routerLink="/login">Login</button>
        </div>
      </nav>

      <div class="content-container">
        <div class="left-section">
          <h1>Manage Your PG Business Smarter</h1>
          <p>Streamline your PG operations with our all-in-one management system. Track payments, manage tenants, and grow your business effortlessly.</p>
          <div class="action-buttons">
            <button mat-flat-button color="primary">Try Demo</button>
            <button mat-stroked-button color="primary">Get Started</button>
          </div>
        </div>

        <div class="login-container">
          <div class="login-card">
            <h2>Welcome Back</h2>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="form-field">
                <label for="email">Email</label>
                <input id="email" type="email" formControlName="email" placeholder="Enter your email">
                <div class="error-message" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.hasError('required')">
                  Email is required
                </div>
                <div class="error-message" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.hasError('email')">
                  Please enter a valid email
                </div>
              </div>

              <div class="form-field">
                <label for="password">Password</label>
                <input id="password" type="password" formControlName="password" placeholder="Enter your password">
                <div class="error-message" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.hasError('required')">
                  Password is required
                </div>
              </div>

              <button type="submit" class="submit-button" [disabled]="loginForm.invalid || isLoading">
                <span *ngIf="!isLoading">Sign In</span>
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
              </button>

              <div class="divider">
                <span>Or continue with</span>
              </div>

              <div class="register-link">
                <a routerLink="/register">Don't have an account? Register here</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-links a {
      text-decoration: none;
      color: #333;
      font-weight: 500;
    }

    .content-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 4rem 2rem;
      gap: 4rem;
    }

    .left-section {
      flex: 1;
    }

    .left-section h1 {
      font-size: 3rem;
      font-weight: 700;
      color: #1a237e;
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }

    .left-section p {
      font-size: 1.2rem;
      color: #555;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
    }

    .login-container {
      flex: 1;
      max-width: 450px;
    }

    .login-card {
      background: white;
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    h2 {
      font-size: 1.8rem;
      color: #1a237e;
      margin-bottom: 2rem;
      text-align: center;
      font-weight: 600;
    }

    .form-field {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #1a237e;
    }

    .error-message {
      color: #d32f2f;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .submit-button {
      width: 100%;
      padding: 1rem;
      background: #1a237e;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .submit-button:disabled {
      background: #9fa8da;
      cursor: not-allowed;
    }

    .divider {
      text-align: center;
      margin: 1.5rem 0;
      position: relative;
    }

    .divider::before,
    .divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 45%;
      height: 1px;
      background: #ddd;
    }

    .divider::before {
      left: 0;
    }

    .divider::after {
      right: 0;
    }

    .divider span {
      background: white;
      padding: 0 1rem;
      color: #666;
      font-size: 0.875rem;
    }

    .register-link {
      text-align: center;
      margin-top: 1rem;
    }

    .register-link a {
      color: #1a237e;
      text-decoration: none;
      font-weight: 500;
    }

    .register-link a:hover {
      text-decoration: underline;
    }

    @media (max-width: 1024px) {
      .content-container {
        flex-direction: column;
        text-align: center;
        padding: 2rem;
      }

      .left-section {
        margin-bottom: 2rem;
      }

      .action-buttons {
        justify-content: center;
      }

      .login-container {
        width: 100%;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Starting login process...');
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login successful, attempting navigation to dashboard...');
          this.isLoading = false;
          
          setTimeout(() => {
            this.router.navigate(['/dashboard']).then(
              (success) => {
                console.log('Navigation result:', success);
                if (!success) {
                  console.error('Navigation failed - checking current route:', this.router.url);
                }
              },
              (error) => console.error('Navigation error:', error)
            );
          }, 100);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.isLoading = false;
          this.snackBar.open(error.error?.message || 'Login failed', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }
} 