import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Tenant } from '../models/tenant.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  getTenants(): Observable<Tenant[]> {
    // TODO: Replace with actual API call
    return of([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        propertyId: '1',
        roomNumber: '101',
        rentAmount: 15000,
        moveInDate: '2023-01-01'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '0987654321',
        propertyId: '2',
        roomNumber: '201',
        rentAmount: 12000,
        moveInDate: '2023-02-01'
      }
    ]);
  }
} 