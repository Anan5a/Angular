import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { ApiBaseImageUrl, ApiBaseUrl } from '../constants';
import { UploadResponseModel, UserModel } from './app.models';
import { FormGroup } from '@angular/forms';

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


  uploadFile(formData: FormData) {
    const url = ApiBaseUrl + '/Excel';
    const errorMessage = 'Failed to upload file!';
    return this._postData<FormData, UploadResponseModel>(url, formData, errorMessage);
  }

  exportAll() {
    const url = ApiBaseUrl + '/Excel/Export';
    const errorMessage = 'Failed to export file!';
    return this._postData<null, any>(url, null, errorMessage, {
      responseType: 'blob'
    });
  }
  private _postData<T1, T2>(url: string, requestData: T1, errorMessage: string, options = {}) {
    return this.httpClient.post<T2>(url, requestData, options).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error?.message || errorMessage))
      })
    )
  }



  private _deleteData(url: string, errorMessage: string) {
    return this.httpClient.delete(url).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error?.message || errorMessage))
      })
    )
  }

  private fetchData<T1>(url: string, errorMessage: string) {
    return this.httpClient.get<T1>(url).pipe(
      catchError((error) => {
        console.log(error)
        return throwError(() => new Error(error.error?.message || errorMessage))
      })
    )
  }
}
