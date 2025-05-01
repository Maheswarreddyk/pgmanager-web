import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateTenantDto, Tenant } from '../models/tenant.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private readonly API_URL = `${environment.apiUrl}/tenant`;

  constructor(private http: HttpClient) {}

  createTenant(data: CreateTenantDto): Observable<Tenant> {
    return this.http.post<Tenant>(`${this.API_URL}`, data);
  }

  getTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(`${this.API_URL}`);
  }
} 