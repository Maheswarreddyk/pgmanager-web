import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { PropertyService } from '../../core/services/property.service';
import { PropertySelectorDialogComponent } from '../property/components/property-selector-dialog/property-selector-dialog.component';
import { Property, PropertyStats, Payment } from '../../core/models/property.model';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('occupancyChart') occupancyChartRef!: ElementRef;
  private occupancyChart: Chart | null = null;
  
  selectedProperty: Property | null = null;
  properties: Property[] = [];
  stats: PropertyStats | null = null;
  recentPayments: Payment[] = [];
  dateRangeForm: FormGroup;

  constructor(
    private authService: AuthService,
    private propertyService: PropertyService,
    private dialog: MatDialog,
    public router: Router,
    private fb: FormBuilder
  ) {
    this.dateRangeForm = this.fb.group({
      startDate: [new Date(new Date().getFullYear(), new Date().getMonth(), 1)],
      endDate: [new Date()]
    });

    // Temporary data for demo
    this.recentPayments = [
      {
        tenantName: 'Priya Singh',
        amount: 0,
        date: new Date('2023-07-10'),
        status: 'Pending'
      },
      {
        tenantName: 'Vikram Mehta',
        amount: 9000,
        date: new Date('2023-07-08'),
        status: 'Paid'
      },
      {
        tenantName: 'Rahul Kumar',
        amount: 4000,
        date: new Date('2023-07-05'),
        status: 'Partial'
      },
      {
        tenantName: 'Rajesh Khanna',
        amount: 0,
        date: new Date('2023-07-05'),
        status: 'Pending'
      }
    ];
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadProperties();
    this.propertyService.selectedProperty$.subscribe(property => {
      this.selectedProperty = property;
      if (property) {
        this.loadStats();
      }
    });

    this.dateRangeForm.valueChanges.subscribe(() => {
      if (this.selectedProperty) {
        this.loadStats();
      }
    });
  }

  ngAfterViewInit() {
    if (this.stats) {
      this.createOccupancyChart();
    }
  }

  private createOccupancyChart() {
    if (!this.stats || !this.occupancyChartRef) return;

    const ctx = this.occupancyChartRef.nativeElement.getContext('2d');
    
    if (this.occupancyChart) {
      this.occupancyChart.destroy();
    }

    this.occupancyChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Occupied', 'Vacant'],
        datasets: [{
          data: [this.stats.occupiedRooms, this.stats.vacantRooms],
          backgroundColor: ['#4361ee', '#ff9933'],
          borderWidth: 0,
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  loadProperties() {
    this.propertyService.getProperties().subscribe({
      next: (properties) => {
        this.properties = properties;
        if (properties.length === 0) {
          this.openPropertyDialog();
        }
      },
      error: (error) => {
        console.error('Error loading properties:', error);
      }
    });
  }

  loadStats() {
    if (!this.selectedProperty) return;

    const { startDate, endDate } = this.dateRangeForm.value;
    this.propertyService.getPropertyStats(
      this.selectedProperty.id,
      startDate,
      endDate
    ).subscribe({
      next: (stats) => {
        this.stats = stats;
        this.createOccupancyChart();
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  openPropertyDialog() {
    const dialogRef = this.dialog.open(PropertySelectorDialogComponent, {
      width: '500px',
      disableClose: this.properties.length === 0
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'select' || result.action === 'create') {
          this.propertyService.selectProperty(result.property);
          this.loadProperties();
        }
      }
    });
  }

  selectProperty(property: Property) {
    this.propertyService.selectProperty(property);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 