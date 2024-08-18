import { AfterViewInit, Component, Input, OnInit, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CategoryModel, ExpenseModel } from '../expense.models';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ExpenseService } from '../expense.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-expense-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, DatePipe, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule],
  templateUrl: './expense-table.component.html',
  styleUrl: './expense-table.component.scss'
})
export class ExpenseTableComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<ExpenseModel>(this.expenseService.expenses());

  searchText: string = '';

  displayedColumns: string[] = ['category', 'title', 'amount', 'dateTime'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private expenseService: ExpenseService) { }

  ngOnInit(): void {
    this.dataSource.filterPredicate = this.customFilter;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  customFilter = (data: ExpenseModel, filter: string) => {
    console.log("filtering: " + filter)
    return data.title != undefined ? data.title.toLowerCase()?.indexOf(filter) >= 0 : false;
  };

  decodeCatId(id: number) {
    return this.expenseService.getCategoryById(id)?.title || '[!]'
  }

  applyFilter() {
    this.dataSource.filter = this.searchText;

  }
}
