import { AfterViewInit, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FileMetadataResponse, GroupModel } from '../../../app.models';
import { UserService } from '../../../services/user.service';
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
  templateUrl: './create-edit-group-dialog.component.html',
  styleUrls: ['./create-edit-group-dialog.component.css'],
})
export class CreateEditGroupDialogComponent implements AfterViewInit {
  errorMessage = '';

  form = new FormGroup({
    groupName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });
  showSpinner = false;
  constructor(
    public dialogRef: MatDialogRef<CreateEditGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { group?: GroupModel },
    private userService: UserService,
    private toastrService: ToastrService
  ) {}

  ngAfterViewInit(): void {
    this.form.patchValue({ groupName: this.data.group?.groupName });
  }
  onSave(): void {
    this.showSpinner = true;
    this.userService
      .createNewGroup({
        groupId: this.data.group?.groupId,
        groupName: this.form.value.groupName,
      })
      .subscribe({
        next: (response) => {
          this.showSpinner = false;
          this.dialogRef.close({
            status: true,
            groupName: this.form.value.groupName,

          });
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
