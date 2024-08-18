import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BudgetModel, ExpenseModel } from '../expense.models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { NewCategoryComponent } from './new-category-dialog.component';
import { ExpenseService } from '../expense.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, MatProgressBarModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {


  readonly dialog = inject(MatDialog);

  categoryMap = signal<{
    categoryObjects?: ExpenseModel[] | undefined;
    id?: number | undefined;
    title?: string | undefined;
    budget?: BudgetModel | undefined;
    dateTime?: string | undefined;
    totalExpense: number | undefined;
  }[]>([])




  constructor(
    private expenseService: ExpenseService
  ) { }

  ngOnInit(): void {
    const categoryMap = this.expenseService.getCategoryExpensesMap()


    const expenseCategory = categoryMap.map((cat, i) => {
      const expenses = (cat?.categoryObjects.map(expense => expense.amount))

      const totalExpense = expenses?.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

      return { totalExpense, ...cat }
    })
    this.categoryMap.set(expenseCategory)
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewCategoryComponent, {});

    dialogRef.afterClosed().subscribe(result => {
    });
  }



}
