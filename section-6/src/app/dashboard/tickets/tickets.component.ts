import { Component } from '@angular/core';
import { NewTicketComponent } from "./new-ticket/new-ticket.component";
import { TicketModel } from './ticket.model';
import { Title } from '@angular/platform-browser';
import { TicketComponent } from "./ticket/ticket.component";

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [NewTicketComponent, TicketComponent],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent {
  tickets: TicketModel[] = []

  onAdd(event: { title: string; text: string; }) {
    const ticket: TicketModel = {
      id: Math.random().toString(),
      status: 'open',
      title: event.title,
      request: event.text
    }
    this.tickets.unshift(ticket)
  }


  onCloseTicket(id: string) {
    this.tickets = this.tickets.map((ticket) => {
      if (ticket.id === id) {
        return { ...ticket, status: 'closed' }
      }
      return ticket
    })
  }
}
