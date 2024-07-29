import { NotFoundComponent } from "./not-found/not-found.component";
import { NoTaskComponent } from "./tasks/no-task/no-task.component";
import { UserTasksComponent } from "./users/user-tasks/user-tasks.component";

export const Routes = [
  {
    path: '',
    component: NoTaskComponent,
  },
  {
    path: 'users/:userId',
    component: UserTasksComponent,
    // children: userRoutes,
    loadChildren: () => import('./users/user.routes').then((module) => module.routes),//lazy loading whole child group
  },
  {
    path: '**',//catch all!
    component: NotFoundComponent
  }
]
