import { NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { UploadResponseModel } from '../app.models';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatProgressBarModule, FormsModule, NgIf, RouterLink],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  inputFileName!: string;
  accept = ".xls,.xlsx";
  file!: File
  progressActive = false
  errorMessage = ""
  responseSuccess?: UploadResponseModel


  @ViewChild('fileUpload') fileUpload!: ElementRef

  form = new FormGroup({
    ExcelFile: new FormControl(null, { validators: [Validators.required, this.fileTypeValidator] }),
    FileName: new FormControl('', {})
  });

  fileNameCustom?: string;

  constructor(private userService: UserService) { }

  fileTypeValidator(control: AbstractControl) {
    if (control.value && control.value.type) {
      const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!validTypes.includes(control.value.type)) {
        return { invalidFileType: true };
      }
    }
    return null;
  }

  triggerFileInput() {
    this.fileUpload.nativeElement.click();
  }



  clearInputElement() {
    this.fileUpload.nativeElement.value = ''
  }


  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.inputFileName = file.name;
        this.form.patchValue({
          ExcelFile: file
        });
        //only change if no custom name was typed
        if (!this.fileNameCustom) {
          this.form.patchValue({
            FileName: file.name
          });
          this.fileNameCustom = file.name.split('.').slice(0, -1).join('.');;
        }
      } else {
        this.inputFileName = '';
        // this.form.get('excelFile')?.setValue(null);
        this.form.get('ExcelFile')?.markAsTouched();
        this.form.get('ExcelFile')?.setErrors({ invalidFileType: true });
      }
    }
  }

  onClickUpload() {
    this.progressActive = true

    const formData = new FormData();
    formData.append('ExcelFile', this.form.controls['ExcelFile'].value!);
    formData.append('FileName', this.fileNameCustom!);




    this.userService.uploadFile(formData).subscribe({
      next: (uploadResponse) => {
        this.responseSuccess = uploadResponse
        this.form.reset()
        this.progressActive = false
        this.errorMessage = ""
      },
      error: (error) => {
        this.errorMessage = error
        this.progressActive = false
      },
    })
  }

}

