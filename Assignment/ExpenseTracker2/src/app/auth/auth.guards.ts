import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

//contains guard functions to authenticate


export const isNotAuthenticatedGuard: CanActivateFn = (route, segments) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  return !authService.isAuthenticated();
};


export const isAuthenticatedGuard: CanActivateFn = (route, segments) => {
  const authService = inject(AuthService)

  const router = inject(Router)

  if (!authService.isAuthenticated()) {

    router.navigate(['/login']);

    return false;
  }
  return authService.isAuthenticated();
}
