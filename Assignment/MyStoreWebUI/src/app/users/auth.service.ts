import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { ErrorService } from '../shared/error/error.service';
import { CreateUserRequestModel, UserLoginRequestModel, UserLoginResponseModel, UserResponseModel } from './users.models';
import { catchError, tap, throwError } from 'rxjs';
import { ApiBaseUrl } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = signal<UserLoginResponseModel | null>(null);

  constructor(private httpClient: HttpClient, private errorService: ErrorService) {
  }

  get user() {
    this.getLocalUser()
    return this._user.asReadonly()
  }
  get isAuthenticated() {
    return computed(() => this._user() !== null)
  }
  get isAdmin() {
    return computed(() => this.isAuthenticated() && this._user()?.user.role?.roleName === 'Admin')
  }
  logout() {
    //erase tokens
    this.eraseUser()
  }
  token() {
    return this.user()?.token
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
          this.storeUser()
        }
      })
    )


  }
  private _postData<T1, T2>(url: string, requestData: T1, errorMessage: string) {
    return this.httpClient.post<T2>(url, requestData).pipe(
      catchError((error) => {
        this.errorService.serverError.set(error.error)
        this.errorService.showError(errorMessage);
        return throwError(() => new Error(errorMessage))
      })
    )
  }

  private _fetchUser(url: string, errorMessage: string) {
    return this.httpClient.get<UserResponseModel[]>(url).pipe(
      catchError((error) => {
        this.errorService.serverError.set(error.error)
        this.errorService.showError(errorMessage);
        return throwError(() => new Error(errorMessage))
      })
    )
  }

  private storeUser() {
    //stores the user in the localstorage
    window.localStorage.setItem('user-auth-data', JSON.stringify(this._user()))
  }
  private eraseUser() {
    //removes the user in the localstorage
    window.localStorage.removeItem('user-auth-data')
  }
  private getLocalUser() {
    const storedJson = window.localStorage.getItem('user-auth-data')
    if (storedJson !== null) {
      //try decoding json
      const decodedJson = JSON.parse(storedJson);
      if (decodedJson) {
        //set _user
        this._user.set(decodedJson);
        return decodedJson as UserLoginRequestModel;
      }
    }
    return null;
  }


}
