import { Component, OnInit } from '@angular/core';
import { CurrencyService, CurrencyRate } from '../../services/currency.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-currency-rates',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rates-table">
      <table>
        <thead>
          <tr>
            <th>Waluta</th>
            <th>Kod</th>
            <th>Kurs</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let rate of rates">
            <td>{{ rate.name }}</td>
            <td>{{ rate.code }}</td>
            <td>{{ rate.rate }}</td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="error">
        {{ error }}
      </div>
    </div>
  `,
  styles: ``
})
export class CurrencyRatesComponent implements OnInit {
  rates: CurrencyRate[] = [];
  error: string = '';

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.loadRates();
  }

  loadRates(): void {
    this.currencyService.getCurrentRates().subscribe({
      next: (data) => {
        this.rates = data;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Nie udało się załadować danych z bazy.';
        console.log('Error loading rates:', err);
      }
    });
  }

  fetchLatestRates(): void {
    this.currencyService.fetchLatestRates().subscribe({
      next: () => {
        this.loadRates();
      },
      error: (err) => {
        this.error = 'Nie udało się pobrać danych z API.';
        console.log('Error fetching rates:', err);
      }
    });
  }
} 