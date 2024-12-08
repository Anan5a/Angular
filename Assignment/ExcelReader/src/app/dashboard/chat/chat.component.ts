import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { RealtimeService } from '../../services/realtime.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { UserService } from '../../services/user.service';
import { ChatEvent, ChatMessageModel, User } from '../../app.models';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { VoiceCallService } from '../../services/voice-call.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ChatWindowComponent,
    UserListComponent,
    AsyncPipe,
    MatIconModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  user: User;
  isHandset$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));
  onlineUsers = this.chatService.onlineUsers;
  selectedUser = this.chatService.currentUser;
  selectedUserInfo?: User;
  chatActivityState = this.chatService.chatActivityState;
  // callUser = computed(() => this.voiceCallService.callUserId());
  isAdmin = this.authService.isAdmin;

  @ViewChild('callDialog', { static: false })
  dialogContent!: TemplateRef<unknown>;
  askedForAgent = false;
  disableTransferButton = false;
  constructor(
    private realtimeService: RealtimeService,
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,
    private authService: AuthService,
    private chatService: ChatService,
    private voiceCallService: VoiceCallService,
    private callDialog: MatDialog
  ) {
    this.user = authService.user()?.user ?? ({} as User);
  }

  ngOnInit(): void {
    this.realtimeService.startConnection();
    this.realtimeService.addReceiveMessageListener<ChatEvent[][]>(
      'ChatChannel',
      (messages: ChatEvent[]) => {
        //send this to chat window
        // console.log(messages);
        messages.forEach((message) => {
          if (message.endOfChatMarker) {
            //end chat
            this.chatService.setChatActivityState('inactive');
          }

          this.chatService.storeChat(
            {
              from: message.from,
              to: this.user.userId,
              text: message.content,
              sentAt: message.sentAt, //new Date().toISOString(),
              isSystemMessage: message?.isSystemMessage,
              messageId: message.messageId,
            } as ChatMessageModel,
            this.user.userId == message.from
              ? this.selectedUser()?.id!
              : message.from,
            !(messages.length > 1)
          );
        });
      }
    );

    this.realtimeService.addReceiveMessageListener<unknown[]>(
      'CallingChannel',
      (message: any) => {
        // console.log(message)
        this.voiceCallService.handleRTCSignal(message);
      }
    );

    this.chatService.RTC_GetAgentAssignment();
    // this.sendAgentRequestQueue();
    if (this.isAdmin()) {
      //load online users
      this.loadOnlineUsers();
    }
  }

  loadOnlineUsers() {
    this.chatService.loadOnlineUsers();
  }

  sendMessageToSelectedUser(message: string) {
    this.userService
      .sendMessageToUser({
        to: this.selectedUser()?.id!,
        message: message,
      })
      .subscribe({
        next: (x) => {
          //send this to chat window
          this.chatService.storeChat(
            {
              from: this.user.userId,
              to: this.selectedUser()?.id!,
              text: message,
              sentAt: new Date().toISOString(),
              messageId: x.data,
            } as ChatMessageModel,
            this.selectedUser()?.id!
          );
        },
      });
  }

  sendAgentRequestQueue() {
    if (!this.authService.isAdmin()) {
      this.askedForAgent = true;
      this.userService.agentRequest().subscribe();
    }
  }

  closeChatWindow() {
    this.userService.closeChat().subscribe();
    this.chatService.setCurrentUser(null);
    this.selectedUserInfo = undefined;
    this.askedForAgent = false;
  }

  requestTransferUser(id?: number) {
    if (id) {
      this.disableTransferButton = true;
      this.userService.chatTransferRequest(id).subscribe({
        next: () => {
          this.disableTransferButton = false;
        },
      });
    }
  }

  loadUserInfo() {
    //only admins can view this
    if (this.isAdmin()) {
      this.userService.getUserInfo(this.selectedUser()?.id!).subscribe({
        next: (resp) => {
          this.selectedUserInfo = resp.data;
        },
      });
    }
  }
}
