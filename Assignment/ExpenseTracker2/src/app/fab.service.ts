import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FabService {
  isVisible = signal(false)
  icon = signal('add')
  action: WritableSignal<Function|undefined> = signal(() => console.log("Action to be performed"))

  constructor() { }
  setFab(isVisible: boolean, icon: string, action?: Function) {
    this.action.set(action)
    this.isVisible.set(isVisible)
    this.icon.set(icon)
  }
}
