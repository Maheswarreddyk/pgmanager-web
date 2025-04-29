import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    CheckboxModule
  ],
  template: `
    <div class="flex align-items-center justify-content-center min-h-screen bg-blue-50">
      <div class="surface-card p-4 shadow-2 border-round w-full lg:w-4">
        <div class="text-center mb-5">
          <div class="text-900 text-3xl font-medium mb-3">Welcome Back</div>
          <span class="text-600 font-medium">Sign in to continue</span>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label for="email" class="block text-900 font-medium mb-2">Email</label>
            <input 
              id="email" 
              type="email" 
              pInputText 
              class="w-full" 
              formControlName="email"
              [ngClass]="{'ng-invalid ng-dirty': loginForm.get('email')?.invalid && loginForm.get('email')?.touched}"
            >
            <small class="p-error block" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              Please enter a valid email address
            </small>
          </div>

          <div class="mb-3">
            <label for="password" class="block text-900 font-medium mb-2">Password</label>
            <input 
              id="password" 
              type="password" 
              pInputText 
              class="w-full"
              formControlName="password"
              [ngClass]="{'ng-invalid ng-dirty': loginForm.get('password')?.invalid && loginForm.get('password')?.touched}"
            >
            <small class="p-error block" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              Password is required
            </small>
          </div>

          <div class="flex align-items-center justify-content-between mb-4">
            <div class="flex align-items-center">
              <p-checkbox 
                [binary]="true" 
                id="rememberme" 
                [ngModel]="rememberMe" 
                (ngModelChange)="rememberMe = $event"
                [ngModelOptions]="{standalone: true}"
              ></p-checkbox>
              <label for="rememberme" class="ml-2">Remember me</label>
            </div>
            <a class="font-medium no-underline text-blue-500 cursor-pointer">Forgot password?</a>
          </div>

          <p-button 
            type="submit"
            label="Sign In" 
            icon="pi pi-user"
            [loading]="isLoading"
            styleClass="w-full"
            [disabled]="loginForm.invalid || isLoading">
          </p-button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  rememberMe = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate(['/dashboard']);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Login error:', error);
          this.isLoading = false;
        }
      });
    }
  }
} 