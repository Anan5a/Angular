import { Injectable } from '@angular/core';
import { ExpenseService } from '../expense/expense.service';

@Injectable({
  providedIn: 'root'
})
export class ChartingService {

  constructor(private expenseService: ExpenseService) { }


  lineChartData() {
    //income vs expense
    const expenseData = this.expenseService.getRangeExpenseData()
    if (!expenseData) {
      return
    }

  }

  pieChartData() {
    //breakdown of expenses
  }
  barChartData() {
    //display savings
  }
}
