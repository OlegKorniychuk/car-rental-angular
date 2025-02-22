import { inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";
import { JwtService } from "./services/jwt.service";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(JwtService).getToken();

  const headers: { Authorization: string } | {} = token ? { Authorization: `Bearer ${token}` } : {};
  const request = req.clone({ setHeaders: headers });
  return next(request);
};