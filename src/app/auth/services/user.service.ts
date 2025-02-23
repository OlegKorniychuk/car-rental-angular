import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, distinctUntilChanged, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';
import { Car } from '../../cars/car.model';


const API_URL = 'http://localhost:3000/api';

export interface User {
  id: string;
  firstName: string;
  surname: string;
  middleName?: string;
  address: string;
  phoneNumber: string;
  regularDiscount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  accessToken: string;
  refreshToken: string;
  data: { client: User }
}

export interface UserResponse {
  status: string;
  data: { client: User };
}

export interface DetailedRental {
  id: string;
  carId: Car;
  clientId: string;
  rentalStartDate: string;
  rentalEndDate: string;
  createdAt: string;
  updatedAt: string;
  isOpen: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userDataSubject = new BehaviorSubject<User | null>(null);
  public userData: Observable<User | null> = this.userDataSubject.asObservable().pipe(distinctUntilChanged());
  public isAuthenticated = this.userDataSubject.pipe(map((user) => !!user));

  constructor(
    private readonly http: HttpClient,
    private readonly jwt: JwtService,
    private readonly router: Router
  ) { }

  public login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_URL}/login`, credentials)
      .pipe(
        tap((resp) => {
          this.jwt.setToken(resp.accessToken);
          this.jwt.setRefresh(resp.refreshToken);
          this.userDataSubject.next(resp.data.client);
        })
      );
  }

  public register(credentials: {
    firstName: string;
    surname: string;
    middleName?: string;
    address: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
  }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/signup`, credentials);
  }

  public logout(): Observable<{ status: string, data: null }> {
    return this.http.post<{ status: string, data: null }>(
      `${API_URL}/logout`,
      { refreshToken: this.jwt.getRefresh() }
    ).pipe(
      tap({
        next: () => {
          this.jwt.deleteToken();
          this.userDataSubject.next(null);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.jwt.deleteToken();
          this.userDataSubject.next(null);
          this.router.navigate(['/']);
          console.error('Server failed to delete refresh token');
        }
      })
    );
  }

  public refreshToken(): Observable<{ status: string, accessToken: string }> {
    const refreshToken = this.jwt.getRefresh();
    return this.http
      .post<LoginResponse>(`${API_URL}/refresh`, { refreshToken: refreshToken })
      .pipe(
        tap({
          next: (resp) => {
            this.jwt.setToken(resp.accessToken)
          },
          error: (error) => {
            this.jwt.deleteToken();
            this.userDataSubject.next(null);
          }
        })
      );
  }

  public getCurrentUser(): Observable<User> {
    return this.http.get<UserResponse>(`${API_URL}/clients/me`).pipe(
      map((resp) => resp.data.client),
      tap({
        next: (client) => this.userDataSubject.next(client),
        error: (error) => {
          console.log(error);
          if (error.status === 401) {
            this.jwt.deleteToken();
            this.userDataSubject.next(null);
          }
          this.router.navigate(['/home']);
        }
      }),
    )
  }

  public getUserRentals(): Observable<DetailedRental[]> {
    return this.userDataSubject.pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }
        return this.http.get<{ status: string, results: number, data: { rentals: DetailedRental[] } }>(
          `${API_URL}/clients/${user.id}/rentals`
        ).pipe(map(resp => resp.data.rentals));
      })
    );
  }

}
