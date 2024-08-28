import { AfterViewInit, Component, effect, OnInit, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserModel } from '../app.models';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NetworkService } from '../network.service';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-view-list',
  standalone: true,
  imports: [MatTableModule, MatInputModule, MatProgressSpinnerModule, FormsModule, MatPaginatorModule, MatIconModule, MatProgressBarModule, MatButtonModule, NgIf],
  templateUrl: './view-list.component.html',
  styleUrl: './view-list.component.css'
})
export class ViewListComponent implements OnInit, AfterViewInit {
  disableExport = false;

  dataSource = new MatTableDataSource<UserModel>([]);

  remoteData = signal<UserModel[]>([])

  searchText: string = '';

  displayedColumns: string[] = ['uuid', 'name', 'email'];
  remoteDataLoaded = false
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private networkService: NetworkService) {
    effect(() => {
      this.dataSource.data = this.remoteData()
    })
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = this.customFilter;
    this.remoteDataLoaded = false


    //load data
    this.networkService.loadAllData().subscribe({
      next: (users) => {
        this.remoteDataLoaded = true
        this.remoteData.set(users)
      },
      error: (error) => {
        this.remoteDataLoaded = true
        window.alert("Failed to load the list!.");
      }
    })


  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  customFilter = (data: UserModel, filter: string) => {
    return data.name != undefined ? data.name.toLowerCase()?.indexOf(filter) >= 0 : false;
  };


  applyFilter() {
    this.dataSource.filter = this.searchText;
  }

  onClickExport() {
    this.disableExport = true
    this.networkService.exportAll().subscribe({
      next: (response) => {
        console.log(response)
        this.disableExport = false
        this.downloadClientBlob(response)
      },
      error: (error) => {
        this.disableExport = false
        window.alert("Failed to export the list!.");
      }
    })
  }

  private downloadClientBlob(blob: Blob, filename?: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'export.xlsx';
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }
}
