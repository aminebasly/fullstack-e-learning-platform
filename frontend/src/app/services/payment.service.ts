import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  checkout(paymentData: any): Observable<string> {
    // Retourne le HTML du checkout Iyzipay
    return this.http.post(`${environment.apiUrl}/payment/checkout`, paymentData, {
      responseType: 'text', // Important ! on attend un string
      withCredentials: true
    });
  }
}
