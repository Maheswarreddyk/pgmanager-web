import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { PropertyService } from '../property/services/property.service';
import { TenantService } from '../tenant/services/tenant.service';
import { PaymentService } from '../payment/services/payment.service';
import { Property } from '../property/models/property.model';
import { Tenant } from '../tenant/models/tenant.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule],
  template: `
    <div class="grid">
      <!-- Summary Cards -->
      <div class="col-12 md:col-6 lg:col-3">
        <p-card>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span class="block text-500 font-medium mb-3">Total Properties</span>
              <div class="text-900 font-medium text-xl">{{ totalProperties }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-building text-blue-500 text-xl"></i>
            </div>
          </div>
        </p-card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <p-card>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span class="block text-500 font-medium mb-3">Total Tenants</span>
              <div class="text-900 font-medium text-xl">{{ totalTenants }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-users text-green-500 text-xl"></i>
            </div>
          </div>
        </p-card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <p-card>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span class="block text-500 font-medium mb-3">Monthly Revenue</span>
              <div class="text-900 font-medium text-xl">₹{{ monthlyRevenue }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-money-bill text-purple-500 text-xl"></i>
            </div>
          </div>
        </p-card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <p-card>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span class="block text-500 font-medium mb-3">Vacant Rooms</span>
              <div class="text-900 font-medium text-xl">{{ vacantRooms }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-home text-orange-500 text-xl"></i>
            </div>
          </div>
        </p-card>
      </div>

      <!-- Charts -->
      <div class="col-12 lg:col-6">
        <p-card header="Revenue Overview">
          <p-chart type="line" [data]="revenueData" [options]="chartOptions"></p-chart>
        </p-card>
      </div>

      <div class="col-12 lg:col-6">
        <p-card header="Occupancy Rate">
          <p-chart type="doughnut" [data]="occupancyData" [options]="chartOptions"></p-chart>
        </p-card>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  totalProperties = 0;
  totalTenants = 0;
  monthlyRevenue = 0;
  vacantRooms = 0;

  revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [65000, 59000, 80000, 81000, 56000, 55000],
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.4
      }
    ]
  };

  occupancyData = {
    labels: ['Occupied', 'Vacant'],
    datasets: [
      {
        data: [75, 25],
        backgroundColor: ['#42A5F5', '#FFA726']
      }
    ]
  };

  chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };

  constructor(
    private propertyService: PropertyService,
    private tenantService: TenantService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load properties data
    this.propertyService.getProperties().subscribe({
      next: (properties) => {
        this.totalProperties = properties.length;
        this.vacantRooms = properties.reduce((acc, property) => 
          acc + (property.totalRooms - property.occupiedRooms), 0);
      },
      error: (error) => {
        console.error('Error loading properties:', error);
      }
    });

    // Load tenants data
    this.tenantService.getTenants().subscribe({
      next: (tenants) => {
        this.totalTenants = tenants.length;
      },
      error: (error) => {
        console.error('Error loading tenants:', error);
      }
    });

    // Load payments data
    this.paymentService.getMonthlyRevenue().subscribe({
      next: (revenue) => {
        this.monthlyRevenue = revenue;
      },
      error: (error) => {
        console.error('Error loading revenue:', error);
      }
    });
  }
} 