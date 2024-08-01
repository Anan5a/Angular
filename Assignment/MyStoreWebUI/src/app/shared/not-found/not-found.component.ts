import { Component, inject, OnInit } from '@angular/core';
import { LoadingSpinnerService } from '../loading-spinner/loading-spinner.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent implements OnInit {
  private loadingSpinnerService = inject(LoadingSpinnerService)

  ngOnInit(): void {
    this.loadingSpinnerService.setState(false)
  }
}
