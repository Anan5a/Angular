import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryModel } from '../expense.models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../expense.service';
import { CategoryMap } from './category.component';

@Component({
  selector: 'app-new-category',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './new-category-dialog.component.html',
  styleUrl: './category.component.scss'
})
export class NewCategoryComponent implements AfterViewInit {
  form = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
    budget: new FormControl('', { validators: [Validators.required] }),
  })
  _editData?: CategoryMap = inject(MAT_DIALOG_DATA)


  constructor(
    private matDialogRef: MatDialogRef<NewCategoryComponent>,
    private expenseService: ExpenseService,
  ) { }

  ngAfterViewInit(): void {
    console.log(this._editData)
    this.form.setValue({ name: this._editData?.title || '', budget: this._editData?.budget?.maxSpend.toString() || '' })
  console.log(this.form.value)
  }


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
      id: this._editData?.id || Date.now(),
      title: this.form.controls['name'].value || ''
    }
    this.expenseService.addNewCategory(categoryData)
    this.matDialogRef.close(categoryData)
    this.form.reset();
  }

}
