import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProductCardComponent } from "./product-card/product-card.component";
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { LoadingSpinnerService } from '../shared/loading-spinner/loading-spinner.service';
import { ProductsService } from './products.service';
import { RedirectCommand, UrlTree } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  loadingSpinnerService = inject(LoadingSpinnerService)
  private productsService = inject(ProductsService)
  private destroyRef = inject(DestroyRef)
  errorMessage = signal('')

  ngOnInit(): void {
    const subscription = this.productsService.loadAllProducts().subscribe({
      next: (products) => {
      },
      error: (error) => {
        this.errorMessage.set(error.message)
      },
      complete: () => {
        this.loadingSpinnerService.setState(false)
      }
    })
    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }
  products = this.productsService.products
}
