import { inject } from "@angular/core";
import { CanActivate, CanActivateFn } from "@angular/router";
import { AuthService } from "./auth.service";
import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

//contains guard functions to authenticate
export const isAdminGuard: CanActivateFn = (route, segments) => {
  const authService = inject(AuthService)
  return authService.isAdmin();
}

export const isNotAuthenticatedGuard: CanActivateFn = (route, segments) => {
  const authService = inject(AuthService)
  return !authService.isAuthenticated();
}


export const isAuthenticatedGuard: CanActivateFn = (route, segments) => {
  const authService = inject(AuthService)
  return authService.isAuthenticated();
}

//////////// Interceptors ////////////////
export const injectAuthorizationHeaderInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService)

  if (authService.isAuthenticated()) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authService.token()}`
    });
    const reqWithHeader = req.clone({
      headers: headers
    });

    return next(reqWithHeader);

  }
  return next(req);
}
