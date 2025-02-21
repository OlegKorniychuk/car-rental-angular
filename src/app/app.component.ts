import { Component } from '@angular/core';
import { CarListComponent } from './cars/car-list/car-list.component';
import { FooterComponent } from "./layout/footer/footer.component";
import { HeaderComponent } from './layout/header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'car-rental-angular';
}
