import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subscription, tap } from 'rxjs';
import { JwtService } from './jwt.service';

const API_URL = 'http://localhost:3000/api';

export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

interface LoginResponse {
  status: string;
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public isAuthorized: boolean = false;

  constructor(
    private readonly http: HttpClient,
    private readonly jwt: JwtService,
  ) { };

  public login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_URL}/login`, credentials)
      .pipe(tap((resp) => {
        this.jwt.setToken(resp.accessToken);
        this.jwt.setRefresh(resp.refreshToken);
        this.isAuthorized = true;
      }));
  }

  public logout(): void {
    this.jwt.deleteToken();
    this.isAuthorized = false;
  }

  public refresh(refresh: string): Observable<{ status: string, accessToken: string }> {
    return this.http
      .post<LoginResponse>(`${API_URL}/refresh`, { refreshToken: refresh })
      .pipe(tap((resp) => {
        this.jwt.setToken(resp.accessToken);
        this.isAuthorized = true;
      }));
  }
}
