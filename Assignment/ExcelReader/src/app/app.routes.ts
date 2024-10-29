
import {Routes } from '@angular/router';
import {
  isAdminGuard,
  isAuthenticatedGuard,
  isNotAuthenticatedGuard,
} from './services/auth.guards';
import { WelcomeHomeComponent } from './welcome-home/welcome-home.component';

export const routes: Routes = [
  {
    path: '',
    component: WelcomeHomeComponent,
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/home/home.component').then((c) => c.HomeComponent),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'upload',
    loadComponent: () =>
      import('./upload/upload.component').then((c) => c.UploadComponent),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./dashboard/profile/profile.component').then(
        (c) => c.ProfileComponent
      ),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'view-list',
    loadComponent: () =>
      import('./dashboard/view-file-list/view-file-list.component').then(
        (c) => c.ViewFileListComponent
      ),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./dashboard/chat/chat.component').then((c) => c.ChatComponent),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'chat/detail',
    loadComponent: () =>
      import('./dashboard/chat/chat-window/chat-window.component').then(
        (c) => c.ChatWindowComponent
      ),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((c) => c.LoginComponent),
    canActivate: [isNotAuthenticatedGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./auth/signup/signup.component').then((c) => c.SignupComponent),
    canActivate: [isNotAuthenticatedGuard],
  },
  {
    path: 'admin',
    canActivate: [isAdminGuard],
    canActivateChild: [isAdminGuard],
    children: [
      {
        path: 'add-user',
        loadComponent: () =>
          import('./admin/create-user/create-user.component').then(
            (c) => c.CreateUserComponent
          ),
      },
      {
        path: 'user-list',
        loadComponent: () =>
          import('./dashboard/user-list/user-list.component').then(
            (c) => c.UserListComponent
          ),
      },
      {
        path: 'system-files',
        loadComponent: () =>
          import('./dashboard/view-file-list/view-file-list.component').then(
            (c) => c.ViewFileListComponent
          ),
        data: { systemFiles: true },
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found/not-found.component').then(
        (c) => c.NotFoundComponent
      ),
  },
];
