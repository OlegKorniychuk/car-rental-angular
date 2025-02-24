import { APP_INITIALIZER, ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './auth/jwt.interceptor';
import { JwtService } from './auth/services/jwt.service';
import { UserService } from './auth/services/user.service';
import { EMPTY } from 'rxjs';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export function initAuth(jwtService: JwtService, userService: UserService) {
  return () => {
    return (jwtService.getToken() ? userService.getCurrentUser() : EMPTY)
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
    provideAppInitializer(() => {
      const jwtService = inject(JwtService);
      const userService = inject(UserService);
      return (jwtService.getToken() ? userService.getCurrentUser() : EMPTY)
    }), provideAnimationsAsync()
  ]
};
