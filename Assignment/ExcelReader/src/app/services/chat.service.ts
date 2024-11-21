import { Injectable, signal } from '@angular/core';
import {
  ChatMessageModel,
  ChatRepositoryModel,
  ChatUserLimited,
  VoiceCallEvent,
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
    promise.subscribe({
      next: (response) => {
        response.data
          ?.slice()
          ?.reverse()
          ?.forEach((message, index) => {
            const from = message.senderId;
            const to = message.receiverId;

            this.storeChat(
              {
                from: from,
                text: message.content,
                sent_at: message.createdAt,
                to: to,
                didView: true,
              },
              message.senderId == this.authService.user()?.user.id
                ? message.receiverId
                : message.senderId
            );
          });
      },
    });
  }

  RTC_GetAgentAssignment() {
    //gets agent assignment from server
    this.realtimeService.addReceiveMessageListener<VoiceCallEvent[]>(
      'AgentChannel',
      (message: VoiceCallEvent) => {
        //set user id and name
        this.setCurrentUser({
          id: message.metadata.targetUserId,
          name: message.metadata.targetUserName,
          agentInfo: {
            id: this.authService.user()?.user.id,
            name: this.authService.user()?.user.name,
          },
        } as ChatUserLimited);
      }
    );
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

  storeChat(chat: ChatMessageModel, recpId: number) {
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
      repository[recv].chatList.push(chat);
    }
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
