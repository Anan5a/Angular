import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CategoryModel, ExpenseModel } from '../expense.models';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-expense-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './expense-table.component.html',
  styleUrl: './expense-table.component.scss'
})
export class ExpenseTableComponent implements AfterViewInit {
  tmpExpenses: ExpenseModel[] = Array.from({ length: 100 }, (_, i) => { return { amount: 100 * Math.random(), category: { title: "myCat" + (i % 10) } as CategoryModel, id: (new Date()).getMilliseconds(), title: 'Expense ' + i, dateTime: (new Date()).toDateString() } })

  dataSource = new MatTableDataSource<ExpenseModel>(this.tmpExpenses);
  displayedColumns: string[] = ['category', 'title', 'amount', 'date'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
