import { NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  AbstractControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { UploadResponseModel } from '../app.models';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    FormsModule,
    NgIf,
    RouterLink,
    MatProgressSpinnerModule,
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadComponent {
  inputFileName!: string;
  accept = '.*';
  file!: File;
  progressActive = false;
  errorMessage = '';
  responseSuccess?: UploadResponseModel;
  validTypes = [
    '*/*',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  @ViewChild('fileUpload') fileUpload!: ElementRef;

  form = new FormGroup({
    ExcelFile: new FormControl(null, {
      validators: [
        Validators.required,
        this.fileTypeValidator(this.validTypes),
      ],
    }),
    FileName: new FormControl('', {}),
  });

  fileNameCustom?: string;

  constructor(private userService: UserService) {}

  fileTypeValidator(validTypes: string[]) {
    return (control: AbstractControl) => {
      if (control.value && control.value.type) {
        if (
          !validTypes.includes('*/*') &&
          !validTypes.includes(control.value.type)
        ) {
          return { invalidFileType: true };
        }
      }
      return null;
    };
  }

  triggerFileInput() {
    this.fileUpload.nativeElement.click();
  }

  clearInputElement() {
    this.fileUpload.nativeElement.value = '';
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (
        this.validTypes.includes('*/*') ||
        !this.validTypes.includes(file.type)
      ) {
        this.inputFileName = file.name;
        this.form.patchValue({
          ExcelFile: file,
        });
        //only change if no custom name was typed
        this.form.patchValue({
          FileName: file.name,
        });
        this.fileNameCustom = file.name
          .split('.')
          .slice(0, -1)
          .join('.')
          .replace(/[^a-zA-Z0-9().]/g, '_');
      } else {
        this.inputFileName = '';
        // this.form.get('excelFile')?.setValue(null);
        this.form.get('ExcelFile')?.markAsTouched();
        this.form.get('ExcelFile')?.setErrors({ invalidFileType: true });
      }
    }
  }

  onClickUpload() {
    this.progressActive = true;

    const formData = new FormData();
    formData.append('ExcelFile', this.form.controls['ExcelFile'].value!);
    formData.append('FileName', this.fileNameCustom!);

    this.userService.uploadFile(formData).subscribe({
      next: (uploadResponse) => {
        this.responseSuccess = uploadResponse;
        this.form.reset();
        this.progressActive = false;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error;
        this.progressActive = false;
      },
    });
  }
}
