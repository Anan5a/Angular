import { Injectable, signal, WritableSignal } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FabService {
  isVisible = signal(this.authService.isAuthenticated())
  icon = signal('add')
  action: WritableSignal<Function | undefined> = signal(() => console.log("Action to be performed"))

  constructor(private authService: AuthService) { }
  setFab(isVisible: boolean, icon: string, action?: Function) {
    this.action.set(action)
    this.isVisible.set(isVisible)
    this.icon.set(icon)
  }
}
