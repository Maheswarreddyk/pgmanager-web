import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { PropertyListComponent } from './features/property/components/property-list/property-list.component';
import { PropertyDetailsComponent } from './features/property/property-details/property-details.component';

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
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'properties',
    component: PropertyListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'properties/:id',
    component: PropertyDetailsComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];
