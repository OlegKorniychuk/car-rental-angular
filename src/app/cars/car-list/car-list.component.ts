import { Component } from '@angular/core';
import { Car } from '../car.model';
import { NgFor, NgIf, NgSwitch } from '@angular/common';
import { FooterComponent } from '../../layout/footer/footer.component';
import { HeaderComponent } from '../../layout/header/header.component';

@Component({
  selector: 'app-car-list',
  imports: [NgFor, NgIf],
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.scss'
})
export class CarListComponent {
  public carList: Car[] = [
    {
      _id: "67a64441f357fbd25b3e8be1",
      make: "2017 Suzuki Jimmy",
      type: "SUV",
      price: 45000,
      rentPerDay: 184,
      productionYear: 2017,
      createdAt: "2025-02-07T17:34:57.719Z",
      updatedAt: "2025-02-18T20:23:26.942Z",
      isAvailable: true
    },
    {
      _id: "67a64441f357fbd25b3e8be2",
      make: "2018 Suzuki Jimmy",
      type: "SUV",
      price: 45000,
      rentPerDay: 192,
      productionYear: 2018,
      createdAt: "2025-02-07T17:34:57.719Z",
      updatedAt: "2025-02-18T20:23:26.942Z",
      isAvailable: false
    }
  ];
}
