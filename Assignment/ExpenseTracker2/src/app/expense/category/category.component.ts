import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CategoryModel } from '../expense.models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { NewCategoryComponent } from './new-category-dialog.component';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {

  readonly dialog = inject(MatDialog);

  constructor(
    
  ) { }


  openDialog() {
    const dialogRef = this.dialog.open(NewCategoryComponent, {});

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
