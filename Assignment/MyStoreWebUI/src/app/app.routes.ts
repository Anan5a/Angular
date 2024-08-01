import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { isAdminGuard, isAuthenticatedGuard, isNotAuthenticatedGuard } from './users/auth.guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    children: [
      {
        path: '',
        loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
      },
      {
        path: 'new',
        loadComponent: () => import('./products/new-product/new-product.component').then(m => m.NewProductComponent),
        canActivate: [isAdminGuard]
      },
      {
        path: ':productId',
        loadComponent: () => import('./products/product/product.component').then(m => m.ProductComponent),

      }
    ]
  },
  {
    path: 'user',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./users/login/login.component').then(m => m.LoginComponent),
        canActivate: [isNotAuthenticatedGuard]
      },
      {
        path: 'signup',
        loadComponent: () => import('./users/signup/signup.component').then(m => m.SignupComponent),
        canActivate: [isNotAuthenticatedGuard]
      },
    ]
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];
