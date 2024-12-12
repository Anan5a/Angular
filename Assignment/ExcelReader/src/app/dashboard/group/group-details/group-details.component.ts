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
import { FileMetadataResponse, GroupModel, User } from '../../../app.models';
import { UserService } from '../../../services/user.service';
import { EditFileDialogComponent } from '../../view-file-list/edit-file-dialog/edit-file-dialog.component';
import { NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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
    RouterLink,
  ],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.css',
})
export class GroupDetailsComponent implements OnInit, AfterViewInit {
  disableExport = false;

  dataSource = new MatTableDataSource<GroupModel>([]);

  remoteData = signal<GroupModel[]>([]);

  searchText = '';
  groupId = 0;

  displayedColumns: string[] = [
    'group_id',
    'group_name',
    'create-date',
    'action',
  ];
  remoteDataLoaded = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    effect(() => {
      this.dataSource.data = this.remoteData();
    });
  }

  ngOnInit(): void {
    // this.remoteDataLoaded = false;
    this.route.paramMap.subscribe((params) => {
      if (params.get('groupId') == null || params.get('groupId') == undefined) {
        //redirect to list
        this.router.navigate(['/admin', 'group', 'list']);
        return;
      }
      this.groupId = parseInt(params.get('groupId')!);
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.filterPredicate = this.customFilter;
    this.dataSource.paginator = this.paginator;
  }
  customFilter = (data: GroupModel, filter: string) => {
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
  onDelete(groupId: number) {
    // if (window.confirm('The file will be deleted permanently')) {
    //   this.remoteDataLoaded = false;
    //   this.userService.deleteFile(fileId).subscribe({
    //     next: (response) => {
    //       this.remoteDataLoaded = true;
    //       this.toastrService.success(response?.data);
    //       //remove item from list
    //       const newList = [
    //         ...this.remoteData().filter((item) => item.userId !== fileId),
    //       ];
    //       this.remoteData.set(newList);
    //     },
    //     error: () => {
    //       this.remoteDataLoaded = false;
    //     },
    //   });
    // }
  }

  onViewGroup(groupId: number) {
    this.router.navigate(['/admin', 'group', 'details', groupId]);
  }
  onEdit(fileMeta: FileMetadataResponse) {
    this.dialog.open(EditFileDialogComponent, {
      maxWidth: '500px',
      width: '450px',
      data: { fileMeta },
    });
  }

  loadList() {
    this.userService.loadGroupsList().subscribe({
      next: (response) => {
        this.remoteDataLoaded = true;
        this.remoteData.set(response.data!);
      },
      error: () => {
        this.remoteDataLoaded = true;
      },
    });
  }
}
