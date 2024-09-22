import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatToolbarModule, MatInputModule, MatButtonModule, NgIf,NgFor],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent {

  @Input() selectedUser: string | null = null;
  messages: { user: string; text: string }[] = [];
  newMessage: string = '';

  sendMessage() {
    if (this.newMessage.trim() && this.selectedUser) {
      this.messages.push({ user: 'You', text: this.newMessage });
      this.newMessage = '';
    }
  }
}
