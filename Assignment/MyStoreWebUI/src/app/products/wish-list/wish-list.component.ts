import { Component, inject, OnInit } from '@angular/core';
import { LoadingSpinnerService } from '../../shared/loading-spinner/loading-spinner.service';
import { ProductsService } from '../products.service';
import { ProductCardComponent } from "../product-card/product-card.component";

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent implements OnInit {
  loadingSpinnerService = inject(LoadingSpinnerService)
  private productsService = inject(ProductsService)
  products = this.productsService.wishList

  ngOnInit(): void {
    this.loadingSpinnerService.setState(false)
  }
}
