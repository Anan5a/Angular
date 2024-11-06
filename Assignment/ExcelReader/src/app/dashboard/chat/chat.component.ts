import {
  Component,
  computed,
  Input,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { RealtimeService } from '../../services/realtime.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { UserService } from '../../services/user.service';
import {
  ChatEvent,
  ChatUserLimited,
  User,
  VoiceCallEvent,
} from '../../app.models';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { VoiceCallService } from '../../services/voice-call.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    ChatWindowComponent,
    UserListComponent,
    AsyncPipe,
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
  // callUser = computed(() => this.voiceCallService.callUserId());

  @ViewChild('callDialog', { static: false }) dialogContent!: TemplateRef<any>;

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
    //load online users
    this.loadOnlineUsers();
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
            time: new Date().toISOString(),
          },
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
              time: new Date().toISOString(),
            },
            this.selectedUser()?.id!
          );
        },
      });
  }

  closeChatWindow() {
    this.chatService.setCurrentUser(null);
  }
}
