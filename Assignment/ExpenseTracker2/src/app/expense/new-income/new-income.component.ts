import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NewCategoryComponent } from '../category/new-category-dialog.component';
import { ExpenseModel, IncomeModel } from '../expense.models';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-new-income',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './new-income.component.html',
  styleUrl: './new-income.component.scss'
})
export class NewIncomeComponent {
  form = new FormGroup({
    name: new FormControl('', { validators: [] }),
    income: new FormControl('', { validators: [Validators.required] }),
  })

  constructor(
    private matDialogRef: MatDialogRef<NewCategoryComponent>,
    private expenseService: ExpenseService
  ) { }

  onNoCreate() {
    this.matDialogRef.close()
  }
  onCreateIncome() {
    const expense = {
      id: Date.now(),
      source: this.form.controls['name'].value,
      amount: parseFloat(this.form.controls['income'].value || '0'),
      dateTime: (new Date()).toISOString()
    } as IncomeModel
    this.expenseService.addNewIncome(expense)
    this.matDialogRef.close()
  }
}
