import { NgClass, NgFor } from '@angular/common';
import { Component, computed, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ChatMessageModel, ChatUserLimited } from '../../../app.models';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [MatCardModule, MatListModule, NgFor, MatButtonModule, MatIconModule, MatRippleModule, NgClass],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  @Input({ required: true }) users!: ChatUserLimited[]
  @Output() onRefreshUserList = new EventEmitter<boolean>();

  recentMessages = computed(() => {
    const chatHistory: ChatMessageModel[] = []
    this.chatService.chats().forEach((chatRepository, index) => {
      chatHistory.push(chatRepository.chatList[chatRepository.chatList.length - 1])
    })
    return chatHistory;
  })

  activeChatUser = this.chatService.currentUser

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    //todo: show last message in the list
  }

  selectUser(user: ChatUserLimited) {
    this.chatService.setCurrentUser(user)
  }

  refreshUsersList() {
    this.onRefreshUserList.emit();
  }

  lastMessageForId(id: number) {
    return computed(() => {
      return this.recentMessages().find(msg => {
        return msg.from == id || msg.to == id
      })
    })
  }
}
