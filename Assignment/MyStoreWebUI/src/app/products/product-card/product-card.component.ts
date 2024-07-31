import { Component, Input } from '@angular/core';
import { ProductModel } from '../products.models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: ProductModel

  addToCart() {
    console.log('Added to cart:', this.product.title);
    // Add to cart logic
  }

  viewDetails() {
    console.log('Viewing details for:', this.product.title);
    // View details logic
  }
}
