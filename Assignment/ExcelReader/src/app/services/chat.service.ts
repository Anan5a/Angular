import { Injectable, signal } from '@angular/core';
import { ChatMessageModel, ChatRepositoryModel, ChatUserLimited } from '../app.models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatRepository = signal<ChatRepositoryModel[]>([])
  private selectedUser = signal<ChatUserLimited | null>(null)
  constructor(private authService: AuthService) { }


  get chats() {
    return this.chatRepository.asReadonly()
  }
  get currentUser() {
    return this.selectedUser.asReadonly()
  }

  setCurrentUser(cuser: ChatUserLimited | null) {

    this.markChatViewed(cuser?.id)


    this.selectedUser.set(cuser)
  }

  markChatViewed(recpId: number | undefined | null) {
    if (!recpId) {
      return
    }
    const repository = [...this.chatRepository()];
    const index = repository.findIndex(c => c.recpId == recpId)
    if (index != -1) {
      repository[index].chatList.forEach((ch, idx) => {
        repository[index].chatList[idx].didView = true
      })
      this.chatRepository.set(repository);
    }

  }


  storeChat(chat: ChatMessageModel, recpId: number) {
    const repository = [...this.chatRepository()];
    chat.didView = (this.selectedUser()?.id == chat.from || this.authService.user()?.user.id == chat.from);
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
