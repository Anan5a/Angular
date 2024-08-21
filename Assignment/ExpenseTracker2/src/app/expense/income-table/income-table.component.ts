import { AfterViewInit, Component, effect, Input, OnInit, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CategoryModel, ExpenseModel, IncomeModel } from '../expense.models';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ExpenseService } from '../expense.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-income-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, DatePipe, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule],
  templateUrl: './income-table.component.html',
  styleUrl: './income-table.component.scss'
})
export class IncomeTableComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<IncomeModel>([]);

  searchText: string = '';

  displayedColumns: string[] = ['source', 'amount', 'dateTime'];
  totalCosts = 0

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private expenseService: ExpenseService) {
    effect(() => {
      const items = [...this.expenseService.incomes()].sort((a, b) => Date.parse(b.dateTime) - Date.parse(a.dateTime))
      this.dataSource.data = items
      this.totalCosts = items.map(t => t.amount).reduce((acc, value) => acc + value, 0);
    })
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = this.customFilter;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  customFilter = (data: IncomeModel, filter: string) => {
    return data.source != undefined ? data.source.toLowerCase()?.indexOf(filter) >= 0 : false;
  };


  applyFilter() {
    this.dataSource.filter = this.searchText;
  }


}
