import { NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.css',
})
export class CreateGroupComponent {
  form = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(4)],
    }),
  });

  errorMessage = signal('');

  showSpinner = false;
  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private userService: UserService
  ) {}

  formOnSubmit() {
    this.errorMessage.set('');
    this.showSpinner = true;

    if (!this.form.valid) {
      this.errorMessage.set('Invalid data in the form');
      return;
    }
    //create user
    this.userService
      .createNewGroup({
        groupName: this.form.controls['name'].value!,
      })
      .subscribe({
        next: (response) => {
          this.showSpinner = false;
          if (response.status === 'ok') {
            this.router.navigate(['/admin', 'group', 'list']);
            this.toastrService.success(response.message);
          } else {
            this.errorMessage.set(response.message);
          }
        },
        error: (error) => {
          this.errorMessage.set(error);
          this.showSpinner = false;
        },
      });
  }
}
