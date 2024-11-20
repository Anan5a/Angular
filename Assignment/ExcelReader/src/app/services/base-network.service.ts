import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseNetworkService {
  private toastrService = inject(ToastrService);
  constructor(private httpClient: HttpClient) {}

  protected get<T>(url: string, errorMessage: string): Observable<T> {
    return this.httpClient.get<T>(url).pipe(
      catchError((error) => {
        this.toastrService.error(error.error?.message || errorMessage);
        return throwError(
          () => new Error(error.error?.message || errorMessage)
        );
      })
    );
  }

  protected post<TRequest, TResponse>(
    url: string,
    requestData: TRequest,
    errorMessage: string,
    options = {}
  ): Observable<TResponse> {
    return this.httpClient.post<TResponse>(url, requestData, options).pipe(
      catchError((error) => {
        this.toastrService.error(error.error?.message || errorMessage);
        return throwError(
          () => new Error(error.error?.message || errorMessage)
        );
      })
    );
  }

  protected delete<RT>(url: string, errorMessage: string): Observable<RT> {
    return this.httpClient.delete<RT>(url).pipe(
      catchError((error) => {
        this.toastrService.error(error.error?.message || errorMessage);
        return throwError(
          () => new Error(error.error?.message || errorMessage)
        );
      })
    );
  }
}
