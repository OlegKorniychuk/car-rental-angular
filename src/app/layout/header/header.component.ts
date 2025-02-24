import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User, UserService } from '../../auth/services/user.service';
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-header',
  imports: [RouterModule, NgIf, MatToolbarModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  public userData: User | null = null;
  public isAuthenticated: boolean = false;

  constructor(
    private readonly userService: UserService,
  ) {

  }

  ngOnInit(): void {
    this.userService.isAuthenticated.subscribe(
      (value) => this.isAuthenticated = value
    );
    this.userService.userData.subscribe(
      (user) => this.userData = user
    );
  }

  public logOut(): void {
    this.userService.logout().subscribe();
  }
}
