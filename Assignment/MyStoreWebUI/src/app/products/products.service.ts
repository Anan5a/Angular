import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { CartModel, ProductModel } from './products.models';
import { catchError, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error/error.service';
import { ApiBaseImageUrl, ApiBaseUrl } from '../../constants';
import { AuthService } from '../users/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private _products = signal<ProductModel[]>([])
  private _productsCart = signal<CartModel[]>([])
  private _productsWishlist = signal<ProductModel[]>([])

  private keyWishList = 'wishlist'
  private keyCart = 'cart'


  constructor(private httpClient: HttpClient, private errorService: ErrorService, authService: AuthService) {
    this.keyWishList = `${this.keyWishList}-${authService.user()?.user.id}`
    this.keyCart = `${this.keyCart}-${authService.user()?.user.id}`
  }

  get products() {
    return this._products.asReadonly()
  }

  get wishList() {
    const localData = this.getLocalData(this.keyWishList)
    if (localData !== null) {
      this._productsWishlist.set(localData)
    }
    return this._productsWishlist.asReadonly()
  }
  get cart() {
    const localData = this.getLocalData(this.keyCart)
    if (localData !== null) {
      this._productsCart.set(localData)
    }
    return this._productsCart.asReadonly()
  }


  loadAllProducts() {
    const url = ApiBaseUrl + '/Product';
    const errorMessage = 'Failed to fetch products!';

    return this.fetchData<ProductModel[]>(url, errorMessage).pipe(
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
  loadProduct(productId: string) {
    const url = ApiBaseUrl + '/Product/' + productId;
    const errorMessage = 'Failed to fetch product!';

    return this.fetchData<ProductModel>(url, errorMessage).pipe(
      tap({
        next: (product) => {
          product.imageUrls = product.imageUrls.map(x => ApiBaseImageUrl + x);
        }
      })
    )
  }

  addToCart(product: ProductModel) {
    const currentItems = [...this._productsCart()]

    //check if already in list
    if (currentItems.find((item) => item.product.id === product.id)) {
      //already in cart, increase qty
      currentItems.map((item) => {
        item.quantity++
      })
    } else {
      currentItems.push({ product: product, quantity: 1 } as CartModel)
    }
    this._productsCart.set(currentItems)
    this.store(this.keyCart, this._productsCart())
    return this._productsCart().length;
  }

  removeFromCart(product: ProductModel) {
    const currentItems = [...this._productsCart()]

    const updatedItems = currentItems.reduce<CartModel[]>((accumulator, item) => {
      if (item.product.id === product.id) {
        item.quantity--;
        if (item.quantity > 0) {
          accumulator.push(item);
        }
      } else {
        accumulator.push(item);
      }
      return accumulator;
    }, []);

    this._productsCart.set(updatedItems)
    this.store(this.keyCart, this._productsCart())
    return this._productsCart().length;
  }

  hasInCart(product: ProductModel) {
    return computed(() =>  this._productsCart().find((item) => item.product.id === product.id) )
  }






  addToWishList(product: ProductModel) {
    const currentItems = [...this._productsWishlist()]

    //check if already in list
    if (currentItems.find((item) => item.id === product.id)) {
      //nothing to do
      return true;
    }
    currentItems.push(product)
    this._productsWishlist.set(currentItems)
    this.store(this.keyWishList, this._productsWishlist())
    return this._productsWishlist().length;
  }

  removeFromWishList(product: ProductModel) {
    const currentItems = [...this._productsWishlist()]
    const updatedItems = currentItems.filter((item) => item.id !== product.id)
    //check if already in list
    this._productsWishlist.set(updatedItems)
    this.store(this.keyWishList, this._productsWishlist())
    return this._productsWishlist().length;
  }

  hasInWishList(product: ProductModel) {
    return computed(() => this._productsWishlist().find((item) => item.id === product.id) ? true : false)

  }



  private fetchData<T1>(url: string, errorMessage: string) {
    return this.httpClient.get<T1>(url).pipe(
      catchError((error) => {
        this.errorService.serverError.set(error.error)
        this.errorService.showError(errorMessage);
        return throwError(() => new Error(errorMessage))
      })
    )
  }
  private store(key: string, data: any) {
    //stores the user in the localstorage
    window.localStorage.setItem(key, JSON.stringify(data))
  }
  private erase(key: string) {
    //removes the user in the localstorage
    window.localStorage.removeItem(key)
  }
  private getLocalData(key: string) {
    const storedJson = window.localStorage.getItem(key)
    if (storedJson !== null) {
      //try decoding json
      const decodedJson = JSON.parse(storedJson);
      if (decodedJson) {
        //set _user

        return decodedJson;
      }
    }
    return null;
  }


}
