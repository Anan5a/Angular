import { AfterViewChecked, AfterViewInit, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NewCategoryComponent } from '../category/new-category-dialog.component';
import { CategoryModel, ExpenseModel } from '../expense.models';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../expense.service';
import { MatSelectModule } from '@angular/material/select';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-new-expense',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, ReactiveFormsModule, MatSelectModule, NgIf],
  templateUrl: './new-expense.component.html',
  styleUrl: './new-expense.component.scss'
})
export class NewExpenseComponent implements AfterViewInit {
  form = new FormGroup({
    name: new FormControl('', { validators: [], },),
    category: new FormControl('', { validators: [Validators.required] }),
    expense: new FormControl('', { validators: [Validators.required] }),
  })
  categories = this.expenseService.categories
  _editData?: ExpenseModel = inject(MAT_DIALOG_DATA)

  get emptyIncome() {
    return this.expenseService.incomes().length < 1
  }

  constructor(
    private matDialogRef: MatDialogRef<NewCategoryComponent>,
    private expenseService: ExpenseService
  ) { }

  ngAfterViewInit(): void {
    this.form.setValue({ name: this._editData?.title || '', expense: this._editData?.amount.toString() || '', category: this._editData?.categoryId.toString() || '' })
  }

  onNoCreate() {
    this.matDialogRef.close()
  }
  onCreateExpense() {
    const expense = {
      amount: parseFloat(this.form.controls['expense'].value || '0'),
      categoryId: parseFloat(this.form.controls['category'].value || '0'),
      dateTime: (new Date()).toISOString(),
      id: this._editData?.id || Date.now(),
      title: this.form.controls['name'].value
    } as ExpenseModel
    this.expenseService.addNewExpense(expense)
    this.matDialogRef.close()
  }
}
