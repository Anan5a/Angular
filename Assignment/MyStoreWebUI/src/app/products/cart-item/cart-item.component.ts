import { Component, Input } from '@angular/core';
import { CartModel } from '../products.models';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent {
  @Input({ required: true }) cartItem!: CartModel;
}
