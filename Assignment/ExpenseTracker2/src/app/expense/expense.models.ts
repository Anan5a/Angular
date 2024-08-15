export interface ExpenseModel {
  id: number
  title?: string
  categoryId: number
  amount: number
  dateTime: string
  catStr?: string
}
export interface IncomeModel {
  id: number
  source: string
  amount: number
  dateTime: string
}
export interface CategoryModel {
  id: number
  title: string
  budget: BudgetModel
  dateTime: string
}
export interface BudgetModel {
  maxSpend: number
}

/////data model
//object for each user
export interface ExpenseDataModel {
  expenses: ExpenseModel[]
  incomes: IncomeModel[]
  categories: CategoryModel[]
}
