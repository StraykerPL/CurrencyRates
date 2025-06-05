import { Component } from '@angular/core';
import { CurrencyRatesComponent } from './components/currency-rates/currency-rates.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, CurrencyRatesComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'currency-rates';
}
