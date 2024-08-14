import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NewCategoryComponent } from '../category/new-category-dialog.component';
import { CategoryModel, ExpenseModel } from '../expense.models';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-new-expense',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './new-expense.component.html',
  styleUrl: './new-expense.component.scss'
})
export class NewExpenseComponent {
  form = new FormGroup({
    name: new FormControl('', { validators: [] }),
    category: new FormControl('', { validators: [] }),//make dropdown
    expense: new FormControl('', { validators: [Validators.required] }),
  })

  constructor(
    private matDialogRef: MatDialogRef<NewCategoryComponent>,
    private expenseService: ExpenseService
  ) { }

  onNoCreate() {
    this.matDialogRef.close()
  }
  onCreateExpense() {
    const expense = {
      amount: parseFloat(this.form.controls['expense'].value || '0'), categoryId: 1, dateTime: (new Date()).toISOString(), id: Date.now(), title: this.form.controls['name'].value
    } as ExpenseModel
    this.expenseService.addNewExpense(expense)
    console.log(this.expenseService.expenses())
    this.matDialogRef.close()
  }
}
