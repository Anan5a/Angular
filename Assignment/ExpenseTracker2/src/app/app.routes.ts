import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryComponent } from './expense/category/category.component';
import { ExpenseComponent } from './expense/expense.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from './auth/auth.guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    canActivateChild: [isAuthenticatedGuard],
    canActivate: [isAuthenticatedGuard],
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'category',
        component: CategoryComponent,
        canActivate: []
      },
      {
        path: 'expense',
        component: ExpenseComponent
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [isNotAuthenticatedGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [isNotAuthenticatedGuard]

  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];
