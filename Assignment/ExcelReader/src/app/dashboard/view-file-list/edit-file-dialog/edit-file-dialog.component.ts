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
import { FileMetadataResponse } from '../../../app.models';
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
  templateUrl: './edit-file-dialog.component.html',
  styleUrls: ['./edit-file-dialog.component.css'],
})
export class EditFileDialogComponent implements AfterViewInit {
  errorMessage = '';

  form = new FormGroup({
    fileName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });
  showSpinner = false;
  constructor(
    public dialogRef: MatDialogRef<EditFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { fileMeta: FileMetadataResponse },
    private userService: UserService,
    private toastrService: ToastrService
  ) {}

  ngAfterViewInit(): void {
    this.form.patchValue({ fileName: this.data.fileMeta.fileName });
  }
  onSave(): void {
    this.showSpinner = true;
    this.userService
      .updateFile({
        fileId: this.data.fileMeta.fileMetadataId,
        fileName: this.form.value.fileName,
      })
      .subscribe({
        next: (response) => {
          this.showSpinner = false;
          this.dialogRef.close({
            status: true,
            fileName: this.form.value.fileName,
          });
          this.toastrService.success(response.data);
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
