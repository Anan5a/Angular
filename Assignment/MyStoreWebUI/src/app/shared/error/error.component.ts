import { Component, inject, input, signal } from '@angular/core';
import { ErrorService } from './error.service';
import { DialogComponent } from "../dialog/dialog.component";

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [DialogComponent],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {


  title = input<string>();
  message = input<string>();
  private errorService = inject(ErrorService);

  onClearError() {
    this.errorService.clearError();
  }






}
