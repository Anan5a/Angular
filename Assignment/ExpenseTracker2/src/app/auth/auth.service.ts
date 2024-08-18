import { computed, inject, Injectable, signal } from '@angular/core';
import { UserModel } from './users.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = signal<UserModel | null>(null);

  private __userList = signal<UserModel[]>([]);

  private storageKey = 'UserAuthData'
  private currentUserKey = 'CurrentUser'

  constructor() {
    this.getLocalUserList()
    this.getCurrentUser()
  }

  get user() {
    this.getCurrentUser()
    return this._user.asReadonly()
  }
  get isAuthenticated() {
    return computed(() => this._user() !== null)
  }

  logout() {
    //erase tokens
    this._user.set(null)
    this.eraseCurrentUser()
  }



  signup(name: string, email: string, password: string) {
    const vemail = email.replaceAll(' ', '')
    //check if email exist
    if (this.emailExists(vemail) != undefined) {
      return null;
    }

    const model: UserModel = {
      id: Date.now(),
      createdAt: (new Date()).toISOString(),
      modifiedAt: '',
      email: vemail,
      name,
      password
    }
    this.storeUser(model)
    return true
  }
  login(email: string, password: string) {
    const vemail = email.replaceAll(' ', '')

    //find user by email
    const user = this.__userList().find((user) => user.email === vemail)
    if (!user) {
      return null
    }
    if (user && user.password === password) {
      //set user
      //store current user for persistence
      window.localStorage.setItem(this.currentUserKey, JSON.stringify(user))
      this._user.set(user)
      return user
    } else {
      return false
    }

  }
  private emailExists(email: string) {
    return this.__userList().find(user => user.email === email)
  }
  private storeUser(user: UserModel) {
    //stores the user in the localstorage
    const newlist = [...this.__userList(), user]
    this.__userList.set(newlist)
    window.localStorage.setItem(this.storageKey, JSON.stringify(this.__userList()))
  }
  private eraseCurrentUser() {
    //removes the user in the localstorage
    window.localStorage.removeItem(this.currentUserKey)
  }
  private getLocalUserList(): UserModel[] | null {
    const storedJson = window.localStorage.getItem(this.storageKey)
    if (storedJson !== null) {
      //try decoding json
      const decodedJson = JSON.parse(storedJson);
      if (decodedJson) {
        //set _user
        this.__userList.set(decodedJson);
        return decodedJson as UserModel[];
      }
    }
    return null;
  }
  private getCurrentUser(): UserModel | null {
    const storedJson = window.localStorage.getItem(this.currentUserKey)
    if (storedJson !== null) {
      //try decoding json
      const decodedJson = JSON.parse(storedJson);
      if (decodedJson) {
        //set _user
        this._user.set(decodedJson);
        return decodedJson as UserModel;
      }
    }
    return null;
  }


}
