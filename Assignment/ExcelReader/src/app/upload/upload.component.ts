import { NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NetworkService } from '../network.service';
import { UploadResponseModel } from '../app.models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatProgressBarModule, FormsModule, NgIf,RouterLink],
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
    excelFile: new FormControl(null, { validators: [Validators.required, this.fileTypeValidator] }),
  })

  constructor(private networkService: NetworkService) { }

  fileTypeValidator(control: any) {
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
          excelFile: file
        });
      } else {
        this.inputFileName = '';
        // this.form.get('excelFile')?.setValue(null);
        this.form.get('excelFile')?.markAsTouched();
        this.form.get('excelFile')?.setErrors({ invalidFileType: true });
      }
    }
  }

  onClickUpload() {
    this.progressActive = true

    const formData = new FormData();
    formData.append('excelFile', this.form.controls['excelFile'].value!);




    this.networkService.uploadFile(formData).subscribe({
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

