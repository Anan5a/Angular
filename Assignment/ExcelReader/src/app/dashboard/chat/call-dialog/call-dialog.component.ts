import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-call-dialog',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './call-dialog.component.html',
  styleUrl: './call-dialog.component.css',
})
export class CallDialogComponent {
  @Output() actionEvent = new EventEmitter<'accepted' | 'rejected'>();

  constructor(
    public dialogRef: MatDialogRef<CallDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
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
