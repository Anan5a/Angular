import { inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ApiRealtimeUrl } from '../../constants';
import { AuthService } from './auth.service';
import { CallbackFunction } from '../app.models';


@Injectable({
  providedIn: 'root'
})
export class RealtimeService {

  private hubConnection: HubConnection
  private authService = inject(AuthService)
  private registeredMethodList: string[] = []

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(ApiRealtimeUrl,
        {
          accessTokenFactory: this.authService.token
        }
      )
      .withAutomaticReconnect()
      .build();
  }

  public startConnection() {
    console.log("Establishing realtime channel...")
    this.hubConnection
      .start()
      .then(() => console.log("Established realtime signalR connection..."))
      .catch((reason) => {
        console.error("Realtime connection establish failed: " + reason)
      })
      .finally(() => console.log("Channel establish process ended."))

  }

  public addReceiveMessageListener<TArgs extends any[]>(method: string, callback: CallbackFunction<TArgs>) {
    if (this.registeredMethodList.includes(method)) {
      console.warn("Method/Channel '" + method + "' already registered, use different name/channel")
      return
    }
    this.hubConnection.on(method, (...args: TArgs) => {
      callback(...args);
    });

  }

  public sendMessage(message: string) {
    this.hubConnection
      .invoke('SendMessage', message)
      .catch(err => console.error("Send message failed: " + err))
  }

}
