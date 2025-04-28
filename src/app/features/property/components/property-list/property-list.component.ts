import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PropertyService } from '../../../../core/services/property.service';
import { Property } from '../../../../core/models/property.model';
import { PropertySelectorDialogComponent } from '../property-selector-dialog/property-selector-dialog.component';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="property-list-container">
      <div class="header">
        <h1>Properties</h1>
        <button mat-flat-button color="primary" (click)="openAddPropertyDialog()">
          <mat-icon>add</mat-icon>
          Add Property
        </button>
      </div>

      <div class="property-grid">
        <mat-card class="property-card" *ngFor="let property of properties" (click)="viewPropertyDetails(property)">
          <img mat-card-image src="https://via.placeholder.com/600x400" alt="Property image">
          <mat-card-content>
            <h2>{{property.name}}</h2>
            <div class="property-stats">
              <span>{{property.totalFloors}} floors</span>
              <span class="dot-separator">•</span>
              <span>{{property.roomCount}} rooms</span>
            </div>
          </mat-card-content>
          <button mat-icon-button class="edit-button" (click)="editProperty(property); $event.stopPropagation()">
            <mat-icon>edit</mat-icon>
          </button>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .property-list-container {
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }

    .property-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .property-card {
      position: relative;
      transition: transform 0.2s;
      cursor: pointer;

      &:hover {
        transform: translateY(-4px);
      }
    }

    .property-card img {
      height: 200px;
      object-fit: cover;
    }

    mat-card-content {
      padding: 16px;
    }

    h2 {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 500;
    }

    .address {
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 8px;
    }

    .property-stats {
      display: flex;
      align-items: center;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }

    .dot-separator {
      margin: 0 8px;
    }

    .edit-button {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255, 255, 255, 0.9);
    }
  `]
})
export class PropertyListComponent implements OnInit {
  properties: Property[] = [];

  constructor(
    private propertyService: PropertyService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    this.propertyService.getProperties().subscribe({
      next: (properties) => {
        this.properties = properties;
      },
      error: (error) => {
        console.error('Error loading properties:', error);
      }
    });
  }

  openAddPropertyDialog() {
    const dialogRef = this.dialog.open(PropertySelectorDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'create') {
        this.loadProperties();
      }
    });
  }

  editProperty(property: Property) {
    const dialogRef = this.dialog.open(PropertySelectorDialogComponent, {
      width: '500px',
      data: { property, mode: 'edit' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.action === 'edit' || result.action === 'delete')) {
        this.loadProperties();
      }
    });
  }

  viewPropertyDetails(property: Property) {
    this.router.navigate(['/properties', property.id]);
  }
} 