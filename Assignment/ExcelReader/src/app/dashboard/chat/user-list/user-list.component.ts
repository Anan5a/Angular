import {
  Component,
  computed,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ChatMessageModel, ChatUserLimited } from '../../../app.models';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  @Input({ required: true }) users!: ChatUserLimited[];
  @Output() RefreshUserListEvent = new EventEmitter<boolean>();
  activityState = this.chatService.chatActivityState;

  recentMessages = computed(() => {
    const chatHistory: ChatMessageModel[] = [];
    this.chatService.chats().forEach((chatRepository) => {
      chatHistory.push(
        chatRepository.chatList[chatRepository.chatList.length - 1]
      );
    });
    return chatHistory;
  });

  activeChatUser = this.chatService.currentUser;

  constructor(
    private chatService: ChatService,
    private toastrService: ToastrService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  selectUser(user: ChatUserLimited) {
    //check if user was assigned an agent, if yes, prevent assignment
    //actual selection is determined by the server
    if (
      user.agentInfo != null &&
      user.agentInfo.id != this.authService.user()?.user.userId
    ) {
      this.toastrService.error(
        'User already has agent assigned to them',
        'Agent assignment error'
      );
      return;
    }
    //try to accept
    this.userService.acceptUserIntoChat(user.id).subscribe({
      next: (status) => {
        if (status) {
          this.toastrService.success(
            'User accepted successfully. Waiting for server event',
            'Accept Successful'
          );
        } else {
          this.toastrService.success(
            'User accepted successfully. Waiting for server event',
            'Accept Successful'
          );
        }
      },
      error: () => {
        this.toastrService.error('User accept failed.', 'Accept failed');
      },
    });
  }

  refreshUsersList() {
    this.RefreshUserListEvent.emit();
  }

  lastMessageForId(id: number) {
    return computed(() => {
      return this.recentMessages().find((msg) => {
        return msg.from == id || msg.to == id;
      });
    });
  }
}
