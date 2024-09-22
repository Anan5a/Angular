import { Component, Input } from '@angular/core';
import { RealtimeService } from '../../services/realtime.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserListComponent } from "./user-list/user-list.component";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { ChatWindowComponent } from "./chat-window/chat-window.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, ChatWindowComponent, UserListComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  public user: string = '';
  // public message: string = '';
  // public messages: string[] = [];
  isHandset$ = false
  users = ['Alice', 'Bob', 'Charlie'];
  selectedUser: string | null = null;
  constructor(private realtimeService: RealtimeService, private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(result => this.isHandset$ = result.matches)
    );
  }

  ngOnInit(): void {
    this.realtimeService.startConnection();
    this.realtimeService.addReceiveMessageListener<string[]>('Chat', (message: string) => {
      // this.messages.push(`${message}`);
    });
  }

  onUserSelected(user: string) {
    this.selectedUser = user;
  }

}
