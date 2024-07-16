import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';


import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import { DUMMY_USERS } from './dummy-users';
import { TasksComponent } from './tasks/tasks.component';

@Component({
  selector: 'app-root',
  // standalone: true,
  // imports: [NgFor, NgIf, RouterOutlet, HeaderComponent, UserComponent, TasksComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-first-project';
  users = DUMMY_USERS

  selectedUserId?: string

  get selectedUser() {
    return this.users.find((user) => user.id == this.selectedUserId)!
  }




  onSelectUser(id: string) {
    this.selectedUserId = id;
  }
}