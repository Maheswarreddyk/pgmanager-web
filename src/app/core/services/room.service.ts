import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpCommonService } from './http-common.service';

export interface Room {
  roomId: string;
  name: string;
  roomCapacity: number;
  floor: number;
  amountPerHead: number;
  facilityTypeIds: number[];
  tenantsCount: number;
  hover?: boolean;
}

export interface CreateRoomRequest {
  propertyId: string;
  name: string;
  sharingType: number;
  floor: number;
  amountPerHead: number;
  facilityTypes: number[];
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = environment.apiUrl;

  constructor(private httpCommon: HttpCommonService) { }

  getRoomsByPropertyId(propertyId: string): Observable<Room[]> {
    return this.httpCommon.get<Room[]>(`${this.apiUrl}/Room/property/${propertyId}/details`);
  }

  createRoom(request: CreateRoomRequest): Observable<any> {
    return this.httpCommon.post<any>(`${this.apiUrl}/Room`, request);
  }
} 