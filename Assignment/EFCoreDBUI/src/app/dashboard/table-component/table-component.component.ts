import { AfterViewInit, ChangeDetectorRef, Component, effect, EventEmitter, Input, OnChanges, OnInit, Output, Signal, signal, SimpleChanges, ViewChild } from '@angular/core';
import { MaterialImportsModule } from '../../material-imports/material-imports.module';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelExportService } from '../../services/excel-export.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgFor, NgIf } from '@angular/common';

export interface ColumnDef {
  def: string; // Use keyof to ensure it's a valid key
  header: string;
  pipe?: string;
}
@Component({
  selector: 'app-table-component',
  standalone: true,
  imports: [MaterialImportsModule, FormsModule, DatePipe, NgFor, NgIf],
  templateUrl: './table-component.component.html',
  styleUrl: './table-component.component.css'
})
export class TableComponentComponent<T> implements OnInit, AfterViewInit, OnChanges {

  @Input({ required: true }) tableId!: string
  @Input({ required: true }) remoteDataLoaded = false
  @Input({ required: true }) exportName!: string
  @Input({ required: true }) columns!: ColumnDef[]
  @Input({ required: true }) remoteData!: T[]
  @Input() showActions!: string[] //edit,delete
  @Input() showAddButton: boolean = false
  @Output() onEditEvent = new EventEmitter<T>()
  @Output() onDeleteEvent = new EventEmitter<T>()
  @Output() onAddEvent = new EventEmitter<void>()

  ///end inputs///
  disableExport = false
  searchText: string = '';

  displayedColumns: string[] = []

  dataSource = new MatTableDataSource<T>([]);

  remoteDataFinal = signal<T[]>([])

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort

  constructor(private dialog: MatDialog, private excelExportService: ExcelExportService, private cdr: ChangeDetectorRef) {
    effect(() => {
      if (this.remoteDataFinal()) {
        this.dataSource.data = this.remoteDataFinal()
      }
    })

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.remoteDataFinal.set(changes["remoteData"].currentValue)
  }

  ngOnInit(): void {
    this.dataSource.data = this.remoteData
    this.displayedColumns = this.columns.map(column => column.def as string);
    this.initiateActions()
    this.loadList()
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.customFilter;
    this.sort.sortChange.subscribe((cond) => {
      this.applySort(cond);
      this.paginator.pageIndex = 0
    });

  }
  initiateActions() {
    if (this.showActions && this.showActions.length > 0) {
      this.displayedColumns.push("actions")
    }
  }

  onSortReset() {
    //reset sorting and filters
    this.searchText = ""
    this.dataSource.filter = ""
    this.remoteDataFinal.set(this.remoteData)
    this.paginator.pageIndex = 0

  }
  customFilter = (data: T, filter: string) => {
    if (!filter) {
      return true;
    }

    const lowerCaseFilter = filter.toLowerCase();

    return Object.values(data!).some(value => {
      return (
        typeof value === 'string' && value.toLowerCase().includes(lowerCaseFilter) ||
        typeof value === 'number' && value.toString().includes(lowerCaseFilter) ||
        value instanceof Date && value.toISOString().includes(lowerCaseFilter)
      );
    });
  };

  applySort(cond: { active: string, direction: string }) {

    const data = [...this.remoteDataFinal()]

    const sorted = data.sort((a, b) => {
      const valueA = a[cond.active as keyof typeof a];
      const valueB = b[cond.active as keyof typeof b];
      const dateA = new Date(valueA as string);
      const dateB = new Date(valueB as string);
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (cond.direction === 'asc' ? 1 : -1) * (valueA - valueB);
      }

      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return (cond.direction === 'asc' ? 1 : -1) * (dateA.getTime() - dateB.getTime());
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return (cond.direction === 'asc' ? 1 : -1) * valueA.localeCompare(valueB);
      }

      return 0;
    });

    this.remoteDataFinal.set(sorted)

  }
  applyFilter() {
    this.dataSource.filter = this.searchText;
  }

  onShare() {
    throw new Error('Method not implemented.');
  }

  loadList() {
    this.remoteDataFinal.set(this.remoteData)
  }
  onClickExport() {
    this.disableExport = true
    this.excelExportService.exportTableToExcel(this.tableId, this.exportName, this.showActions.length > 0)
    this.disableExport = false
  }
  ///action events
  onClickEdit(rowItem: T) {
    this.onEditEvent.emit(rowItem)
  }
  onClickDelete(rowItem: T) {

    this.onDeleteEvent.emit(rowItem)
  }
  onClickAdd() {
    this.onAddEvent.emit()
  }

}
