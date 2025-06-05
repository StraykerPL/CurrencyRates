import { Component, OnInit } from '@angular/core';
import { CurrencyService, CurrencyRate } from '../services/currency.service';
import { CommonModule } from '@angular/common';
import { CurrencyRatesComponent } from './currency-rates.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, CurrencyRatesComponent, FormsModule],
  template: `
    <div class="home-page">
      <header class="header">
        Currency Rates - Narodowy Bank Polski
      </header>
      <nav class="filter">
          <label for="date">Data początkowa:</label>
          <input type="date" id="date" name="date" [(ngModel)]="startDate">
          <label for="periods">Wyszukuj:</label>
          <select name="periods" [(ngModel)]="selectedPeriod">
              <option value="years">Lata</option>
              <option value="quarters">Kwartały</option>
              <option value="months">Miesiące</option>
              <option value="days">Dni</option>
          </select>
          <button (click)="getFilteredData()">Pokaż</button>
      </nav>
      <section class="data-display">
          <app-currency-rates [ratesInput]="rates" [errorMsgInput]="error"></app-currency-rates>
      </section>
    </div>
  `,
  styles: ``
})
export class HomePageComponent implements OnInit {
  rates: CurrencyRate[] = [];
  error: string = '';
  startDate: string = '';
  selectedPeriod: string = 'days';

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

  getFilteredData(): void {
    if (!this.startDate) {
      this.error = 'Wybierz datę początkową.';
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date();

    switch (this.selectedPeriod) {
      case 'years':
        end.setFullYear(start.getFullYear() + 1);
        break;
      case 'quarters':
        end.setMonth(start.getMonth() + 3);
        break;
      case 'months':
        end.setMonth(start.getMonth() + 1);
        break;
      case 'days':
        end.setDate(start.getDate() + 1);
        break;
    }

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    this.currencyService.getHistoricalRates(
      formatDate(start),
      formatDate(end)
    ).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.rates = data[0].rates.map((rate: any) => ({
            name: rate.currency,
            code: rate.code,
            rate: rate.mid
          }));
          this.error = '';
        } else {
          this.error = 'Brak danych dla wybranego okresu.';
        }
      },
      error: (err) => {
        this.error = 'Nie udało się pobrać danych z API.';
        console.log('Error fetching rates:', err);
      }
    });
  }
} 