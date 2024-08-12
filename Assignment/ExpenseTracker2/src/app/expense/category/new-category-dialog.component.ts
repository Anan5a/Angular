import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CategoryModel } from '../expense.models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-new-category',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './new-category-dialog.component.html',
  styleUrl: './category.component.scss'
})
export class NewCategoryComponent {

  categoryData!: CategoryModel
  constructor(
    private matDialogRef: MatDialogRef<NewCategoryComponent>
  ) { }

  onNoCreate() {
    this.matDialogRef.close()
  }
  onCreateCat() {
    this.matDialogRef.close(this.categoryData)
  }

}
