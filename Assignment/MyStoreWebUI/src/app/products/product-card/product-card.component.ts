import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { ProductModel } from '../products.models';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../users/auth.service';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  @Input() product!: ProductModel
  private authService = inject(AuthService)
  private productsService = inject(ProductsService)
  private destroyRef = inject(DestroyRef)
  private router = inject(Router)

  isAdmin = this.authService.isAdmin

  get inWishList() {
    return this.productsService.hasInWishList(this.product)
  }
  get inCart() {
    return this.productsService.hasInCart(this.product)
  }


  addToCart() {
    this.productsService.addToCart(this.product)
  }

  addtoWishList() {
    if (this.inWishList()) {
      //remove
      this.productsService.removeFromWishList(this.product)
    } else {
      this.productsService.addToWishList(this.product)

    }
  }
  deleteProduct() {
    if (window.confirm("This product will be deleted forever. Are you sure?")) {
      const sub = this.productsService.deleteProduct(this.product).subscribe({
        next: () => {
          console.log("Product deleted: " + this.product.title)
        }
      })
      this.destroyRef.onDestroy(() => sub.unsubscribe)
    }
  }
}
