import { computed, Injectable, signal } from '@angular/core';
import { CategoryModel, ExpenseDataModel, ExpenseModel, IncomeModel } from './expense.models';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  //export interface ExpenseDataModel {
  //   expenses: ExpenseModel[]
  //   incomes: IncomeModel[]
  //   categories: CategoryModel[]
  // }

  private _expenses = signal<ExpenseModel[]>([])
  private _incomes = signal<IncomeModel[]>([])
  private _categories = signal<CategoryModel[]>([])
  private __expenseDataModel = signal<ExpenseDataModel | null>(null)

  private _filterDateRange = signal<{ start: undefined | string, end: undefined | string }>({ start: undefined, end: undefined })

  private storageKey = 'ExpenseDataModel-'


  constructor(
    private authService: AuthService
  ) {
    if (authService.isAuthenticated()) {
      this.storageKey = this.storageKey + authService.user()?.id
      this.loadAllData()
    }
  }

  get categories() {
    return this._categories.asReadonly()
  }
  addNewCategory(cat: CategoryModel) {
    this._categories.update((categories) => {
      //check if an old id exists, and remove
      const filtered = categories.filter(category => category.id !== cat.id)

      filtered.push(cat);
      return filtered;
    })
    this.storeAllData()
  }
  removeCategory(category: CategoryModel) {
    const categories = [...this._categories()]
    const newCatList = categories.filter(cat => cat.id !== category.id)
    this._categories.set(newCatList)
    this.storeAllData()
  }

  get expenses() {
    return this._expenses.asReadonly()
  }

  setFilterDateRange(date1?: string, date2?: string) {
    this._filterDateRange.set({ start: date1, end: date2 })
  }
  addNewExpense(expense: ExpenseModel) {
    this._expenses.update((expenses) => {
      const filtered = expenses.filter(exp => exp.id !== expense.id)
      filtered.push(expense);
      return filtered;
    })
    this.storeAllData()
  }
  removeExpense(expense: ExpenseModel) {
    const expenses = [...this._expenses()]
    const newExpenseList = expenses.filter(exp => exp.id !== expense.id)
    this._expenses.set(newExpenseList)
    this.storeAllData()
  }

  get incomes() {
    return this._incomes.asReadonly()
  }

  getCategoryData(catId: number) {
    //return list of items of a specific category
    //find the category
    const category = this.categories().find((cat) => cat.id === catId)
    if (!category) {
      return null
    }
    const catItems = this.expenses().filter(expense => expense.categoryId === category.id)
    return { ...category, categoryObjects: [...catItems] }
  }
  getCategoryById(catId: number) {
    return this.categories().find((cat) => cat.id === catId)
  }

  get getRangeExpenseData() {
    return computed(() => {
      // console.log('recompute: getRangeExpenseData')
      //return items of a specific date/period or range
      const expenses = this.expenses()
      const { start, end } = this._filterDateRange()

      if ((!start && !end)) {
        //return all expenses
        return expenses
      }
      if (start && !end) {
        //return items of date
        const parsedDate = new Date(start)

        return expenses.filter((expense) => {
          const _parsedDate = new Date(expense.dateTime)
          return _parsedDate.getDate() == parsedDate.getDate() && _parsedDate.getMonth() == parsedDate.getMonth() && _parsedDate.getUTCFullYear() == parsedDate.getUTCFullYear()
        })

      }
      if (start && end) {
        const parsedDate1 = new Date(start)
        const parsedDate2 = new Date(start)

        return expenses.filter((expense) => {
          const _parsedDate = new Date(expense.dateTime)
          return _parsedDate >= parsedDate1 || _parsedDate <= parsedDate2
        })
      }
      return null
    })

  }

  getCategoryExpensesMap() {
    //this maps expenses and limits of each category
    return computed(() => {
      const allCategory = this.categories()
      const catMap = allCategory.map(category => this.getCategoryData(category.id))
      return catMap;
    })
  }

  get getRangeIncomeData() {
    return computed(() => {
      // console.log('recompute: getRangeIncomeData')

      const { start, end } = this._filterDateRange()
      const incomes = this.incomes()
      //return income items of a specific date/period
      if (!start && !end) {
        //return all expenses
        return this.incomes()
      }
      if (start && !end) {
        //return items of date
        const parsedDate = new Date(start)

        return this.incomes().filter((income) => {
          const _parsedDate = new Date(income.dateTime)
          return _parsedDate.getDate() == parsedDate.getDate() && _parsedDate.getMonth() == parsedDate.getMonth() && _parsedDate.getUTCFullYear() == parsedDate.getUTCFullYear()
        })

      }
      if (start && end) {
        const parsedDate1 = new Date(start)
        const parsedDate2 = new Date(start)

        return this.incomes().filter((income) => {
          const _parsedDate = new Date(income.dateTime)
          return _parsedDate >= parsedDate1 || _parsedDate <= parsedDate2
        })
      }
      return null
    })
  }

  addNewIncome(income: IncomeModel) {
    this._incomes.update((incomes) => [...incomes, income])
    this.storeAllData()
  }
  removeIncome(income: IncomeModel) {
    const incomes = [...this._incomes()]
    const newIncomeList = incomes.filter(inc => inc.id !== income.id)
    this._incomes.set(newIncomeList)
    this.storeAllData()
  }


  loadAllData() {
    const storedJson = window.localStorage.getItem(this.storageKey)
    if (storedJson !== null) {
      //try decoding json
      const decodedJson = JSON.parse(storedJson) as ExpenseDataModel;
      if (decodedJson) {
        this._expenses.set(decodedJson.expenses)
        this._categories.set(decodedJson.categories)
        this._incomes.set(decodedJson.incomes)
        this.__expenseDataModel.set(decodedJson)
        return decodedJson
      }
    }
    return null
  }

  private storeAllData() {

    //update expense data model
    const newDataModel = {
      categories: [...this._categories()],
      expenses: [...this._expenses()],
      incomes: [...this._incomes()],
    } as ExpenseDataModel
    //
    window.localStorage.setItem(this.storageKey, JSON.stringify(newDataModel))

  }

}
