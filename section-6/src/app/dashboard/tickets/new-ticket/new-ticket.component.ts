import { Component, ElementRef, EventEmitter, Input, model, Output, output, viewChild, ViewChild } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ControlComponent } from "../../../shared/control/control.component";
import { FormsModule } from '@angular/forms';
import { TicketModel } from '../ticket.model';

@Component({
  selector: 'app-new-ticket',
  standalone: true,
  imports: [ButtonComponent, ControlComponent, FormsModule],
  templateUrl: './new-ticket.component.html',
  styleUrl: './new-ticket.component.css'
})
export class NewTicketComponent {
  // @ViewChild('form') form?: ElementRef<HTMLFormElement>;
  private form = viewChild<ElementRef<HTMLFormElement>>('form');
  add = output<{
    title: string,
    text: string
  }>()

  //2 way binding!!
  // @Input() varName: string = ''
  // @Output() varNameChange = new EventEmitter<string>()
  //2 way binding >=17
  // varName = model.required<string>()

  // onSubmit(title: string, requestText: string, form: HTMLFormElement) {
  //   form.reset();
  // }
  onSubmit(title: string, requestText: string) {
    this.add.emit({ title: title, text: requestText })
    this.form()?.nativeElement.reset();
  }

}
