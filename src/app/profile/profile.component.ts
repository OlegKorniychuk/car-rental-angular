import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../auth/services/user.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  public userData: User | null = null;
  public isLoading: boolean = true;
  public error: string | null = null;

  constructor(
    private readonly userService: UserService,
  ) { }

  ngOnInit(): void {
    this.fetchClient();
  }

  public fetchClient(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.userData = user;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load profile info.';
        this.isLoading = false;
      }
    })
  }
}
