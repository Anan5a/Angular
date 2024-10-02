import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MaterialImportsModule } from '../../material-imports/material-imports.module';


@Component({
  standalone: true,
  selector: 'app-confirm-popup',
  imports: [MaterialImportsModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.css']
})
export class ConfirmPopupComponent implements OnInit {

  message!: string
  title!: string

  constructor(
    public dialogRef: MatDialogRef<ConfirmPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, title: string },
  ) { }




  ngOnInit(): void {
    this.message = this.data.message
    this.title = this.data.title
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
