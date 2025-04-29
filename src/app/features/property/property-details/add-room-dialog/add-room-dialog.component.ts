import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoomService } from '../../../../core/services/room.service';

enum FacilityType {
  None = 0,
  AC = 1,
  Geyser = 2,
  TV = 3
}

@Component({
  selector: 'app-add-room-dialog',
  template: `    
    <form [formGroup]="roomForm" (ngSubmit)="onSubmit()" class="p-fluid">
      <div class="flex flex-column gap-4">
        <div class="field">
          <label for="name" class="block text-900 font-medium mb-2">Room Number</label>
          <div class="p-input-icon-left w-full">
            <i class="pi pi-home"></i>
            <input 
              id="name" 
              type="text" 
              pInputText 
              formControlName="name" 
              placeholder="e.g. 101"
              class="w-full pl-5"
              [ngClass]="{'ng-invalid ng-dirty': roomForm.get('name')?.invalid && roomForm.get('name')?.touched}">
          </div>
          <small class="p-error block" *ngIf="roomForm.get('name')?.invalid && roomForm.get('name')?.touched">
            Room number is required
          </small>
        </div>

        <div class="field">
          <label for="floor" class="block text-900 font-medium mb-2">Floor Number</label>
          <div class="p-input-icon-left w-full">
            <i class="pi pi-building"></i>
            <p-inputNumber 
              id="floor" 
              formControlName="floor" 
              [showButtons]="true" 
              [min]="1"
              placeholder="e.g. 1"
              styleClass="w-full">
            </p-inputNumber>
          </div>
          <small class="p-error block" *ngIf="roomForm.get('floor')?.invalid && roomForm.get('floor')?.touched">
            Floor number must be greater than 0
          </small>
        </div>

        <div class="field">
          <label for="roomCapacity" class="block text-900 font-medium mb-2">Room Capacity</label>
          <div class="p-input-icon-left w-full">
            <i class="pi pi-users"></i>
            <p-inputNumber 
              id="roomCapacity" 
              formControlName="roomCapacity" 
              [showButtons]="true" 
              [min]="1"
              placeholder="e.g. 2"
              styleClass="w-full">
            </p-inputNumber>
          </div>
          <small class="p-error block" *ngIf="roomForm.get('roomCapacity')?.invalid && roomForm.get('roomCapacity')?.touched">
            Room capacity must be greater than 0
          </small>
        </div>

        <div class="field">
          <label for="amountPerHead" class="block text-900 font-medium mb-2">Amount per Head</label>
          <div class="p-input-icon-left w-full">
            <i class="pi pi-money-bill"></i>
            <p-inputNumber 
              id="amountPerHead" 
              formControlName="amountPerHead" 
              mode="currency" 
              currency="INR"
              [min]="0"
              placeholder="e.g. 5000"
              styleClass="w-full">
            </p-inputNumber>
          </div>
          <small class="p-error block" *ngIf="roomForm.get('amountPerHead')?.invalid && roomForm.get('amountPerHead')?.touched">
            Amount must be greater than or equal to 0
          </small>
        </div>

        <div class="field">
          <label class="block text-900 font-medium mb-3">Facilities</label>
          <div class="flex flex-wrap gap-4">
            <div *ngFor="let facility of facilities" class="flex align-items-center">
              <p-checkbox
                [inputId]="'facility_' + facility.id"
                [value]="facility.id"
                [name]="'facility_' + facility.id"
                [(ngModel)]="selectedFacilities"
                [ngModelOptions]="{standalone: true}">
              </p-checkbox>
              <label [for]="'facility_' + facility.id" class="ml-2 cursor-pointer">{{facility.name}}</label>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-content-end gap-2 mt-4">
        <p-button 
          label="Cancel" 
          icon="pi pi-times" 
          (onClick)="onCancel()"
          styleClass="p-button-text">
        </p-button>
        <p-button 
          label="Add Room" 
          icon="pi pi-check" 
          type="submit"
          [loading]="isSubmitting"
          [disabled]="!roomForm.valid || isSubmitting">
        </p-button>
      </div>
    </form>
  `,
  styles: [`
    :host ::ng-deep {
      .p-inputnumber {
        width: 100%;
      }
      
      .p-inputnumber-input {
        width: 100%;
        padding-left: 2.5rem !important;
      }
      
      .p-input-icon-left {
        position: relative;
        display: block;
        
        i {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
        }
        
        .p-inputtext {
          padding-left: 2.5rem;
        }
      }
      
      .p-checkbox {
        display: inline-flex;
        cursor: pointer;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    CheckboxModule
  ]
})
export class AddRoomDialogComponent {
  roomForm: FormGroup;
  facilities = [
    { id: FacilityType.AC, name: 'AC' },
    { id: FacilityType.Geyser, name: 'Geyser' },
    { id: FacilityType.TV, name: 'TV' }
  ];
  selectedFacilities: number[] = [];
  isSubmitting = false;

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private roomService: RoomService
  ) {
    this.roomForm = this.fb.group({
      name: ['', Validators.required],
      floor: [1, [Validators.required, Validators.min(1)]],
      roomCapacity: [1, [Validators.required, Validators.min(1)]],
      amountPerHead: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit() {
    if (this.roomForm.valid) {
      this.isSubmitting = true;
      const formValue = this.roomForm.value;
      const request = {
        propertyId: this.config.data.propertyId,
        name: formValue.name,
        sharingType: formValue.roomCapacity > 1 ? 1 : 0, // 1 for shared, 0 for single
        floor: formValue.floor,
        amountPerHead: formValue.amountPerHead,
        facilityTypes: this.selectedFacilities
      };

      this.roomService.createRoom(request).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creating room:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 