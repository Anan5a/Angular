import { Injectable } from '@angular/core';
import { ExpenseService } from '../expense/expense.service';


export type ChartStruct = {
  title: string
  subtitle?: string
}

export type LineChartStruct = ChartStruct & {
  xAxisTitle: string
  yAxisTitle: string
  categories: (string | number | null)[]
  series: SeriesTypeLine[],
}
export type BarChartStruct = ChartStruct & {
  xAxisTitle: string
  yAxisTitle: string
  categories: (string)[]
  series: SeriesTypeBar[],
}

export type PieChartStruct = ChartStruct & {

  data: SeriesTypeDataPie[],
}



export type SeriesTypeLine = {
  type: "line"
  name: string
  data: (string | number | null)[]
}
export type SeriesTypeBar = {
  name: string
  data: (number | null)[]
}
export type SeriesTypeDataPie = {
  name: string
  y: number
}


@Injectable({
  providedIn: 'root'
})
export class ChartingService {
  private _months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  private _days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  private _years = Array.from({ length: 5 }, (_, i) => (2023 + i).toString());


  constructor(private expenseService: ExpenseService) { }


  getLineChartData(title: string, subtitle: string, xAxisTitle: string, yAxisTitle: string, catType: "monthly" | "yearly" | "daily", date1?: string, date2?: string) {
    //income vs expense
    const expenseData = this.expenseService.getRangeExpenseData(date1, date2)
    const incomeData = this.expenseService.getRangeIncomeData(date1, date2)
    if (!expenseData && !incomeData) {
      //no data to show
      return null
    }

    const categories: string[] = catType == "monthly"
      ? this._months
      : (catType == "daily" ? this._days : this._years)

    let expenseList: SeriesTypeLine = {
      type: "line",
      name: 'Expense',
      data: []
    }
    let incomeList: SeriesTypeLine = {
      type: "line",
      name: 'Income',
      data: []
    }

    //fill the data
    if (expenseData) {
      const _explist: (number | null)[] = Array.from({ length: categories.length }, (_, i) => null)
      expenseData.forEach((expense, id, list) => {
        const date = new Date(expense.dateTime)
        if (catType == "monthly") {
          //fill day fields
          _explist[date.getUTCMonth() - 1] = _explist[date.getUTCMonth() - 1]! + expense.amount
        } else if (catType == "daily") {

          _explist[date.getUTCDate() - 1] = _explist[date.getUTCDate() - 1]! + expense.amount
        }
      })

      expenseList.data = [..._explist]

    }
    if (incomeData) {
      const _inclist: (number | null)[] = Array.from({ length: categories.length }, (_, i) => null)
      incomeData.forEach((income, id, list) => {
        const date = new Date(income.dateTime)
        if (catType == "monthly") {
          //fill day fields
          _inclist[date.getUTCMonth() - 1] = _inclist[date.getUTCMonth() - 1]! + income.amount
        } else if (catType == "daily") {

          _inclist[date.getUTCDate() - 1] = _inclist[date.getUTCDate() - 1]! + income.amount
        }
      })

      incomeList.data = [..._inclist]
    }

    const lineChartData: LineChartStruct = {
      title, xAxisTitle, yAxisTitle, subtitle,
      categories: categories,
      series: [expenseList, incomeList]
    }
    return lineChartData
  }

  getPieChartData(title: string, subtitle: string, catType: "monthly" | "yearly" | "daily", date1?: string, date2?: string) {
    //breakdown of expenses
    const expenseData = this.expenseService.getRangeExpenseData(date1, date2)
    if (!expenseData) {
      //no data to show
      return null
    }
    //here we need actual expense categories
    const categoriesIds = expenseData.map(expense => expense.categoryId)

    let expenseList: SeriesTypeDataPie[] = []
    //fill the data
    if (expenseData) {
      const _explist: (number | null)[] = Array.from({ length: categoriesIds.length }, (_, i) => null)
      expenseData.forEach((expense, id, list) => {
        const catIndex = categoriesIds.indexOf(expense.categoryId)
        _explist[catIndex] = _explist[catIndex]! + expense.amount

      })

      //map and decode categories

      expenseList = categoriesIds.map((catId, index) => {

        return { name: this.decodeCatId(catId), y: _explist[index]! }
      })

    }


    const pieChartData: PieChartStruct = {
      title, subtitle,
      data: expenseList
    }
    return pieChartData
  }
  getBarChartData(title: string, subtitle: string, xAxisTitle: string, yAxisTitle: string) {
    //display savings
    //savings is basically income-expense over a month, so it is always monthly

    const expenseData = this.expenseService.getRangeExpenseData()
    const incomeData = this.expenseService.getRangeIncomeData()
    if (!expenseData && !incomeData) {
      //no data to show
      return null
    }

    let savingsList: SeriesTypeBar = {
      name: 'Savings',
      data: []
    }
    const categories: string[] = this._months
    //fill the data
    const _explist: (number | null)[] = Array.from({ length: categories.length }, (_, i) => null)
    const _inclist: (number | null)[] = Array.from({ length: categories.length }, (_, i) => null)
    if (expenseData) {
      expenseData.forEach((expense, id, list) => {
        const date = new Date(expense.dateTime)
        _explist[date.getUTCMonth() - 1] = _explist[date.getUTCMonth() - 1]! + expense.amount

      })
    }
    if (incomeData) {
      incomeData.forEach((income, id, list) => {
        const date = new Date(income.dateTime)
        _inclist[date.getUTCMonth() - 1] = _inclist[date.getUTCMonth() - 1]! + income.amount

      })
    }

    //divide to get the data
    const savingsListData = categories.map((catName, idx, list) => {
      const diff = parseFloat((_inclist[idx]! - _explist[idx]!).toFixed(2));
      return diff
    })
    savingsList.data = savingsListData;

    const barChartData: BarChartStruct = {
      title, xAxisTitle, yAxisTitle, subtitle, categories,
      series: [savingsList]
    }
    return barChartData
  }


  private decodeCatId(catId: number) {
    return this.expenseService.getCategoryById(catId)?.title || ''
  }
}
