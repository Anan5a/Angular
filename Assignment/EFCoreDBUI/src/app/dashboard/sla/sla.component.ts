import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SlaModel } from '../../app.models';
import { TableComponentComponent } from "../table-component/table-component.component";
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPopupComponent } from '../confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-sla',
  standalone: true,
  imports: [TableComponentComponent],
  templateUrl: './sla.component.html',
  styleUrl: './sla.component.css'
})
export class SlaComponent {

  remoteData!: SlaModel[]
  tableId = "myTableSla"
  columns = [
    { def: 'slaId', header: 'SLA ID' },
    { def: 'slaName', header: 'SLA Name' },
    { def: 'slaFrequencyTransaction', header: 'Frequency Transaction' },
    { def: 'slaFrequencyPosition', header: 'Frequency Position' },
    { def: 'slaAnniversary', header: 'Anniversary' },
    { def: 'slaExcludeWeekends', header: 'Exclude Weekends' },
    { def: 'slaReminderDays', header: 'Reminder Days' },
    { def: 'slaEscalationDays', header: 'Escalation Days' },
    { def: 'lastModified', header: 'Last Modified', pipe: 'date' },
  ];
  remoteDataLoaded = false

  pageTitle = "Sla list"
  exportName = "sla.xlsx"

  constructor(private userService: UserService, private dialog: MatDialog, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.loadList()
  }

  loadList() {
    this.userService.loadSlaList().subscribe({
      next: (response) => {
        this.remoteDataLoaded = true
        this.remoteData = response.data!
      },
      error: (error) => {
        this.remoteDataLoaded = true
      },
    })
  }


  onDelete($event: SlaModel) {

    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      disableClose: true,
      maxWidth: '500px',
      width: '450px',
      maxHeight: '90vh',
      data: { message: 'This SLA will be deleted permanently. Are you sure?', title: 'Confirm action' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.userService.deleteSla($event.slaId!).subscribe({
          next: (response) => {
            const filtered = this.remoteData.filter((i) => i.slaId != $event.slaId)
            this.remoteData = [...filtered]
            this.toastrService.success(response.data)
          },
          error: (error) => {
            this.toastrService.error(error)
          }
        })
      }
    });

  }

  onEdit($event: SlaModel) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      disableClose: true,
      maxWidth: '500px',
      width: '450px',
      maxHeight: '90vh',
      data: { slaData: $event }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.status === true) {
        //update list
        const oldIndex = this.remoteData.findIndex((i) => i.slaId == result.sla.slaId)
        if (oldIndex != -1) {
          this.remoteData[oldIndex] = result.sla
        }
        this.remoteData = [...this.remoteData]

      }
    });
  }
  onAddEvent() {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      disableClose: true,
      maxWidth: '500px',
      width: '450px',
      maxHeight: '90vh',

      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.status === true) {
        //update list
        const oldList = [... this.remoteData, result.sla];
        this.remoteData = oldList;
      }
    });

  }
}
