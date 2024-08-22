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

@Component({
  selector: 'app-view-list',
  standalone: true,
  imports: [MatTableModule, MatInputModule, FormsModule, MatPaginatorModule, MatIconModule, MatProgressBarModule, NgIf],
  templateUrl: './view-list.component.html',
  styleUrl: './view-list.component.css'
})
export class ViewListComponent implements OnInit, AfterViewInit {

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


    //load data
    this.networkService.loadAllData().subscribe({
      next: (users) => {
        this.remoteDataLoaded = true
        this.remoteData.set(users)
      },
      error: (error) => {
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


}
