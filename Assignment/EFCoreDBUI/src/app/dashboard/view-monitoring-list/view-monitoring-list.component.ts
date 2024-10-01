import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { MonitoringModel } from '../../app.models';
import { MaterialImportsModule } from '../../material-imports/material-imports.module';
import { TableComponentComponent } from "../table-component/table-component.component";

@Component({
  selector: 'app-view-list',
  standalone: true,
  imports: [FormsModule, NgIf, DatePipe, RouterLink, MaterialImportsModule, TableComponentComponent],
  templateUrl: './view-monitoring-list.component.html',
  styleUrl: './view-monitoring-list.component.css'
})
export class ViewMonitoringListComponent implements OnInit {

  remoteData!: MonitoringModel[]
  tableId = "myTableMon"
  columns = [
    { def: 'id', header: 'ID', },
    { def: 'alias', header: 'Alias' },
    { def: 'aggregate', header: 'Aggregate' },
    { def: 'node', header: 'Node' },
    { def: 'player', header: 'Player' },
    { def: 'nodeType', header: 'Node Type' },
    { def: 'taskType', header: 'Task Type' },
    { def: 'sla', header: 'SLA' },
    { def: 'shifting', header: 'Shifting' },
    { def: 'processDuration', header: 'Process Duration' },
    { def: 'contact', header: 'Contact' },
    { def: 'contactCC', header: 'Contact CC' },
    { def: 'lastControlPosition', header: 'Last Control Position' },
    { def: 'nextReconciliationDate', header: 'Next Reconciliation Date', pipe: 'date' },
    { def: 'delay', header: 'Delay' },
    { def: 'lastModified', header: 'Last Modified', pipe: 'date' },
  ];
  remoteDataLoaded = false

  pageTitle = "Monitoring list"
  exportName = "monitoring.xlsx"

  constructor(private userService: UserService,) { }

  ngOnInit(): void {
    this.loadList()
  }

  loadList() {
    this.userService.loadMonitoringList().subscribe({
      next: (response) => {
        this.remoteDataLoaded = true
        this.remoteData = response.data!
      },
      error: (error) => {
        this.remoteDataLoaded = true
      },
    })
  }



}
