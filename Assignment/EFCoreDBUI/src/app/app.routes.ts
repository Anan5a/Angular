import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from './services/auth.guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/view-monitoring-list/view-monitoring-list.component').then(m => m.ViewMonitoringListComponent),
    canActivate: [isAuthenticatedGuard]
  },

  {
    path: 'email-templates',
    loadComponent: () => import('./dashboard/email-templates/email-templates.component').then(m => m.EmailTemplatesComponent),
    canActivate: [isAuthenticatedGuard]
  },
  {
    path: 'sla',
    loadComponent: () => import('./dashboard/sla/sla.component').then(m => m.SlaComponent),
    canActivate: [isAuthenticatedGuard]
  },

  {
    path: 'nodes',
    loadComponent: () => import('./dashboard/nodes/nodes.component').then(m => m.NodesComponent),
    canActivate: [isAuthenticatedGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [isNotAuthenticatedGuard]
  },

  {
    path: '**',
    component: NotFoundComponent,
  }
];
