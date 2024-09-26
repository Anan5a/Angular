import { AfterViewInit, Component, effect, Input, OnInit, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FileEvent, FileMetadataResponse } from '../../app.models';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, NgIf } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ApiBaseImageUrl, ApiBaseUrl } from '../../../constants';
import { MatDialog } from '@angular/material/dialog';
import { EditFileDialogComponent } from './edit-file-dialog/edit-file-dialog.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-view-file-list',
  standalone: true,
  imports: [MatTableModule, MatInputModule, MatProgressSpinnerModule, FormsModule, MatPaginatorModule, MatIconModule, MatProgressBarModule, MatButtonModule, NgIf, DatePipe, MatButtonToggleModule, RouterLink],
  templateUrl: './view-file-list.component.html',
  styleUrl: './view-file-list.component.css'
})
export class ViewFileListComponent implements OnInit, AfterViewInit {

  @Input({ required: false }) showSystemFileList?: boolean
  disableExport = false;

  dataSource = new MatTableDataSource<FileMetadataResponse>([]);

  remoteData = signal<FileMetadataResponse[]>([])

  searchText: string = '';

  displayedColumns: string[] = ['name', 'size', 'date', 'action'];
  remoteDataLoaded = false
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  pageTitle = "Files you uploaded"
  constructor(private userService: UserService, private dialog: MatDialog, private toastrService: ToastrService, private realtimeService: RealtimeService, private activatedRoute: ActivatedRoute) {
    effect(() => {
      this.dataSource.data = this.remoteData()
    })

    //configure realtime service for files
    this.realtimeService.addReceiveMessageListener<FileEvent[]>('FileChannel', (fileEvent: FileEvent) => {
      this.handleFileEvent(fileEvent)
    })
  }

  ngOnInit(): void {


    this.remoteDataLoaded = false
    this.showSystemFileList = this.activatedRoute.snapshot.data['systemFiles']||null
    if (this.showSystemFileList) {
      this.pageTitle = "Files in the system"
    }

    this.loadList()
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.customFilter;
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
        next: (response) => {
          this.remoteDataLoaded = true
          this.toastrService.success(response?.data)
          //remove item from list
          const newList = [...this.remoteData().filter((item) => item.id !== fileId)]
          this.remoteData.set(newList)
        },
        error: () => {
          this.remoteDataLoaded = true
        }
      })
    }
  }

  onDownload(fileId: number) {
    this.remoteDataLoaded = false
    this.userService.downloadFile(fileId).subscribe({
      next: (response) => {
        this.toastrService.success("Download link generated successfully.")

        const downloadUrl = `${ApiBaseImageUrl}${response.data}`;
        this.remoteDataLoaded = true
        window.open(downloadUrl, '_blank')
      },
      error: (error) => {
        this.remoteDataLoaded = true
      },
    })
  }
  onEdit(fileMeta: FileMetadataResponse) {

    const dialogRef = this.dialog.open(EditFileDialogComponent, {
      maxWidth: '500px',
      width: '450px',
      data: { fileMeta }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.status === true) {
        //update list
        const oldList = [... this.remoteData()];
        const index = oldList.findIndex(item => item.id === fileMeta.id);
        if (index !== -1) {
          oldList[index].fileName = result?.fileName;
          // + '.' + oldList[index].fileName.split('.')[oldList[index].fileName.split('.').length - 1];
        }
        this.remoteData.set(oldList);
      }
    });

  }
  onShare() {
    throw new Error('Method not implemented.');
  }

  loadList() {

    this.userService.loadFileList(this.showSystemFileList).subscribe({
      next: (response) => {
        this.remoteDataLoaded = true
        this.remoteData.set(response.data!)
      },
      error: (error) => {
        this.remoteDataLoaded = true
      },


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

  convertBytes(length: number): string {
    if (length === 0) return '0 B';

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(length) / Math.log(1024));

    return `${parseFloat((length / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }

  handleFileEvent(event: FileEvent) {
    // console.log(event)
    this.toastrService.info(event.message)

    if (event.shouldRefetchList) {
      //re-fetch whole list
      this.loadList()

    }
    if (event.wasFileDeleted) {
      //remove from list
      const newList = [...this.remoteData()].filter((item) => item.id !== event.fileId)

      this.remoteData.set(newList)

    }
    if (event.wasFileModified && event.fileMetadata == null) {
      //update file from server
      this.userService.getFileById(event.fileId).subscribe({
        next: (response) => {
          this.remoteDataLoaded = true
          const oldList = [...this.remoteData()];
          const index = oldList.findIndex(item => item.id === event.fileId);
          if (index !== -1) {
            oldList[index] = response.data!
          }
          this.remoteData.set(oldList);
        },
        error: (error) => {
          this.remoteDataLoaded = true

        }
      })

    }
    if (event.fileMetadata != null) {
      const newList = [... this.remoteData(), event.fileMetadata]
      this.remoteData.set(newList)

    }
  }




}
