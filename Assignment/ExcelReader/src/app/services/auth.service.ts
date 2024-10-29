import { computed, inject, Injectable, signal } from '@angular/core';
import {
  DataUserLoginResponseModel,
  LoginRequestModel,
  LoginResponseModel,
  SignupRequestModel,
  SignupResponseModel,
} from '../app.models';
import { BaseNetworkService } from './base-network.service';
import { HttpClient } from '@angular/common/http';
import { ApiBaseUrl } from '../../constants';
import { tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseNetworkService {
  private _user = signal<DataUserLoginResponseModel | null>(null);

  private currentUserKey = 'CurrentUser';

  constructor(httpClient: HttpClient) {
    super(httpClient);

    this.getCurrentUser();
  }

  get user() {
    this.getCurrentUser();
    return this._user.asReadonly();
  }
  get isAuthenticated() {
    return computed(() => this._user() !== null);
  }
  get isSuperAdmin() {
    return computed(
      () =>
        this._user() !== null &&
        this._user()?.user.role?.roleName === 'super_admin'
    );
  }
  get isAdmin() {
    return computed(
      () =>
        this._user() !== null &&
        (this._user()?.user.role?.roleName === 'admin' || this.isSuperAdmin())
    );
  }
  get token() {
    return computed(() => this._user()?.token || '');
  }

  logout() {
    //erase tokens
    this._user.set(null);
    this.eraseCurrentUser();
  }

  signup(formData: SignupRequestModel) {
    const url = ApiBaseUrl + '/User/signup';
    const errorMessage = 'Failed to create account!';
    return this.post<SignupRequestModel, SignupResponseModel>(
      url,
      formData,
      errorMessage
    );
  }

  login(formData: LoginRequestModel) {
    const url = ApiBaseUrl + '/User/login';
    const errorMessage = 'Failed to login user!';
    return this.post<LoginRequestModel, LoginResponseModel>(
      url,
      formData,
      errorMessage
    ).pipe(
      tap({
        next: (response) => {
          this._user.set(response.data!);
          this.storeUser();
        },
      })
    );
  }

  socialAuth(idToken: string) {
    const url = ApiBaseUrl + '/User/social-auth';
    const errorMessage = 'Failed to login user!';
    return this.post<{}, LoginResponseModel>(
      url,
      { idToken: idToken },
      errorMessage
    ).pipe(
      tap({
        next: (response) => {
          this._user.set(response.data!);
          this.storeUser();
        },
      })
    );
  }

  private storeUser() {
    window.localStorage.setItem(
      this.currentUserKey,
      JSON.stringify(this._user())
    );
  }
  private eraseCurrentUser() {
    //removes the user in the localstorage
    window.localStorage.removeItem(this.currentUserKey);
  }

  private getCurrentUser(): DataUserLoginResponseModel | null {
    const storedJson = window.localStorage.getItem(this.currentUserKey);
    if (storedJson !== null) {
      //try decoding json
      const decodedJson = JSON.parse(storedJson);
      if (decodedJson) {
        //set _user
        this._user.set(decodedJson);
        return decodedJson as DataUserLoginResponseModel;
      }
    }
    return null;
  }
}
