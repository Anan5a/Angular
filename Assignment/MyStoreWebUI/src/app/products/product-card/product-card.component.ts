import { Component, inject, Input, OnInit } from '@angular/core';
import { ProductModel } from '../products.models';
import { RouterLink } from '@angular/router';
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
export class ProductCardComponent  {
  @Input() product!: ProductModel
  private authService = inject(AuthService)
  private productsService = inject(ProductsService)

  isAdmin = this.authService.isAdmin

  get inWishList() {
    return this.productsService.hasInWishList(this.product)
  }
  get inCart() {
    return this.productsService.hasInCart(this.product)
  }


  addToCart() {
    this.productsService.addToCart(this.product)
    console.log('Added to cart:', this.product.title);
  }

  addtoWishList() {
    if (this.inWishList()) {
      //remove
      this.productsService.removeFromWishList(this.product)
    } else {
      this.productsService.addToWishList(this.product)

    }


    console.log('Added to wishlist:', this.product.title);
  }

}
