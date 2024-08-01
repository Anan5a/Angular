import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingSpinnerService } from '../../shared/loading-spinner/loading-spinner.service';
import { AuthService } from '../../users/auth.service';
import { ProductModel } from '../products.models';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent implements OnInit {
  private authService = inject(AuthService)
  private productsService = inject(ProductsService)
  private destroyRef = inject(DestroyRef)
  private router = inject(Router)
  private loadingSpinnerService = inject(LoadingSpinnerService)
  product = signal<ProductModel | null>(null)

  ngOnInit(): void {
    this.loadingSpinnerService.setState(false)
  }
}
