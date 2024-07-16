import { Component, input, output, signal } from '@angular/core';
import { TicketModel } from '../ticket.model';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {
  ticket = input<TicketModel>()
  detailsVisible = signal(false)
  close = output()
  onToggleDetails() {
    // this.detailsVisible.set(!this.detailsVisible())
    this.detailsVisible.update((wasVisible) => !wasVisible)
  }

  onMarkAsCompleted() {
    this.close.emit()
  }

}
