import { Routes } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ViewListComponent } from './view-list/view-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './dashboard/home/home.component';
import { CreateUserComponent } from './admin/create-user/create-user.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { isAdminGuard, isAuthenticatedGuard, isNotAuthenticatedGuard } from './services/auth.guards';
import { ChatComponent } from './dashboard/chat/chat.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: HomeComponent,
    canActivate: [isAuthenticatedGuard]
  },
  {
    path: 'upload',
    component: UploadComponent,
    canActivate: [isAuthenticatedGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [isAuthenticatedGuard]
  },
  {
    path: 'view-list',
    component: ViewListComponent,
    canActivate: [isAuthenticatedGuard]
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [isAuthenticatedGuard]
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
    path: 'admin',
    canActivate: [isAdminGuard],
    canActivateChild: [isAdminGuard],
    children: [
      {
        path: 'add-user',
        component: CreateUserComponent
      }
    ]
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];
