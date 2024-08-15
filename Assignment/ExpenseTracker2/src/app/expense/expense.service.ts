import { Injectable, signal } from '@angular/core';
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

  private storageKey = 'ExpenseDataModel-'


  constructor(
    private authService: AuthService
  ) {
    if (authService.isAuthenticated()) {
      this.storageKey = this.storageKey + authService.user()?.id
    }
    this.loadAllData()
  }

  get categories() {
    return this._categories.asReadonly()
  }
  addNewCategory(cat: CategoryModel) {
    this._categories.update((categories) => { categories.push(cat); return categories; })
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
  addNewExpense(expense: ExpenseModel) {
    this._expenses.update((expenses) => { expenses.push(expense); return expenses; })
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

  getRangeExpenseData(date1?: string, date2?: string) {
    //return items of a specific date/period or range
    if ((!date1 && !date2)) {
      //return all expenses
      return this.expenses()
    }
    if (date1 && !date2) {
      //return items of date
      const parsedDate = new Date(date1)

      return this.expenses().filter((expense) => {
        const _parsedDate = new Date(expense.dateTime)
        return _parsedDate.getDate() == parsedDate.getDate() && _parsedDate.getMonth() == parsedDate.getMonth() && _parsedDate.getUTCFullYear() == parsedDate.getUTCFullYear()
      })

    }
    if (date1 && date2) {
      const parsedDate1 = new Date(date1)
      const parsedDate2 = new Date(date1)

      return this.expenses().filter((expense) => {
        const _parsedDate = new Date(expense.dateTime)
        return _parsedDate >= parsedDate1 || _parsedDate <= parsedDate2
      })
    }
    return null

  }

  getRangeIncomeData(date1?: string, date2?: string,) {
    //return income items of a specific date/period
    if (!date1 && !date2) {
      //return all expenses
      return this.incomes()
    }
    if (date1 && !date2) {
      //return items of date
      const parsedDate = new Date(date1)

      return this.incomes().filter((income) => {
        const _parsedDate = new Date(income.dateTime)
        return _parsedDate.getDate() == parsedDate.getDate() && _parsedDate.getMonth() == parsedDate.getMonth() && _parsedDate.getUTCFullYear() == parsedDate.getUTCFullYear()
      })

    }
    if (date1 && date2) {
      const parsedDate1 = new Date(date1)
      const parsedDate2 = new Date(date1)

      return this.incomes().filter((income) => {
        const _parsedDate = new Date(income.dateTime)
        return _parsedDate >= parsedDate1 || _parsedDate <= parsedDate2
      })
    }
    return null




  }






  addNewIncome(income: IncomeModel) {
    this._incomes.update((incomes) => { incomes.push(income); return incomes; })
    this.storeAllData()
  }
  removeIncome(income: IncomeModel) {
    const incomes = [...this._incomes()]
    const newIncomeList = incomes.filter(inc => inc.id !== income.id)
    this._incomes.set(newIncomeList)
    this.storeAllData()
  }


  private loadAllData() {
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
