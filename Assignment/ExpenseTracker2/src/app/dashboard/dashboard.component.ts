import { Component, computed, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ExpenseTableComponent } from '../expense/expense-table/expense-table.component';
import { PieChartComponent } from "./pie-chart/pie-chart.component";
import { LineChartComponent } from "./line-chart/line-chart.component";
import { BarChartComponent } from "./bar-chart/bar-chart.component";
import { BarChartStruct, ChartingService, LineChartStruct, PieChartStruct } from './charting.service';
import { NewExpenseComponent } from '../expense/new-expense/new-expense.component';
import { NewCategoryComponent } from '../expense/category/new-category-dialog.component';
import { NewIncomeComponent } from '../expense/new-income/new-income.component';
import { ExpenseService } from '../expense/expense.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, MatTableModule, MatPaginatorModule, ExpenseTableComponent, PieChartComponent, LineChartComponent, BarChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {


  //chart data
  catType = signal<"monthly" | "yearly" | "daily">("daily")
  dateFrom = signal<string>("")
  dateTo = signal<string>("")
  xAxisTitle__Line = signal("Days")
  xAxisTitle__Bar = signal("Months")
  yAxisTitle__Bar = signal("Savings")

  linechartData = this.chartingService.getLineChartData(
    "Expense vs Income",
    "Your expense and income comparison over time",
    this.xAxisTitle__Line(),
    "Expense and Income",
    this.catType(),
    this.dateFrom(),
    this.dateTo()
  );
  piechartData = computed(() => {
    return this.chartingService.getPieChartData(
      "Expense Breakdown",
      "Where you spent your money",
      this.catType(),
      this.dateFrom(),
      this.dateTo()
    )()
  })
  barchartData = computed(() => {
    return this.chartingService.getBarChartData(
      "Savings Breakdown",
      "How much you saved over the months",
      this.xAxisTitle__Bar(),
      this.yAxisTitle__Bar()
    )()
  })
  ///




  constructor(private chartingService: ChartingService, private readonly dialog: MatDialog, private expenseService: ExpenseService) { }


  ngOnInit(): void {

  }


  openNewExpenseDialog() {
    const dialogRef = this.dialog.open(NewExpenseComponent, {});

    dialogRef.afterClosed().subscribe(result => { });
  }
  openNewCategoryDialog() {
    const dialogRef = this.dialog.open(NewCategoryComponent, {});

    dialogRef.afterClosed().subscribe(result => { });
  }
  openNewIncomeialog() {
    const dialogRef = this.dialog.open(NewIncomeComponent, {});

    dialogRef.afterClosed().subscribe(result => { });
  }

}
