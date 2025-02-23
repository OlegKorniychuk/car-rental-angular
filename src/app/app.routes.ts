import { Routes } from '@angular/router';
import { CarListComponent } from './cars/car-list/car-list.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserService } from './auth/services/user.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { RentComponent } from './rent/rent.component';

export const routes: Routes = [
  {
    path: '',
    component: CarListComponent,
    title: 'Home'
  },
  {
    path: 'client-profile',
    component: ProfileComponent,
    title: 'Profile',
    canActivate: [
      () => inject(UserService).isAuthenticated.pipe(map((isAuth) => !!isAuth)),
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Log In',
    canActivate: [
      () => inject(UserService).isAuthenticated.pipe(map((isAuth) => !isAuth)),
    ],
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register',
    canActivate: [
      () => inject(UserService).isAuthenticated.pipe(map((isAuth) => !isAuth)),
    ],
  },
  {
    path: 'rent/:carId',
    component: RentComponent,
    title: 'Rent a car',
    canActivate: [
      () => inject(UserService).isAuthenticated.pipe(map((isAuth) => !!isAuth)),
    ],
  },
  {
    path: '**',
    redirectTo: ''
  }
];
