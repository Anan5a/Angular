import { afterNextRender, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { ProductsComponent } from "./products/products.component";
import { ProductComponent } from "./products/product/product.component";
import { SignupComponent } from "./users/signup/signup.component";
import { LoginComponent } from "./users/login/login.component";
import { LoadingSpinnerComponent } from "./shared/loading-spinner/loading-spinner.component";
import { LoadingSpinnerService } from './shared/loading-spinner/loading-spinner.service';
import { ErrorComponent } from "./shared/error/error.component";
import { ErrorService } from './shared/error/error.service';
import { Subscription } from 'rxjs';
import { CartComponent } from "./products/cart/cart.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ProductsComponent, ProductComponent, SignupComponent, LoginComponent, LoadingSpinnerComponent, ErrorComponent, CartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MyStoreWebUI';
  loadingSpinnerService = inject(LoadingSpinnerService)
  private errorService = inject(ErrorService)
  private router = inject(Router)
  private routerSubscription!: Subscription;

  error = this.errorService.error

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingSpinnerService.setState(true)
      }
    });
  }
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }


}
