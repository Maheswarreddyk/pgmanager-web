import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Property } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private properties: Property[] = [
    {
      id: '1',
      name: 'Sunrise Apartments',
      address: '123 Main St, Bangalore',
      type: 'apartment',
      totalRooms: 20,
      occupiedRooms: 15,
      imageUrl: 'https://example.com/sunrise.jpg'
    },
    {
      id: '2',
      name: 'Green Valley PG',
      address: '456 Park Ave, Bangalore',
      type: 'pg',
      totalRooms: 15,
      occupiedRooms: 12,
      imageUrl: 'https://example.com/greenvalley.jpg'
    }
  ];

  getProperties(): Observable<Property[]> {
    return of(this.properties);
  }

  createProperty(property: Property): Observable<Property> {
    property.id = (this.properties.length + 1).toString();
    this.properties.push(property);
    return of(property);
  }

  updateProperty(property: Property): Observable<Property> {
    const index = this.properties.findIndex(p => p.id === property.id);
    if (index !== -1) {
      this.properties[index] = property;
    }
    return of(property);
  }
} 