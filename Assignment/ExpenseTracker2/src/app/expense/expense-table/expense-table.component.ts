import { AfterViewInit, Component, Input, OnInit, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CategoryModel, ExpenseModel } from '../expense.models';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ExpenseService } from '../expense.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expense-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, DatePipe],
  templateUrl: './expense-table.component.html',
  styleUrl: './expense-table.component.scss'
})
export class ExpenseTableComponent implements OnInit {
  expenses = signal<ExpenseModel[]>([])

  dataSource = new MatTableDataSource<ExpenseModel>();

  displayedColumns: string[] = ['category', 'title', 'amount', 'dateTime'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private expenseService: ExpenseService) { }

  ngOnInit(): void {
    this.expenses.set(this.expenseService.expenses())
    this.dataSource.data = this.expenses()
    this.dataSource.paginator = this.paginator;
  }

  decodeCatId(id: number) {
    return this.expenseService.getCategoryById(id)?.title || '[!]'
  }
}
