import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingSpinnerService {
  private loadingState = signal(true)

  get isLoading() {
    return this.loadingState.asReadonly()
  }
  setState(state: boolean) {
    this.loadingState.set(state)
  }

}
