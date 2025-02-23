import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  public getToken(): string | undefined {
    return window.localStorage['jwtToken'];
  }

  public getRefresh(): string | undefined {
    return window.localStorage['refreshToken'];
  }

  public setToken(token: string): void {
    window.localStorage['jwtToken'] = token;
  }

  public setRefresh(refresh: string): void {
    window.localStorage['refreshToken'] = refresh;
  }

  public deleteToken(): void {
    window.localStorage.removeItem('jwtToken');
    window.localStorage.removeItem('refreshToken');
  }
}
