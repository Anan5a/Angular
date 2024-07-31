import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ErrorService } from '../shared/error/error.service';
import { CreateUserRequestModel, UserLoginRequestModel, UserLoginResponseModel, UserResponseModel } from './users.models';
import { catchError, tap, throwError } from 'rxjs';
import { ApiBaseUrl } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = signal<UserLoginResponseModel | null>(null);

  constructor(private httpClient: HttpClient, private errorService: ErrorService) { }

  get user() {
    return this._user.asReadonly()
  }


  signup(formData: CreateUserRequestModel) {
    const url = ApiBaseUrl + '/User';
    const errorMessage = 'Failed to create user!';

    return this._postData<CreateUserRequestModel, UserResponseModel>(url, formData, errorMessage)

  }
  login(formData: UserLoginRequestModel) {
    const url = ApiBaseUrl + '/User/login';
    const errorMessage = 'Failed to login user!';
    return this._postData<UserLoginRequestModel, UserLoginResponseModel>(url, formData, errorMessage).pipe(
      tap({
        next: (response) => {
          this._user.set(response)
        }
      })
    )


  }
  private _postData<T1, T2>(url: string, requestData: T1, errorMessage: string) {
    return this.httpClient.post<T2>(url, requestData).pipe(
      catchError((error) => {
        this.errorService.showError(errorMessage);
        return throwError(() => new Error(errorMessage))
      })
    )
  }

  private _fetchUser(url: string, errorMessage: string) {
    return this.httpClient.get<UserResponseModel[]>(url).pipe(
      catchError((error) => {
        this.errorService.showError(errorMessage);
        return throwError(() => new Error(errorMessage))
      })
    )
  }

  store() {
    //stores the user in the localstorage
  }


}
