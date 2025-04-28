import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
  templateUrl: './add-room-dialog.component.html',
  styleUrls: ['./add-room-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule
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

  constructor(
    private dialogRef: MatDialogRef<AddRoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { propertyId: string },
    private fb: FormBuilder,
    private roomService: RoomService
  ) {
    this.roomForm = this.fb.group({
      name: ['', Validators.required],
      floor: ['', [Validators.required, Validators.min(1)]],
      roomCapacity: ['', [Validators.required, Validators.min(1)]],
      amountPerHead: ['', [Validators.required, Validators.min(0)]]
    });
  }

  toggleFacility(facilityId: number): void {
    const index = this.selectedFacilities.indexOf(facilityId);
    if (index === -1) {
      this.selectedFacilities.push(facilityId);
    } else {
      this.selectedFacilities.splice(index, 1);
    }
  }

  onSubmit() {
    if (this.roomForm.valid) {
      const formValue = this.roomForm.value;
      const request = {
        propertyId: this.data.propertyId,
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
          // Handle error (show message to user)
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 