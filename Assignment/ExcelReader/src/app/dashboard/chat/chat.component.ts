import { Component, signal, TemplateRef, ViewChild } from '@angular/core';
import { RealtimeService } from '../../services/realtime.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { UserService } from '../../services/user.service';
import {
  ChatEvent,
  ChatMessageModel,
  ChatUserLimited,
  User,
} from '../../app.models';
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
export class ChatComponent {
  user: User;
  isHandset$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));
  onlineUsers = signal<ChatUserLimited[]>([]);
  selectedUser = this.chatService.currentUser;
  selectedUserInfo?: User;

  // callUser = computed(() => this.voiceCallService.callUserId());
  isAdmin = this.authService.isAdmin;

  @ViewChild('callDialog', { static: false }) dialogContent!: TemplateRef<any>;
  askedForAgent = false;
  constructor(
    private realtimeService: RealtimeService,
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,
    private authService: AuthService,
    private chatService: ChatService,
    private voiceCallService: VoiceCallService,
    private callDialog: MatDialog
  ) {
    this.user = authService.user()?.user!;
  }

  ngOnInit(): void {
    this.realtimeService.startConnection();
    this.realtimeService.addReceiveMessageListener<ChatEvent[]>(
      'ChatChannel',
      (message: ChatEvent) => {
        //send this to chat window
        this.chatService.storeChat(
          {
            from: message.from,
            to: this.user.id,
            text: message.content,
            sent_at: message.sent_at, //new Date().toISOString(),
            isSystemMessage: message?.isSystemMessage,
          } as ChatMessageModel,
          message.from
        );
      }
    );

    this.realtimeService.addReceiveMessageListener<any[]>(
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
    this.userService.getOnlineUsers().subscribe({
      next: (users) => {
        if (users.data) {
          this.onlineUsers.set(users.data);
        }
      },
    });
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
              from: this.user.id,
              to: this.selectedUser()?.id!,
              text: message,
              sent_at: new Date().toISOString(),
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
