import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './components/home-page.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, HomePageComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'currency-rates';
}
