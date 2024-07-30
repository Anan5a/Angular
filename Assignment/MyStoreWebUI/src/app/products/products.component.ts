import { Component } from '@angular/core';
import { ProductCardComponent } from "./product-card/product-card.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products = [
    { image: 'pexels-alexazabache-3766111.jpg', title: 'Product 1' },
    { image: 'pexels-alexazabache-3766180.jpg', title: 'Product 2' },
    { image: 'pexels-binoid-cbd-1990665-3612193.jpg', title: 'Product 3' },
    { image: 'pexels-olenkabohovyk-3819969.jpg', title: 'Product 4' },
    { image: 'pexels-alexazabache-3766180.jpg', title: 'Product 5' },
  ];
}
