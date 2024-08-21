import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { ApiBaseImageUrl, ApiBaseUrl } from '../constants';
import { UploadResponseModel, UserModel } from './app.models';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {


  constructor(private httpClient: HttpClient) {
  }


  loadAllData() {
    const url = ApiBaseUrl + '/Excel';
    const errorMessage = 'Failed to fetch data!';

    return this.fetchData<UserModel[]>(url, errorMessage)
  }


  createProduct(formData: FormData) {
    const url = ApiBaseUrl + '/Product';
    const errorMessage = 'Failed to create product!';
    return this._postData<FormData, UploadResponseModel>(url, formData, errorMessage);
  }


  private _postData<T1, T2>(url: string, requestData: T1, errorMessage: string) {
    return this.httpClient.post<T2>(url, requestData).pipe(
      catchError((error) => {
        return throwError(() => new Error(errorMessage))
      })
    )
  }



  private _deleteData(url: string, errorMessage: string) {
    return this.httpClient.delete(url).pipe(
      catchError((error) => {
        return throwError(() => new Error(errorMessage))
      })
    )
  }

  private fetchData<T1>(url: string, errorMessage: string) {
    return this.httpClient.get<T1>(url).pipe(
      catchError((error) => {
        return throwError(() => new Error(errorMessage))
      })
    )
  }
}
