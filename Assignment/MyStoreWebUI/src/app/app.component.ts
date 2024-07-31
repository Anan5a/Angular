import { afterNextRender, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { ProductsComponent } from "./products/products.component";
import { ProductComponent } from "./products/product/product.component";
import { SignupComponent } from "./users/signup/signup.component";
import { LoginComponent } from "./users/login/login.component";
import { LoadingSpinnerComponent } from "./shared/loading-spinner/loading-spinner.component";
import { LoadingSpinnerService } from './shared/loading-spinner/loading-spinner.service';
import { ErrorComponent } from "./shared/error/error.component";
import { ErrorService } from './shared/error/error.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ProductsComponent, ProductComponent, SignupComponent, LoginComponent, LoadingSpinnerComponent, ErrorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MyStoreWebUI';
  loadingSpinnerService = inject(LoadingSpinnerService)
  private errorService = inject(ErrorService)

  error = this.errorService.error

}
