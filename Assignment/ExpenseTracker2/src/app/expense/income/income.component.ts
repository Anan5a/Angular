import { Component, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewIncomeComponent } from '../new-income/new-income.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { PieChartComponent } from '../../dashboard/pie-chart/pie-chart.component';
import { ExpenseTableComponent } from '../expense-table/expense-table.component';
import { LineChartComponent } from "../../dashboard/line-chart/line-chart.component";
import { IncomeTableComponent } from "../income-table/income-table.component";

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, MatTableModule, MatPaginatorModule, ExpenseTableComponent, LineChartComponent, IncomeTableComponent],
  templateUrl: './income.component.html',
  styleUrl: './income.component.scss'
})
export class IncomeComponent {
  catType = signal<"monthly" | "yearly" | "daily">("daily")
  dateFrom = signal<string>("")
  dateTo = signal<string>("")


  constructor(
    // private matDialogRef: MatDialogRef<NewCategoryComponent>
    private readonly dialog: MatDialog,
  ) {
  }


  openDialog() {
    const dialogRef = this.dialog.open(NewIncomeComponent, {});

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
