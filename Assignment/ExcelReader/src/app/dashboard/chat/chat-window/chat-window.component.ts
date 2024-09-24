import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ChatMessageModel, ChatUserLimited, User } from '../../../app.models';
import { ChatService } from '../../../services/chat.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatToolbarModule, MatInputModule, MatButtonModule, NgIf, NgFor, MatIconModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent implements AfterViewInit {

  @Input({ required: true }) fromUser!: User
  @Input({ required: true }) selectedUser?: ChatUserLimited;
  @Output() onOutgoingMessage = new EventEmitter<string>()
  @Output() onCloseChatWindow = new EventEmitter<boolean>()

  messages = computed(() => {
    const index = this.chatService.chats().findIndex(ch => ch.recpId == this.selectedUser?.id)
    let chats: ChatMessageModel[] = []
    if (index != -1) {
      chats = this.chatService.chats()[index].chatList
    }
    return chats;
  })
  newMessage: string = '';


  constructor(private chatService: ChatService) { }

  ngAfterViewInit(): void {
    //update message view state
    this.chatService.markChatViewed(this.selectedUser?.id!)
  }

  sendOutgoingMessageEvent() {
    if (this.newMessage.trim()) {
      this.onOutgoingMessage.emit(this.newMessage.trim())
    }
    //clear input
    this.newMessage = ""
  }

  closeChat() {
    this.onCloseChatWindow.emit()
  }

}
