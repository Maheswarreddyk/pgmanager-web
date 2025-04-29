import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PropertyService } from '../../../../core/services/property.service';
import { Property } from '../../../../core/models/property.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="grid">
      <div class="col-12">
        <h1>My Properties</h1>
      </div>
      <div class="col-12" *ngIf="isLoading">
        <p-progressSpinner></p-progressSpinner>
      </div>
      <div class="col-12 md:col-6 lg:col-4" *ngFor="let property of properties">
        <p-card [header]="property.name">
          <ng-template pTemplate="header">
            <img [src]="property.imageUrl || 'assets/images/default-property.jpg'" [alt]="property.name" class="property-image">
          </ng-template>
          <p class="m-0">
            <strong>Address:</strong> {{property.address}}
          </p>
          <p class="m-0">
            <strong>Floors:</strong> {{property.totalFloors}}
          </p>
          <p class="m-0">
            <strong>Rooms:</strong> {{property.roomCount}}
          </p>
          <ng-template pTemplate="footer">
            <p-button label="View Details" [routerLink]="['/properties', property.id]" icon="pi pi-eye"></p-button>
          </ng-template>
        </p-card>
      </div>
      <div class="col-12" *ngIf="!isLoading && properties.length === 0">
        <p-card>
          <p class="m-0">No properties found. Add your first property to get started!</p>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .property-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
  `]
})
export class PropertyListComponent implements OnInit {
  properties: Property[] = [];
  isLoading = true;

  constructor(
    private propertyService: PropertyService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  private loadProperties(): void {
    this.isLoading = true;
    this.propertyService.getProperties().subscribe({
      next: (properties) => {
        this.properties = properties;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load properties. Please try again later.'
        });
        this.isLoading = false;
      }
    });
  }
} 