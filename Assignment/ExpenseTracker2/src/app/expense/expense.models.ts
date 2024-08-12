export interface ExpenseModel {
  id: number
  title?: string
  category: CategoryModel
  amount: number
  dateTime: string
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
