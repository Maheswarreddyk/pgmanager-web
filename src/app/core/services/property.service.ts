import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Property, PropertyStats, CreatePropertyDto } from '../models/property.model';
import { environment } from '../../../environments/environment';
import { HttpCommonService } from './http-common.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private readonly API_URL = `${environment.apiUrl}/Property`;
  private selectedPropertySubject = new BehaviorSubject<Property | null>(null);
  public selectedProperty$ = this.selectedPropertySubject.asObservable();

  constructor(private httpCommon: HttpCommonService) {
    const savedProperty = localStorage.getItem('selectedProperty');
    if (savedProperty) {
      try {
        const property = JSON.parse(savedProperty);
        if (property && typeof property === 'object') {
          this.selectedPropertySubject.next(property);
        } else {
          localStorage.removeItem('selectedProperty');
        }
      } catch (error) {
        console.error('Error parsing saved property:', error);
        localStorage.removeItem('selectedProperty');
      }
    }
  }

  getProperties(): Observable<Property[]> {
    console.log('Getting properties with auth header');
    return this.httpCommon.get<Property[]>(`${this.API_URL}/details`);
  }

  getProperty(id: string): Observable<Property> {
    return this.httpCommon.get<Property>(`${this.API_URL}/${id}`);
  }

  createProperty(property: CreatePropertyDto): Observable<Property> {
    return this.httpCommon.post<Property>(this.API_URL, property);
  }

  selectProperty(property: Property) {
    localStorage.setItem('selectedProperty', JSON.stringify(property));
    this.selectedPropertySubject.next(property);
  }

  getSelectedProperty(): Property | null {
    return this.selectedPropertySubject.value;
  }

  // Using dummy data for dashboard statistics
  getPropertyStats(propertyId: string, startDate: Date, endDate: Date): Observable<PropertyStats> {
    return new Observable(observer => {
      observer.next({
        totalRooms: 50,
        occupiedRooms: 42,
        vacantRooms: 8,
        totalTenants: 45,
        totalRevenue: 250000,
        collectedRent: 175000,
        pendingRent: 75000,
        totalExpenses: 75000,
        netIncome: 175000,
        occupancyRate: 84,
        revenueByFloor: [
          { floor: 1, revenue: 62500 },
          { floor: 2, revenue: 58000 },
          { floor: 3, revenue: 65000 },
          { floor: 4, revenue: 64500 }
        ],
        expensesByCategory: [
          { category: 'Maintenance', amount: 25000 },
          { category: 'Utilities', amount: 30000 },
          { category: 'Staff', amount: 15000 },
          { category: 'Others', amount: 5000 }
        ]
      });
    });
  }
} 