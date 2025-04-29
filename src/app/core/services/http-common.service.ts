import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpCommonService {
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  get<T>(url: string, options?: { params?: HttpParams }): Observable<T> {
    return this.http.get<T>(url, { 
      headers: this.getAuthHeaders(),
      params: options?.params
    });
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body, { headers: this.getAuthHeaders() });
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body, { headers: this.getAuthHeaders() });
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url, { headers: this.getAuthHeaders() });
  }
} 