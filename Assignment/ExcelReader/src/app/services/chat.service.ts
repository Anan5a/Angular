import { Injectable, signal } from '@angular/core';
import { ChatMessageModel, ChatRepositoryModel } from '../app.models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatRepository = signal<ChatRepositoryModel[]>([])
  constructor() { }


  get chats() {
    return this.chatRepository.asReadonly()
  }
  storeChat(chat: ChatMessageModel, recpId: number) {
    const repository = [...this.chatRepository()];
    //find the receiver
    const recv = repository.findIndex(r => r.recpId == recpId)
    if (recv == -1) {
      //add a new repo
      repository.push({ recpId: recpId, chatList: [chat] } as ChatRepositoryModel)
    } else {
      //update
      repository[recv].chatList.push(chat)
    }
    //change the signal
    this.chatRepository.set(repository);
  }







}
