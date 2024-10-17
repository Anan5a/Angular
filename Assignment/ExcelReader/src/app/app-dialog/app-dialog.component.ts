import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-app-dialog',
  standalone: true,
  imports: [],
  templateUrl: './app-dialog.component.html',
  styleUrl: './app-dialog.component.css',
})
export class AppDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AppDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {}

  onSave(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }
}
