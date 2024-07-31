import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ProductModel } from './products.models';
import { catchError, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error/error.service';
import { ApiBaseImageUrl, ApiBaseUrl } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private _products = signal<ProductModel[]>([])



  get products() {
    return this._products.asReadonly()
  }

  constructor(private httpClient: HttpClient, private errorService: ErrorService) { }

  loadAllProducts() {
    const url = ApiBaseUrl + '/Product';
    const errorMessage = 'Failed to fetch products!';

    return this.fetchProducts(url, errorMessage).pipe(
      tap({
        next: (products) => {
          const tmpProducts = [...products]
          tmpProducts.forEach(product => {
            product.imageUrls = product.imageUrls.map(x => ApiBaseImageUrl + x);
          });

          this._products.set(tmpProducts)
        }
      })
    )
  }

  private fetchProducts(url: string, errorMessage: string) {
    return this.httpClient.get<ProductModel[]>(url).pipe(
      catchError((error) => {
        this.errorService.showError(errorMessage);
        return throwError(() => new Error(errorMessage))
      })
    )
  }


}
