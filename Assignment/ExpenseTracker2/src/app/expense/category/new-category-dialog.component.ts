import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CategoryModel } from '../expense.models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-new-category',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './new-category-dialog.component.html',
  styleUrl: './category.component.scss'
})
export class NewCategoryComponent {
  form = new FormGroup({
    name: new FormControl('', { validators: [] }),
    budget: new FormControl('', { validators: [Validators.required] }),
  })

  constructor(
    private matDialogRef: MatDialogRef<NewCategoryComponent>,
    private expenseService:ExpenseService
  ) { }

  onNoCreate() {
    this.matDialogRef.close()
  }

  onCreateCat() {
    //setup the category data
    const categoryData = {
      budget: {
        maxSpend: parseFloat(this.form.controls['budget'].value || '0')
      },
      dateTime: (new Date()).toISOString(),
      id: Date.now(),
      title: this.form.controls['name'].value || ''
    }
    this.expenseService.addNewCategory(categoryData)

    this.matDialogRef.close(categoryData)
  }

}
