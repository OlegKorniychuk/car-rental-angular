import { Routes } from '@angular/router';
import { CarListComponent } from './cars/car-list/car-list.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: CarListComponent,
    title: 'Home'
  },
  {
    path: 'client-profile',
    component: ProfileComponent,
    title: 'Profile'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Log In'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
