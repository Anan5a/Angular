import { Component, Input, Output, EventEmitter, output, input } from '@angular/core';
import {  User } from './user.model';
import { CardComponent } from "../shared/card/card.component";




@Component({
  selector: 'app-user',
  // standalone: true,
  // imports: [CardComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  //normal, input decorator
  @Input({ required: true }) user!: User;
  @Input({required:true}) selected!:boolean
  @Output() select = new EventEmitter<string>(); //output decorator
  // select = output<string>() //same as above, but shorter and new
  //using signals 
  // avatar = input.required<string>()
  // name = input.required<string>()
  // imagePath = computed(() => "assets/users/" + this.avatar())


  get imagePath() {
    return "assets/users/" + this.user.avatar
  }
  onSelectUser() {
    this.select.emit(this.user.id)
  }
}
