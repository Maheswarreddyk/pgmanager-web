import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarModule,
    ButtonModule,
    PanelMenuModule,
    ToolbarModule
  ],
  template: `
    <div class="min-h-screen flex">
      <!-- Fixed Sidebar -->
      <div class="surface-section border-right-1 surface-border w-18rem">
        <div class="flex flex-column h-full">
          <div class="flex align-items-center gap-2 px-3 py-3 border-bottom-1 surface-border">
            <i class="pi pi-home text-xl"></i>
            <span class="text-xl font-medium">PG Manager</span>
          </div>
          
          <div class="flex-1 overflow-y-auto">
            <p-panelMenu [model]="menuItems" styleClass="w-full border-none sidebar-menu"></p-panelMenu>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-column">
        <p-toolbar styleClass="mb-4 surface-0">
          <div class="p-toolbar-group-end">
            <p-button icon="pi pi-user" styleClass="p-button-text" (onClick)="logout()"></p-button>
          </div>
        </p-toolbar>

        <div class="flex-1 p-4">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }

    :host ::ng-deep {
      .sidebar-menu {
        .p-panelmenu-header > a {
          padding: 1rem;
          font-size: 0.875rem;
        }
        
        .p-panelmenu-content {
          padding: 0;
        }
        
        .p-panelmenu-header:not(.p-highlight):not(.p-disabled) > a:hover {
          background: var(--surface-hover);
        }

        .p-panelmenu-header-link {
          font-weight: normal !important;
        }
        
        .p-menuitem-icon {
          margin-right: 0.5rem;
        }
      }
      
      .p-toolbar {
        padding: 1rem;
        background: var(--surface-card);
        border-bottom: 1px solid var(--surface-border);
      }
    }
  `]
})
export class MainLayoutComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/dashboard'
    },
    {
      label: 'Properties',
      icon: 'pi pi-building',
      routerLink: '/properties'
    },
    {
      label: 'Tenants',
      icon: 'pi pi-users',
      routerLink: '/tenants'
    },
    {
      label: 'Payments',
      icon: 'pi pi-money-bill',
      routerLink: '/payments'
    },
    {
      label: 'Expenses',
      icon: 'pi pi-wallet',
      routerLink: '/expenses'
    },
    {
      label: 'Reports',
      icon: 'pi pi-chart-bar',
      routerLink: '/reports'
    }
  ];

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
} 