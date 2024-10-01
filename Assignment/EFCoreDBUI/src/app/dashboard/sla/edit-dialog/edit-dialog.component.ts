import { AfterViewInit, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../services/user.service';
import { MaterialImportsModule } from '../../../material-imports/material-imports.module';
import { SlaModel } from '../../../app.models';


@Component({
  standalone: true,
  selector: 'app-edit-dialog',
  imports: [MaterialImportsModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements AfterViewInit {

  errorMessage = ''

  form = new FormGroup({
    slaName: new FormControl('', [Validators.required]),
    frequencyTransaction: new FormControl('', [Validators.required]),
    frequencyPosition: new FormControl('', [Validators.required]),
    frequencyType: new FormControl('', [Validators.required]),
    reminderDays: new FormControl(0, [Validators.required]),
    escalationDays: new FormControl(0, [Validators.required]),
  })

  isLoading = false;
  transactionOptions = ['1d', '2d', '3d', '4d', '5d', '1w', '2w', '3w', '4w', '1m', '2m', '3m', '1y'];
  positionOptions = ['1d', '2d', '3d', '4d', '5d', '1w', '2w', '3w', '4w', '1m', '2m', '3m', '1y'];

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { slaData?: SlaModel },
    private userService: UserService,
    private toastrService: ToastrService
  ) {

  }




  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.form.patchValue({
      slaName: this.data.slaData?.slaName,
      frequencyTransaction: this.data.slaData?.slaFrequencyTransaction,
      frequencyPosition: this.data.slaData?.slaFrequencyPosition,
      frequencyType: this.data.slaData?.slaAnniversary,
      reminderDays: this.data.slaData?.slaReminderDays,
      escalationDays: this.data.slaData?.slaEscalationDays
    })
  }
  onSave(): void {
    this.isLoading = true
    this.userService.createUpdateSla({
      slaName: this.form.value?.slaName,
      frequencyTransaction: this.form.value?.frequencyTransaction,
      frequencyPosition: this.form.value?.frequencyPosition,
      frequencyType: this.form.value?.frequencyType,
      reminderDays: this.form.value?.reminderDays,
      escalationDays: this.form.value?.escalationDays,
      slaId: this.data.slaData?.slaId
    }).subscribe({
      next: (response) => {
        this.dialogRef.close({ status: true, sla: response.data });
        this.toastrService.success(response.message)
        this.isLoading = false
      },
      error: (error) => {
        this.errorMessage = error
        this.isLoading = false
      },
    })
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
