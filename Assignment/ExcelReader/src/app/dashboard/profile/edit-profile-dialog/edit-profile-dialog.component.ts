import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../app.models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { passwordMatchValidator } from '../../../auth/signup/signup.component';
import { UserService } from '../../../services/user.service';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-edit-profile-dialog',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
    MatProgressSpinnerModule,
  ],
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.css'],
})
export class EditProfileDialogComponent {
  errorMessage = '';

  form = new FormGroup(
    {
      oldPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
      c_newPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
      newPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    },
    {
      validators: passwordMatchValidator('newPassword', 'c_newPassword'),
    }
  );
  showSpinner = false;
  constructor(
    public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private userService: UserService,
    private toastrService: ToastrService
  ) {}

  onSave(): void {
    this.showSpinner = true;
    this.userService
      .changePassword({
        oldPassword: this.form.controls['oldPassword'].value!,
        newPassword: this.form.controls['newPassword'].value!,
      })
      .subscribe({
        next: (response) => {
          this.showSpinner = false;
          this.dialogRef.close();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.showSpinner = false;
          this.errorMessage = error;
        },
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
