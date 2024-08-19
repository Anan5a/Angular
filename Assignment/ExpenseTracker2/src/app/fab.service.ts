import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FabService {
  isVisible = computed(() => this.authService.isAuthenticated())
  icon = signal('add')
  action: WritableSignal<Function | undefined> = signal(() => console.log("Action to be performed"))

  constructor(private authService: AuthService) { }
  
}
