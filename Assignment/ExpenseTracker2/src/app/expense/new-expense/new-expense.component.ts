import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NewCategoryComponent } from '../category/new-category-dialog.component';
import { CategoryModel } from '../expense.models';

@Component({
  selector: 'app-new-expense',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './new-expense.component.html',
  styleUrl: './new-expense.component.scss'
})
export class NewExpenseComponent {
  categoryData!: CategoryModel
  constructor(
    private matDialogRef: MatDialogRef<NewCategoryComponent>
  ) { }

  onNoCreate() {
    this.matDialogRef.close()
  }
  onCreateExpense() {
    this.matDialogRef.close(this.categoryData)
  }
}