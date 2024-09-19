import { Component } from '@angular/core';
import { RealtimeService } from '../../services/realtime.service';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  public user: string = '';
  public message: string = '';
  public messages: string[] = [];

  constructor(private realtimeService: RealtimeService) { }

  ngOnInit(): void {
    this.realtimeService.startConnection();
    this.realtimeService.addReceiveMessageListener<string[]>('Chat', (message: string) => {
      this.messages.push(`${message}`);
    });
  }

  public sendMessage(): void {
    this.realtimeService.sendMessage(this.message);
    this.message = '';
  }
}
