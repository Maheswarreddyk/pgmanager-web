import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../auth/services/auth.service';

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
    <div class="layout-wrapper">
      <!-- Fixed Sidebar -->
      <div class="sidebar">
        <div class="flex flex-column h-full">
          <div class="flex align-items-center gap-2 px-3 py-3 border-bottom-1 surface-border">
            <i class="pi pi-home text-xl"></i>
            <span class="text-xl font-medium">PG Manager</span>
          </div>
          
          <div class="sidebar-menu-container">
            <p-panelMenu [model]="menuItems" styleClass="w-full border-none sidebar-menu"></p-panelMenu>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <p-toolbar styleClass="toolbar">
          <div class="p-toolbar-group-end">
            <p-button icon="pi pi-user" styleClass="p-button-text" (onClick)="logout()"></p-button>
          </div>
        </p-toolbar>

        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      min-height: 100vh;
      height: 100vh;
      overflow: hidden;
    }

    .sidebar {
      width: 18rem;
      background: var(--surface-section);
      border-right: 1px solid var(--surface-border);
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 1000;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .sidebar-menu-container {
      flex: 1;
      overflow-y: auto;
    }

    .main-content {
      flex: 1;
      margin-left: 18rem;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .toolbar {
      padding: 1rem;
      background: var(--surface-card);
      border-bottom: 1px solid var(--surface-border);
      position: sticky;
      top: 0;
      z-index: 999;
    }

    .content-area {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
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