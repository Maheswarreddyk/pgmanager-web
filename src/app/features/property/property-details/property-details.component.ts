import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoomService, Room } from '../../../core/services/room.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AddRoomDialogComponent } from './add-room-dialog/add-room-dialog.component';

interface FloorRooms {
  floor: number;
  rooms: Room[];
  roomCount: number;
}

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatDialogModule
  ]
})
export class PropertyDetailsComponent implements OnInit {
  propertyId: string = '';
  floors: FloorRooms[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.propertyId = params['id'];
      this.loadRooms();
    });
  }

  loadRooms() {
    this.roomService.getRoomsByPropertyId(this.propertyId).subscribe(rooms => {
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
          rooms,
          roomCount: rooms.length
        }))
        .sort((a, b) => a.floor - b.floor);
    });
  }

  openAddRoomDialog() {
    const dialogRef = this.dialog.open(AddRoomDialogComponent, {
      width: '500px',
      data: { propertyId: this.propertyId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRooms();
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