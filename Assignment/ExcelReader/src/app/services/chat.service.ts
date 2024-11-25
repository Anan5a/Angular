import { Injectable, signal } from '@angular/core';
import {
  ChatMessageModel,
  ChatRepositoryModel,
  ChatUserLimited,
  AgentChannelMessage,
  RTCConnModel,
} from '../app.models';
import { AuthService } from './auth.service';
import { VoiceCallService } from './voice-call.service';
import { RealtimeService } from './realtime.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private chatRepository = signal<ChatRepositoryModel[]>([]);
  private selectedUser = signal<ChatUserLimited | null>(null);
  private _onlineUsers = signal<ChatUserLimited[]>([]);

  constructor(
    private authService: AuthService,
    private voiceCallService: VoiceCallService,
    private realtimeService: RealtimeService,
    private userService: UserService
  ) {
    // this.RTC_GetAgentAssignment();
  }

  get chats() {
    return this.chatRepository.asReadonly();
  }
  get currentUser() {
    return this.selectedUser.asReadonly();
  }
  get onlineUsers() {
    return this._onlineUsers.asReadonly();
  }
  setCurrentUser(cuser: ChatUserLimited | null) {
    this.markChatViewed(cuser?.id);

    this.selectedUser.set(cuser);
    if (cuser) {
      this.loadChatHistory(cuser);
    }
  }

  loadChatHistory(cuser: ChatUserLimited) {
    let promise;
    if (this.authService.isAdmin() && cuser) {
      //load selected user
      promise = this.userService.getLastMessages(cuser.id!);
    } else {
      //load self
      promise = this.userService.getLastMessages();
    }
    promise.subscribe();
  }

  loadOnlineUsers() {
    this.userService.getOnlineUsers().subscribe({
      next: (users) => {
        if (users.data) {
          this._onlineUsers.set(users.data);
        }
      },
    });
  }

  private addNewOnlineUser(newUser: ChatUserLimited) {
    //check if already in
    const idx = this.onlineUsers().findIndex((u) => u.id == newUser.id);

    if (idx != -1) {
      return;
    }
    const newList = [...this.onlineUsers(), newUser];
    this._onlineUsers.set(newList);
  }

  private removeFromOnlineUsers(oldUser: ChatUserLimited) {
    const filtered = [...this.onlineUsers()].filter((u) => u.id != oldUser.id);
    console.log('After filter: ', filtered);
    this._onlineUsers.set(filtered);
  }
  endCurrentChat() {}
  RTC_GetAgentAssignment() {
    //gets agent assignment from server
    this.realtimeService.addReceiveMessageListener<
      AgentChannelMessage<RTCConnModel>[]
    >('AgentChannel', (message: AgentChannelMessage<RTCConnModel>) => {
      //set user id and name
      if (message.acceptIntoChat) {
        this.setCurrentUser({
          id: message.metadata?.targetUserId,
          name: message.metadata?.targetUserName,
          agentInfo: {
            id: this.authService.user()?.user.id,
            name: this.authService.user()?.user.name,
          },
        } as ChatUserLimited);
      }
    });

    this.realtimeService.addReceiveMessageListener<
      AgentChannelMessage<ChatUserLimited>[]
    >('AgentChannel', (message: AgentChannelMessage<ChatUserLimited>) => {
      const user = {
        id: message.metadata?.id,
        name: message.metadata?.name,
      } as ChatUserLimited;
      if (message.containsUser) {
        console.log('Add user to list: ', message);

        this.addNewOnlineUser(user);
      }
      if (message.removeUserFromList) {
        console.log('Remove user from list: ', message);
        this.removeFromOnlineUsers(user);
      }
    });
  }

  markChatViewed(recpId: number | undefined | null) {
    if (!recpId) {
      return;
    }
    const repository = [...this.chatRepository()];
    const index = repository.findIndex((c) => c.recpId == recpId);
    if (index != -1) {
      repository[index].chatList.forEach((ch, idx) => {
        repository[index].chatList[idx].didView = true;
      });
      this.chatRepository.set(repository);
    }
  }

  storeChat(chat: ChatMessageModel, recpId: number, append: boolean = true) {
    const repository = [...this.chatRepository()];
    chat.didView =
      this.selectedUser()?.id == chat.from ||
      this.authService.user()?.user.id == chat.from;
    //find the receiver
    const recv = repository.findIndex((r) => r.recpId == recpId);
    if (recv == -1) {
      //add a new repo
      repository.push({
        recpId: recpId,
        chatList: [chat],
      } as ChatRepositoryModel);
    } else {
      //update
      // check for duplicate
      const hasId = repository[recv].chatList.findIndex(
        (m) => m.messageId == chat.messageId
      );
      if (chat.isSystemMessage) {
        repository[recv].chatList.push(chat);
      }
      if (hasId == -1 && !chat.isSystemMessage) {
        if (append) {
          repository[recv].chatList.push(chat);
        } else {
          repository[recv].chatList.unshift(chat);
        }
      }
    }

    // console.log(repository);
    //change the signal
    this.chatRepository.set(repository);
  }

  callUser() {
    this.voiceCallService.startCall(
      this.selectedUser()?.id!,
      this.selectedUser()?.name!
    );
  }
  endCall() {
    this.voiceCallService.endCall();
  }
}
