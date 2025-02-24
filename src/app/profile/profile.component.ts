import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../auth/services/user.service';
import { DetailedRental } from '../auth/services/user.service';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  imports: [NgIf, NgFor, MatCardModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  public userData: User | null = null;
  public isUserLoading: boolean = true;

  public userRentals: DetailedRental[] = [];
  public isRentalsLoading: boolean = true;

  public error: string | null = null;

  constructor(
    private readonly userService: UserService,
  ) { }

  ngOnInit(): void {
    this.fetchClient();
    this.fetchRentals();
  }

  public fetchClient(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.userData = user;
        this.isUserLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load profile info.';
        this.isUserLoading = false;
      }
    })
  }

  public fetchRentals(): void {
    this.userService.getUserRentals().subscribe({
      next: (rentals) => {
        this.userRentals = rentals;
        this.isRentalsLoading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Could not load your rentals';
        this.isRentalsLoading = false;
      }
    })
  }
}
