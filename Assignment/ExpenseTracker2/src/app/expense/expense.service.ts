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
      this.loadAllData()
    }
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
