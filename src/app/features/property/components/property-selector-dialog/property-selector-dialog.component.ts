import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-selector-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule
  ],
  template: `
    <p-dialog 
      [(visible)]="visible" 
      [modal]="true" 
      [style]="{width: '500px'}"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onHide()">
      
      <ng-template pTemplate="header">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-building"></i>
          <span class="font-bold">{{ mode === 'create' ? 'Add New Property' : 'Edit Property' }}</span>
        </div>
      </ng-template>

      <div class="flex flex-column gap-3">
        <div class="field">
          <label for="name" class="block mb-2">Property Name</label>
          <input 
            id="name" 
            type="text" 
            pInputText 
            [(ngModel)]="property.name" 
            placeholder="Enter property name">
        </div>

        <div class="field">
          <label for="address" class="block mb-2">Address</label>
          <input 
            id="address" 
            type="text" 
            pInputText 
            [(ngModel)]="property.address" 
            placeholder="Enter property address">
        </div>

        <div class="field">
          <label for="type" class="block mb-2">Property Type</label>
          <p-dropdown
            id="type"
            [options]="propertyTypes"
            [(ngModel)]="property.type"
            optionLabel="label"
            optionValue="value"
            placeholder="Select property type">
          </p-dropdown>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-content-end gap-2">
          <p-button 
            label="Cancel" 
            icon="pi pi-times" 
            (onClick)="visible = false"
            styleClass="p-button-text">
          </p-button>
          
          <p-button 
            [label]="mode === 'create' ? 'Create' : 'Update'" 
            icon="pi pi-check" 
            (onClick)="saveProperty()"
            [loading]="loading">
          </p-button>
        </div>
      </ng-template>
    </p-dialog>
  `
})
export class PropertySelectorDialogComponent {
  visible = false;
  loading = false;
  mode: 'create' | 'edit' = 'create';
  property: Property = {
    id: '',
    name: '',
    address: '',
    type: 'apartment',
    totalRooms: 0,
    occupiedRooms: 0,
    imageUrl: ''
  };

  propertyTypes = [
    { label: 'Apartment', value: 'apartment' },
    { label: 'House', value: 'house' },
    { label: 'Villa', value: 'villa' },
    { label: 'PG', value: 'pg' }
  ];

  constructor(private propertyService: PropertyService) {}

  show(mode: 'create' | 'edit', property?: Property): void {
    this.mode = mode;
    if (property) {
      this.property = { ...property };
    } else {
      this.property = {
        id: '',
        name: '',
        address: '',
        type: 'apartment',
        totalRooms: 0,
        occupiedRooms: 0,
        imageUrl: ''
      };
    }
    this.visible = true;
  }

  saveProperty(): void {
    this.loading = true;
    if (this.mode === 'create') {
      this.propertyService.createProperty(this.property).subscribe({
        next: () => {
          this.visible = false;
          this.loading = false;
        },
        error: (error: Error) => {
          console.error('Error creating property:', error);
          this.loading = false;
        }
      });
    } else {
      this.propertyService.updateProperty(this.property).subscribe({
        next: () => {
          this.visible = false;
          this.loading = false;
        },
        error: (error: Error) => {
          console.error('Error updating property:', error);
          this.loading = false;
        }
      });
    }
  }

  onHide(): void {
    this.property = {
      id: '',
      name: '',
      address: '',
      type: 'apartment',
      totalRooms: 0,
      occupiedRooms: 0,
      imageUrl: ''
    };
  }
} 