import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingSpinnerService } from '../../shared/loading-spinner/loading-spinner.service';
import { AuthService } from '../../users/auth.service';
import { ProductModel } from '../products.models';
import { ProductsService } from '../products.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgIf],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  @Input({ required: true }) productId!: string
  private productsService = inject(ProductsService)
  private destroyRef = inject(DestroyRef)
  private router = inject(Router)
  private loadingSpinnerService = inject(LoadingSpinnerService)

  product!: ProductModel




  get inWishList() {
    return this.productsService.hasInWishList(this.product)
  }
  get inCart() {
    return this.productsService.hasInCart(this.product)
  }

  ngOnInit(): void {
    const subscription = this.productsService.loadProduct(this.productId).subscribe({
      next: (product) => {
        this.product = product
        this.loadingSpinnerService.setState(false)
      },
      error: (error) => {
        this.loadingSpinnerService.setState(true)
        this.router.navigate(['/not-found'])
      },
      complete: () => {
        this.loadingSpinnerService.setState(false)
      }
    })
    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }






  addToCart() {
    this.productsService.addToCart(this.product)
  }

  addtoWishList() {
    if (this.inWishList()) {
      this.productsService.removeFromWishList(this.product)
    } else {
      this.productsService.addToWishList(this.product)

    }
  }
}
