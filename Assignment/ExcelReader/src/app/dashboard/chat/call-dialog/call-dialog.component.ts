import { NgIf } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-call-dialog',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, NgIf],
  templateUrl: './call-dialog.component.html',
  styleUrl: './call-dialog.component.css',
})
export class CallDialogComponent {
  @Output() actionEvent = new EventEmitter<'accepted' | 'rejected'>();

  constructor(
    public dialogRef: MatDialogRef<CallDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      message: string;
      showAccept: boolean;
      showReject: boolean;
    }
  ) {}

  onSave(): void {}
  onAccept(): void {
    this.actionEvent.emit('accepted');
  }

  onReject(): void {
    this.actionEvent.emit('rejected');
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
