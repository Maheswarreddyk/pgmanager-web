import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Property, PropertyStats, CreatePropertyDto } from '../models/property.model';
import { environment } from '../../../environments/environment';
import { HttpCommonService } from './http-common.service';
import { HttpParams } from '@angular/common/http';

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
    return this.httpCommon.post<Property>(`${this.API_URL}/create`, property);
  }

  updateProperty(property: Property): Observable<Property> {
    return this.httpCommon.put<Property>(`${this.API_URL}/update/${property.id}`, property);
  }

  getPropertyById(id: string): Observable<Property> {
    return this.httpCommon.get<Property>(`${this.API_URL}/details/${id}`);
  }

  deleteProperty(id: string): Observable<void> {
    return this.httpCommon.delete<void>(`${this.API_URL}/delete/${id}`);
  }

  selectProperty(property: Property) {
    localStorage.setItem('selectedProperty', JSON.stringify(property));
    this.selectedPropertySubject.next(property);
  }

  getSelectedProperty(): Property | null {
    return this.selectedPropertySubject.value;
  }

  getPropertyStats(propertyId: string, startDate: Date, endDate: Date): Observable<PropertyStats> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.httpCommon.get<PropertyStats>(`${this.API_URL}/stats/${propertyId}`, { params });
  }
} 