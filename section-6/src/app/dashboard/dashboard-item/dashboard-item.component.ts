import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-item',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-item.component.html',
  styleUrl: './dashboard-item.component.css',
  host: {
    class: "dashboard-item"
  }
})
export class DashboardItemComponent {
  @Input({ required: true }) imageData!: {
    src: string,
    alt: string
  }
  @Input({ required: true }) title!: string
}
