import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NewExpenseComponent } from './new-expense/new-expense.component';
import { CategoryModel, ExpenseModel } from './expense.models';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ExpenseTableComponent } from './expense-table/expense-table.component';
import { FabService } from '../fab.service';
import { PieChartComponent } from "../dashboard/pie-chart/pie-chart.component";
import { ChartingService, PieChartStruct } from '../dashboard/charting.service';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, MatTableModule, MatPaginatorModule, ExpenseTableComponent, PieChartComponent],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss'
})
export class ExpenseComponent {
  //chart data
  catType = signal<"monthly" | "yearly" | "daily">("daily")
  dateFrom = signal<string>("")
  dateTo = signal<string>("")


  constructor(
    // private matDialogRef: MatDialogRef<NewCategoryComponent>
    private readonly dialog: MatDialog,
  ) {
  }


  openDialog() {
    const dialogRef = this.dialog.open(NewExpenseComponent, {});

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
