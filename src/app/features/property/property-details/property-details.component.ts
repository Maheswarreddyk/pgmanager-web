import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoomService, Room } from '../../../core/services/room.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { AddRoomDialogComponent } from './add-room-dialog/add-room-dialog.component';
import { AccordionModule } from 'primeng/accordion';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface FloorRooms {
  floor: number;
  rooms: Room[];
  roomCount: number;
}

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    AccordionModule,
    ToastModule
  ],
  providers: [DialogService, MessageService]
})
export class PropertyDetailsComponent implements OnInit {
  propertyId: string = '';
  floors: FloorRooms[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.propertyId = params['id'];
      this.loadRooms();
    });
  }

  loadRooms() {
    this.roomService.getRoomsByPropertyId(this.propertyId).subscribe({
      next: (rooms) => {
        // Group rooms by floor
        const floorMap = new Map<number, Room[]>();
        rooms.forEach(room => {
          if (!floorMap.has(room.floor)) {
            floorMap.set(room.floor, []);
          }
          floorMap.get(room.floor)?.push(room);
        });

        // Convert map to array and sort by floor number
        this.floors = Array.from(floorMap.entries())
          .map(([floor, rooms]) => ({
            floor,
            rooms: rooms.map(room => ({ ...room, hover: false })), // Add hover state
            roomCount: rooms.length
          }))
          .sort((a, b) => a.floor - b.floor);
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load rooms. Please try again.'
        });
      }
    });
  }

  openAddRoomDialog() {
    const ref = this.dialogService.open(AddRoomDialogComponent, {
      header: 'Add New Room',
      width: '500px',
      data: { propertyId: this.propertyId },
      contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
      baseZIndex: 10000
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadRooms();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Room added successfully'
        });
      }
    });
  }

  getOccupancyText(room: Room): string {
    return `${room.tenantsCount}/${room.roomCapacity} Occupied`;
  }

  getOccupancyClass(room: Room): string {
    const ratio = room.tenantsCount / room.roomCapacity;
    if (ratio === 1) return 'fully-occupied';
    if (ratio > 0) return 'partially-occupied';
    return 'vacant';
  }
} 