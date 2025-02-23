import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, distinctUntilChanged, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';


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
    return this.http
      .post<LoginResponse>(`${API_URL}/signup`, credentials)
      .pipe(tap((resp) => {
        this.jwt.setToken(resp.accessToken);
        this.jwt.setRefresh(resp.refreshToken);
        this.userDataSubject.next(resp.data.client);
      }));
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
        },
        error: (error) => {
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
    console.log('getCurrentUser called');
    return this.http.get<UserResponse>(`${API_URL}/clients/me`).pipe(
      tap((resp) => this.userDataSubject.next(resp.data.client)),
      map((resp) => resp.data.client)
    )
  }
}
