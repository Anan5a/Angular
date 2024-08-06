import { Component, ElementRef, inject, input, Input, ViewChild } from '@angular/core';
import { CartModel } from '../products.models';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent {
  @ViewChild('numberOfItem') numberOfItem !: ElementRef<HTMLInputElement>
  cartItem = input.required<CartModel>()
  private productsService = inject(ProductsService)



  removeFromCart() {
    this.productsService.removeFromCart(this.cartItem().product, true)
  }
  updateQty() {
    const currentQty = parseInt(this.numberOfItem.nativeElement.value);
    if (currentQty > 0) {
      currentQty > this.cartItem().quantity
        ? this.productsService.addToCart(this.cartItem().product)
        : this.productsService.removeFromCart(this.cartItem().product);

    }
  }
}
