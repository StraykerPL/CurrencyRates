import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyRate } from '../services/currency.service';

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
          <tr *ngFor="let rate of rates()">
            <td>{{ rate.name }}</td>
            <td>{{ rate.code }}</td>
            <td>{{ rate.rate }}</td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="errorMsg() != ''">
        {{ errorMsg() }}
      </div>
    </div>
  `,
  styles: ``
})
export class CurrencyRatesComponent {
  ratesInput = input.required<CurrencyRate[]>();
  errorMsgInput = input.required<string>();

  rates = computed(() => this.ratesInput());
  errorMsg = computed(() => this.errorMsgInput());
} 