import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private _error = signal('');
  //error message from server, must be set before calling showError() to get proper server sent error message
  serverError = signal<any | undefined>(null);
  error = this._error.asReadonly();

  showError(message: string) {
    const iMessage = this._internalServerMessage()
    console.log(iMessage)
    if (iMessage !== null) {
      this._error.set(iMessage);
    } else {
      this._error.set(message);
    }
  }

  clearError() {
    this._error.set('');
  }
  private _internalServerMessage() {
    if (typeof this.serverError() === 'undefined') {
      return null;
    }
    if (typeof this.serverError()?.error !== 'undefined' && typeof this.serverError()?.message !== 'undefined') {
      return this.serverError().message;
    }
    if (typeof this.serverError()?.errors !== 'undefined' && typeof this.serverError()?.title !== 'undefined') {
      return this.serverError().title;
    }
    return null;
  }
}
