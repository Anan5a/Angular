import { Routes } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ViewListComponent } from './view-list/view-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './dashboard/home/home.component';
import { CreateUserComponent } from './admin/create-user/create-user.component';
import { ProfileComponent } from './dashboard/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'upload',
    component: UploadComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'view-list',
    component: ViewListComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'admin',
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
