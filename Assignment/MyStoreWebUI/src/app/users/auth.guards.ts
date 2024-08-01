import { inject } from "@angular/core";
import { CanActivate, CanActivateFn } from "@angular/router";
import { AuthService } from "./auth.service";

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

