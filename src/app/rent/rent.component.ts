import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User, UserService } from '../auth/services/user.service';
import { CarService } from '../cars/car.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-rent',
  imports: [ReactiveFormsModule, NgIf, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './rent.component.html',
  styleUrl: './rent.component.scss'
})
export class RentComponent implements OnInit {
  public carId: string | null = null;
  public userData: User | null = null;
  public error: string | null = null;

  public rentForm: FormGroup = new FormGroup({
    endDate: new FormControl('', [Validators.required, this.minDateValidator]),
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly carService: CarService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => this.carId = params.get('carId') || null
    );
    this.userService.userData.subscribe({
      next: (user) => this.userData = user,
      error: (error) => this.error = error
    })
  }

  public rentCar(): void {
    if (this.userData && this.carId) {
      this.carService.rentCar(this.userData.id, this.carId, this.rentForm.value.endDate).subscribe({
        next: () => this.router.navigate(['/profile']),
        error: (err) => this.error = err.error.message
      });
    } else {
      this.error = 'Could not rent car - user data or car ID is missing'
    }
  }

  private minDateValidator(control: FormControl): ValidationErrors | null {
    if (!control.value) return null;

    const today = new Date();
    today.setDate(today.getDate() + 1);

    const selectedDate = new Date(control.value);

    return selectedDate >= today ? null : { minDate: true };
  }
}
