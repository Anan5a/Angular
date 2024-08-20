import { AfterViewInit, Component, effect, Input, OnInit, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CategoryModel, ExpenseModel } from '../expense.models';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ExpenseService } from '../expense.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { NewExpenseComponent } from '../new-expense/new-expense.component';

@Component({
  selector: 'app-expense-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, DatePipe, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './expense-table.component.html',
  styleUrl: './expense-table.component.scss'
})
export class ExpenseTableComponent implements OnInit, AfterViewInit {


  dataSource = new MatTableDataSource<ExpenseModel>([]);

  searchText: string = '';

  displayedColumns: string[] = ['category', 'title', 'amount', 'dateTime', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private expenseService: ExpenseService, private readonly dialog: MatDialog,
  ) {
    effect(() => {
      this.dataSource.data = [...this.expenseService.expenses()].sort((a, b) => Date.parse(b.dateTime) - Date.parse(a.dateTime))
    })
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = this.customFilter;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  customFilter = (data: ExpenseModel | null, filter: string) => {
    return data?.title != undefined ? data.title.toLowerCase()?.indexOf(filter) >= 0 : false;
  };

  decodeCatId(id: number) {
    return this.expenseService.getCategoryById(id)?.title || '[!]'
  }

  applyFilter() {
    this.dataSource.filter = this.searchText;
  }


  onExpenseDelete(expense: ExpenseModel) {
    if (window.confirm("This expense will be deleted forever.\nAre you sure?")) {
      //delete expense
      this.expenseService.removeExpense(expense)
    }
  }
  openExpenseEditDialog(expense: ExpenseModel) {
    const dialogRef = this.dialog.open(NewExpenseComponent, {
      data: { ...expense }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
