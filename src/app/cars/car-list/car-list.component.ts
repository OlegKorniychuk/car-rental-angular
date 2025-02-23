import { Component, OnInit } from '@angular/core';
import { Car } from '../car.model';
import { NgFor, NgIf, NgSwitch } from '@angular/common';
import { CarService } from '../car.service';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserService } from '../../auth/services/user.service';

@Component({
  selector: 'app-car-list',
  imports: [NgFor, NgIf, RouterModule],
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.scss'
})
export class CarListComponent implements OnInit {
  public cars: Car[] = [];
  public isLoading: boolean = true;
  public error: string | null = null;

  constructor(
    private readonly carService: CarService,
  ) { }

  ngOnInit(): void {
    this.fetchCars();
  }

  public fetchCars(): void {
    this.carService.getCars().subscribe({
      next: (data) => {
        this.cars = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching cars:', err);
        this.error = 'Failed to load cars.';
        this.isLoading = false;
      }
    })
  }
}
