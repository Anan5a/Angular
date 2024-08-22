import { Routes } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ViewListComponent } from './view-list/view-list.component';

export const routes: Routes = [
  {
    path: '',
    component: UploadComponent
  },
  {
    path: 'upload',
    component: UploadComponent
  },
  {
    path: 'view-list',
    component: ViewListComponent
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];
