import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./core/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'properties',
        loadComponent: () => import('./features/property/components/property-list/property-list.component').then(m => m.PropertyListComponent)
      },
      {
        path: 'properties/:id',
        loadComponent: () => import('./features/property/property-details/property-details.component').then(m => m.PropertyDetailsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
