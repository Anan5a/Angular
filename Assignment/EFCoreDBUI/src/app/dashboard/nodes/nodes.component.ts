import { Component } from '@angular/core';
import { EmailTemplateModel, NodeModel } from '../../app.models';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { TableComponentComponent } from "../table-component/table-component.component";

@Component({
  selector: 'app-nodes',
  standalone: true,
  imports: [TableComponentComponent],
  templateUrl: './nodes.component.html',
  styleUrl: './nodes.component.css'
})
export class NodesComponent {

  remoteData!: NodeModel[]
  tableId = "myTablenodes"

  columns = [
    { def: 'nodeId', header: 'Node ID' },
    { def: 'nodeName', header: 'Node Name' },
    { def: 'alias', header: 'Alias' },
    { def: 'aggregate', header: 'Aggregate' },
    { def: 'player', header: 'Player' },
    { def: 'nodeType', header: 'Node Type' },
    { def: 'nodeSubType', header: 'Node Sub-Type' },
    { def: 'lifeInsuranceClass', header: 'Life Insurance Class' },
    { def: 'slaId', header: 'SLA ID' },
    { def: 'periodicFormat', header: 'Periodic Format' },
    { def: 'periodicFormatStartDate', header: 'Periodic Format Start Date', pipe: 'date' },
    { def: 'transactionFormat', header: 'Transaction Format' },
    { def: 'transactionFormatStartDate', header: 'Transaction Format Start Date', pipe: 'date' },
    { def: 'taskType', header: 'Task Type' },
    { def: 'emailTemplateId', header: 'Email Template ID' },
    { def: 'shifting', header: 'Shifting' },
    { def: 'processDuration', header: 'Process Duration' },
    { def: 'contactId', header: 'Contact ID' },
    { def: 'contactCCId', header: 'Contact CC ID' },
    { def: 'lastModified', header: 'Last Modified', pipe: 'date' }
  ];

  remoteDataLoaded = false

  pageTitle = "Nodes"
  exportName = "node-list.xlsx"

  constructor(private userService: UserService, private dialog: MatDialog, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.loadList()
  }

  loadList() {
    this.userService.loadNodeList().subscribe({
      next: (response) => {
        this.remoteDataLoaded = true
        this.remoteData = response.data!
      },
      error: (error) => {
        this.remoteDataLoaded = true
      },
    })
  }


  onEdit($event: NodeModel) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      disableClose: true,
      maxWidth: '500px',
      width: '450px',
      maxHeight: '90vh',
      data: { node: $event }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.status === true) {
        //update list
        const oldIndex = this.remoteData.findIndex((i) => i.nodeId == result.node.nodeId)
        if (oldIndex != -1) {
          this.remoteData[oldIndex] = result.node
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
        const oldList = [... this.remoteData, result.node];
        this.remoteData = oldList;
      }
    });

  }
}
