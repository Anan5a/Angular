import { NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ChatMessageModel, ChatUserLimited, User } from '../../../app.models';
import { ChatService } from '../../../services/chat.service';
import { MatIconModule } from '@angular/material/icon';
import { VoiceCallService } from '../../../services/voice-call.service';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
    NgFor,
    MatIconModule,
  ],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css',
})
export class ChatWindowComponent implements OnInit {
  @Input({ required: true }) fromUser!: User;
  @Output() onOutgoingMessage = new EventEmitter<string>();
  @Output() onCloseChatWindow = new EventEmitter<boolean>();

  selectedUser = this.chatService.currentUser;
  selectedUsername = this.selectedUser()?.name;
  messages = computed(() => {
    const index = this.chatService
      .chats()
      .findIndex((ch) => ch.recpId == this.selectedUser()?.id);
    let chats: ChatMessageModel[] = [];
    if (index != -1) {
      chats = this.chatService.chats()[index].chatList;
    }
    return chats;
  });
  newMessage: string = '';

  constructor(
    private chatService: ChatService,
    private voiceCallService: VoiceCallService,
    private callDialog: MatDialog
  ) {
    effect(() => {
      this.selectedUsername = this.selectedUser()?.name;
    });
  }

  ngOnInit(): void {}

  sendOutgoingMessageEvent() {
    if (this.newMessage.trim()) {
      this.onOutgoingMessage.emit(this.newMessage.trim());
    }
    //clear input
    this.newMessage = '';
  }

  closeChat() {
    this.chatService.setCurrentUser(null);
    this.onCloseChatWindow.emit();
  }

  callUser() {
    //check permission
    this.chatService.callUser();
  }
  endCall() {
    //check permission
    this.chatService.endCall();
  }
}
