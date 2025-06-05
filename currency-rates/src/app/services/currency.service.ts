import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CurrencyRate {
  name: string;
  code: string;
  rate: number;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getCurrentRates(): Observable<CurrencyRate[]> {
    return this.http.get<CurrencyRate[]>(`${this.apiUrl}/currencies`);
  }

  getHistoricalRates(dateStart: string, dateEnd: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/currencies/${dateStart}/${dateEnd}`);
  }

  fetchLatestRates(): Observable<any> {
    return this.http.post(`${this.apiUrl}/currencies/fetch`, true);
  }
} 