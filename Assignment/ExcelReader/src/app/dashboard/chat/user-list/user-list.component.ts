import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [MatCardModule, MatListModule, NgFor, MatButtonModule, MatIconModule, MatRippleModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  @Output() userSelected = new EventEmitter<string>();

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    
  }

  selectUser(user: string) {
    this.userSelected.emit(user);
  }
}
