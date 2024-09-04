import { AfterViewInit, Component, effect, OnInit, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FileMetadataResponse, UserModel } from '../app.models';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, NgIf } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../services/user.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ApiBaseImageUrl, ApiBaseUrl } from '../../constants';
import { MatDialog } from '@angular/material/dialog';
import { EditFileDialogComponent } from './edit-file-dialog/edit-file-dialog.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-list',
  standalone: true,
  imports: [MatTableModule, MatInputModule, MatProgressSpinnerModule, FormsModule, MatPaginatorModule, MatIconModule, MatProgressBarModule, MatButtonModule, NgIf, DatePipe, MatButtonToggleModule, RouterLink],
  templateUrl: './view-list.component.html',
  styleUrl: './view-list.component.css'
})
export class ViewListComponent implements OnInit, AfterViewInit {

  disableExport = false;

  dataSource = new MatTableDataSource<FileMetadataResponse>([]);

  remoteData = signal<FileMetadataResponse[]>([])

  searchText: string = '';

  displayedColumns: string[] = ['name', 'date', 'action'];
  remoteDataLoaded = false
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService, private dialog: MatDialog) {
    effect(() => {
      this.dataSource.data = this.remoteData()
    })
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = this.customFilter;
    this.remoteDataLoaded = false
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadList()
  }
  customFilter = (data: FileMetadataResponse, filter: string) => {
    return data.fileName != undefined ? data.fileName.toLowerCase()?.indexOf(filter.toLocaleLowerCase()) >= 0 : false;
  };


  applyFilter() {
    this.dataSource.filter = this.searchText;
  }
  onDelete(fileId: number) {
    if (window.confirm("The file will be deleted permanently")) {
      this.remoteDataLoaded = false
      this.userService.deleteFile(fileId).subscribe({
        next: () => {
          this.remoteDataLoaded = true
          this.loadList()
        }, error: () => {
          this.remoteDataLoaded = false
        }
      })
    }


  }
  onDownload(fileId: number) {
    this.remoteDataLoaded = false
    this.userService.downloadFile(fileId).subscribe({
      next: (response) => {
        const downloadUrl = `${ApiBaseImageUrl}${response.data}`;
        this.remoteDataLoaded = true
        window.open(downloadUrl, '_blank')
      }
    })
  }
  onEdit(fileMeta: FileMetadataResponse) {

    const dialogRef = this.dialog.open(EditFileDialogComponent, {
      maxWidth: '500px',
      width: '450px',
      data: { fileMeta }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        //reload list
        this.loadList()
      }
    });

  }
  onShare() {
    throw new Error('Method not implemented.');
  }

  loadList() {
    this.userService.loadFileList().subscribe({
      next: (response) => {
        this.remoteDataLoaded = true
        this.remoteData.set(response.data!)
      },
      error: (error) => {
        this.remoteDataLoaded = true

      }
    })
  }
  onClickExport() {
    this.disableExport = true
    this.userService.exportAll().subscribe({
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
