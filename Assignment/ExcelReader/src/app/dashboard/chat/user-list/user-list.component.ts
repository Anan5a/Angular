import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ChatUserLimited } from '../../../app.models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [MatCardModule, MatListModule, NgFor, MatButtonModule, MatIconModule, MatRippleModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  @Input({ required: true }) users!: ChatUserLimited[]
  @Output() userSelected = new EventEmitter<ChatUserLimited>();
  @Output() onRefreshUserList = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
    //todo: show last message in the list
  }

  selectUser(user: ChatUserLimited) {
    this.userSelected.emit(user);
  }
  refreshUsersList() {
    this.onRefreshUserList.emit();
  }
}
