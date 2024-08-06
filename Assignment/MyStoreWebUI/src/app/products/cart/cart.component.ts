import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { ProductsService } from '../products.service';
import { LoadingSpinnerService } from '../../shared/loading-spinner/loading-spinner.service';
import { CartPriceModel } from './cart-price.models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  //cart from service
  private productsService = inject(ProductsService)
  private loadingSpinnerService = inject(LoadingSpinnerService)

  CART_TAX_RATE = 0.10;
  //calculate prices etc
  cartItems = this.productsService.cart
  cartPrice = computed(() => {
    const subTotal = parseFloat((this.cartItems().reduce<number>((accumulator, item) => {
      accumulator += item.product.price * item.quantity;
      return accumulator;
    }, 0)).toFixed(2))
    const tax = parseFloat((subTotal * this.CART_TAX_RATE).toFixed(2));
    return { subTotal, tax, total: parseFloat((subTotal + tax).toFixed(2)) } as CartPriceModel
  })

  ngOnInit(): void {
    this.loadingSpinnerService.setState(false)
  }

}
