import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { PropertyService } from '../../../../core/services/property.service';
import { Property, CreatePropertyDto } from '../../../../core/models/property.model';

@Component({
  selector: 'app-property-selector-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{ properties.length ? 'Select or Create Property' : 'Create Your First Property' }}</h2>
      
      <mat-dialog-content>
        <div *ngIf="properties.length" class="property-select-section">
          <h3>Select Existing Property</h3>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Choose Property</mat-label>
            <mat-select (selectionChange)="onPropertySelected($event.value)">
              <mat-option *ngFor="let property of properties" [value]="property">
                {{ property.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-divider class="my-4"></mat-divider>
          <h3>Or Create New Property</h3>
        </div>

        <form [formGroup]="propertyForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Property Name</mat-label>
            <input matInput formControlName="name" placeholder="Enter property name">
            <mat-error *ngIf="propertyForm.get('name')?.hasError('required')">
              Property name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Number of Floors</mat-label>
            <input matInput type="number" formControlName="totalFloors" placeholder="Enter number of floors">
            <mat-error *ngIf="propertyForm.get('totalFloors')?.hasError('required')">
              Number of floors is required
            </mat-error>
            <mat-error *ngIf="propertyForm.get('totalFloors')?.hasError('min')">
              Must be at least 1 floor
            </mat-error>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()" *ngIf="properties.length">Cancel</button>
        <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="propertyForm.invalid">
          Create Property
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 1rem;
      min-width: 400px;
    }

    .full-width {
      width: 100%;
    }

    .my-4 {
      margin: 2rem 0;
    }

    h3 {
      margin-bottom: 1rem;
      color: #666;
    }

    .property-select-section {
      margin-bottom: 2rem;
    }
  `]
})
export class PropertySelectorDialogComponent implements OnInit {
  propertyForm: FormGroup;
  properties: Property[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PropertySelectorDialogComponent>,
    private propertyService: PropertyService
  ) {
    this.propertyForm = this.fb.group({
      name: ['', Validators.required],
      totalFloors: ['', [Validators.required, Validators.min(1)]]
    });
  }

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

  onPropertySelected(property: Property) {
    this.dialogRef.close({ action: 'select', property });
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      const newProperty: CreatePropertyDto = {
        name: this.propertyForm.value.name,
        totalFloors: this.propertyForm.value.totalFloors
      };
      this.propertyService.createProperty(newProperty).subscribe({
        next: (property) => {
          this.dialogRef.close({ action: 'create', property });
        },
        error: (error) => {
          console.error('Error creating property:', error);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 