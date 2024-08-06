import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoadingSpinnerService } from '../../shared/loading-spinner/loading-spinner.service';
import { AuthService } from '../../users/auth.service';
import { ProductModel } from '../products.models';
import { ProductsService } from '../products.service';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent implements OnInit {


  private authService = inject(AuthService)
  private productsService = inject(ProductsService)
  private destroyRef = inject(DestroyRef)
  private router = inject(Router)
  private loadingSpinnerService = inject(LoadingSpinnerService)
  product = signal<ProductModel | null>(null)
  hideForm = false



  formGroup: FormGroup = new FormGroup({
    title: new FormControl('', { validators: [Validators.required, Validators.minLength(5)] }),
    description: new FormControl('', { validators: [Validators.required, Validators.minLength(20)] }),
    sku: new FormControl('', { validators: [Validators.required, Validators.maxLength(10)] }),
    price: new FormControl('', { validators: [Validators.required, Validators.min(0)] }),
    weight: new FormControl('', { validators: [Validators.required, Validators.min(1)] }),
    images: new FormArray([], { validators: [Validators.required] })
  })





  ngOnInit(): void {
    this.loadingSpinnerService.setState(false)
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      const imagesArray = this.formGroup.controls['images'] as FormArray;

      files.forEach(file => {
        imagesArray.push(new FormControl(file));
      });
    }
  }

  onSubmitForm(): void {
    if (this.formGroup.valid) {
      const formData = new FormData();
      const formValues = this.formGroup.value;

      // Append other form fields
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'images') {
          formData.append(key, formValues[key]);
        }
      }

      // Append images
      const imagesArray = this.formGroup.get('images') as FormArray;
      imagesArray.controls.forEach((control: any) => {
        formData.append('images', control.value);
      });

      const subscription = this.productsService.createProduct(formData).subscribe({
        next: (response) => {
          //don't really care about the response
        },
        complete: () => {
          //send to login route
          this.hideForm = true
        }
      })
      this.destroyRef.onDestroy(() => subscription.unsubscribe())
    }
  }

  // Getters for validation status


  get titleIsInvalid() {
    return this.formGroup.get('title')?.invalid && this.formGroup.get('title')?.touched;
  }

  get descriptionIsInvalid() {
    return this.formGroup.get('description')?.invalid && this.formGroup.get('description')?.touched;
  }

  get skuIsInvalid() {
    return this.formGroup.get('sku')?.invalid && this.formGroup.get('sku')?.touched;
  }

  get priceIsInvalid() {
    return this.formGroup.get('price')?.invalid && this.formGroup.get('price')?.touched;
  }

  get weightIsInvalid() {
    return this.formGroup.get('weight')?.invalid && this.formGroup.get('weight')?.touched;
  }

  get imagesAreInvalid() {
    return !this.formGroup.get('images')?.value || this.formGroup.get('images')?.value.length === 0;
  }
}
