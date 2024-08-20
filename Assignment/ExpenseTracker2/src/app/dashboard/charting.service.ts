import { computed, Injectable, signal } from '@angular/core';
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

  //chart param configuration for reactive capability
  private lineChartParamsSignal = signal<{ title: string, subtitle: string, xAxisTitle: string, yAxisTitle: string, catType: "monthly" | "yearly" | "daily" }>({
    title: "Expense vs Income",
    subtitle: "Your expense and income comparison over time",
    xAxisTitle: 'Days',
    yAxisTitle: "Expense and Income",
    catType: 'daily'
  });

  private pieChartParamsSignal = signal<{
    title: string;
    subtitle: string;
    catType: "monthly" | "yearly" | "daily";
  }>({
    title: "Expense Breakdown",
    subtitle: "Where you spent your money",
    catType: 'daily',
  });
  private barChartParamsSignal = signal<{
    title: string;
    subtitle: string;
    xAxisTitle: string;
    yAxisTitle: string;
  }>({
    title: "Savings Breakdown",
    subtitle: "How much you saved over the months",
    xAxisTitle: 'Months',
    yAxisTitle: 'Savings'
  });




  //end chart config
  constructor(private expenseService: ExpenseService) { }

  setLineChartParams(title: string, subtitle: string, xAxisTitle: string, yAxisTitle: string, catType: "monthly" | "yearly" | "daily") {
    this.lineChartParamsSignal.set({ title, subtitle, xAxisTitle, yAxisTitle, catType });
  }

  setPieChartParams(title: string, subtitle: string, catType: "monthly" | "yearly" | "daily") {
    this.pieChartParamsSignal.set({ title, subtitle, catType });
  }
  setBarChartParams(title: string, subtitle: string, xAxisTitle: string, yAxisTitle: string) {
    this.barChartParamsSignal.set({ title, subtitle, xAxisTitle, yAxisTitle });
  }





  get getLineChartData() {
    return computed(() => {
      const { title, subtitle, xAxisTitle, yAxisTitle, catType } = this.lineChartParamsSignal();
      //income vs expense
      const expenseData = this.expenseService.getRangeExpenseData()
      const incomeData = this.expenseService.getRangeIncomeData()

      // console.log("recomputing linechart...")

      if (!expenseData?.length && !incomeData?.length) {
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
        expenseData?.forEach((expense, id, list) => {
          const date = new Date(expense.dateTime)
          if (catType == "monthly") {
            //fill day fields
            _explist[date.getUTCMonth()] = _explist[date.getUTCMonth()]! + expense.amount
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
            _inclist[date.getUTCMonth()] = _inclist[date.getUTCMonth()]! + income.amount
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
    })

  }


  get getPieChartData() {
    return computed(() => {
      // console.log("recomputing piechart...")
      const { title, subtitle, catType } = this.pieChartParamsSignal();

      //breakdown of expenses
      const expenseData = this.expenseService.getRangeExpenseData()
      if (!expenseData) {
        //no data to show
        return null
      }
      //here we need actual expense categories,unique
      const categoriesIds = [...(new Set(expenseData.map(expense => expense.categoryId)))]

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
    })
  }
  get getBarChartData() {
    return computed(() => {
      // console.log("recomputing barchart...")

      //display savings
      //savings is basically income-expense over a month, so it is always monthly
      const { title, subtitle, xAxisTitle, yAxisTitle } = this.barChartParamsSignal();

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
          _explist[date.getUTCMonth()] = _explist[date.getUTCMonth()]! + expense.amount

        })
      }
      if (incomeData) {
        incomeData.forEach((income, id, list) => {
          const date = new Date(income.dateTime)
          _inclist[date.getUTCMonth()] = _inclist[date.getUTCMonth()]! + income.amount

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
    })
  }


  private decodeCatId(catId: number) {
    return this.expenseService.getCategoryById(catId)?.title || ''
  }
}
