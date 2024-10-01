import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmailTemplateModel, SlaModel } from '../../app.models';
import { UserService } from '../../services/user.service';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { TableComponentComponent } from "../table-component/table-component.component";

@Component({
  selector: 'app-email-templates',
  standalone: true,
  imports: [TableComponentComponent],
  templateUrl: './email-templates.component.html',
  styleUrl: './email-templates.component.css'
})
export class EmailTemplatesComponent {

  remoteData!: EmailTemplateModel[]
  tableId = "myTableEmTpl"

  columns = [
    { def: 'emailTemplateId', header: 'Template ID' },
    { def: 'emailTemplateName', header: 'Template Name' },
    { def: 'emailTemplateSubject', header: 'Subject' },
    { def: 'lastModified', header: 'Last Modified', pipe: 'date' }
  ];
  remoteDataLoaded = false

  pageTitle = "Email templates"
  exportName = "email-templates.xlsx"

  constructor(private userService: UserService, private dialog: MatDialog, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.loadList()
  }

  loadList() {
    this.userService.loadEmailTemplateList().subscribe({
      next: (response) => {
        this.remoteDataLoaded = true
        this.remoteData = response.data!
      },
      error: (error) => {
        this.remoteDataLoaded = true
      },
    })
  }


  onDelete($event: EmailTemplateModel) {
    if (window.confirm("This template will be deleted.\nAre you sure?")) {
      this.userService.deleteEmailTemplate($event.emailTemplateId!).subscribe({
        next: (response) => {
          const filtered = this.remoteData.filter((i) => i.emailTemplateId != $event.emailTemplateId)
          this.remoteData = [...filtered]
          this.toastrService.success(response.data)

        },
        error: (error) => {
          this.toastrService.error(error)
        }
      })
    }
  }

  onEdit($event: EmailTemplateModel) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      disableClose: true,
      maxWidth: '500px',
      width: '450px',
      maxHeight: '90vh',
      data: { template: $event }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.status === true) {
        //update list
        const oldIndex = this.remoteData.findIndex((i) => i.emailTemplateId == result.template.emailTemplateId)
        if (oldIndex != -1) {
          this.remoteData[oldIndex] = result.template
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
        const oldList = [... this.remoteData, result.template];
        this.remoteData = oldList;
      }
    });

  }
}
