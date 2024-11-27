import {
  AfterViewInit,
  Component,
  effect,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ApiBaseImageUrl } from '../../../constants';
import { FileMetadataResponse, User } from '../../app.models';
import { UserService } from '../../services/user.service';
import { EditFileDialogComponent } from '../view-file-list/edit-file-dialog/edit-file-dialog.component';
import { NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    NgIf,
    DatePipe,
    MatButtonToggleModule,
    MatChipsModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit, AfterViewInit {
  disableExport = false;

  dataSource = new MatTableDataSource<User>([]);

  remoteData = signal<User[]>([]);

  searchText = '';

  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'create-date',
    'status',
    'role',
  ];
  remoteDataLoaded = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private toastrService: ToastrService
  ) {
    effect(() => {
      this.dataSource.data = this.remoteData();
    });
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = this.customFilter;
    this.remoteDataLoaded = false;
    this.dataSource.paginator = this.paginator;
    this.loadList();
  }

  ngAfterViewInit(): void {}
  customFilter = (data: User, filter: string) => {
    const lowerCaseFilter = filter.toLowerCase();

    return Object.values(data).some((value) => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerCaseFilter);
      }
      return false;
    });
  };

  applyFilter() {
    this.dataSource.filter = this.searchText;
  }
  onDelete(fileId: number) {
    if (window.confirm('The file will be deleted permanently')) {
      this.remoteDataLoaded = false;
      this.userService.deleteFile(fileId).subscribe({
        next: (response) => {
          this.remoteDataLoaded = true;
          this.toastrService.success(response?.data);
          //remove item from list
          const newList = [
            ...this.remoteData().filter((item) => item.id !== fileId),
          ];
          this.remoteData.set(newList);
        },
        error: () => {
          this.remoteDataLoaded = false;
        },
      });
    }
  }

  onDownload(fileId: number) {
    this.remoteDataLoaded = false;
    this.userService.downloadFile(fileId).subscribe({
      next: (response) => {
        this.toastrService.success('Download link generated successfully.');

        const downloadUrl = `${ApiBaseImageUrl}${response.data}`;
        this.remoteDataLoaded = true;
        window.open(downloadUrl, '_blank');
      },
    });
  }
  onEdit(fileMeta: FileMetadataResponse) {
    const dialogRef = this.dialog.open(EditFileDialogComponent, {
      maxWidth: '500px',
      width: '450px',
      data: { fileMeta },
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result?.status === true) {
    //     //update list
    //     const oldList = [... this.remoteData()];
    //     const index = oldList.findIndex(item => item.id === fileMeta.id);
    //     if (index !== -1) {
    //       oldList[index].fileName = result?.fileName;
    //     }
    //     this.remoteData.set(oldList);
    //   }
    // });
  }
  onShare() {
    throw new Error('Method not implemented.');
  }

  loadList() {
    this.userService.loadUsersList().subscribe({
      next: (response) => {
        this.remoteDataLoaded = true;
        this.remoteData.set(response.data!);
      },
      error: (error) => {
        this.remoteDataLoaded = true;
      },
    });
  }
  onClickExport() {
    this.disableExport = true;
    this.userService.exportAll().subscribe({
      next: (response) => {
        console.log(response);
        this.disableExport = false;
        this.downloadClientBlob(response);
      },
      error: (error) => {
        this.disableExport = false;
        window.alert('Failed to export the list!.');
      },
    });
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

  convertBytes(length: number): string {
    if (length === 0) return '0 B';

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(length) / Math.log(1024));

    return `${parseFloat((length / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }
}
