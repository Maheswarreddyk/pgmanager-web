import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  getMonthlyRevenue(): Observable<number> {
    // TODO: Replace with actual API call
    return of(150000);
  }
} 