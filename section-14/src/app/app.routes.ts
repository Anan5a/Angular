import { NotFoundComponent } from "./not-found/not-found.component";
import { NewTaskComponent } from "./tasks/new-task/new-task.component";
import { NoTaskComponent } from "./tasks/no-task/no-task.component";
import { TasksComponent } from "./tasks/tasks.component";
import { UserTasksComponent } from "./users/user-tasks/user-tasks.component";
import { routes as userRoutes } from "./users/user.routes";

export const Routes = [
  {
    path: '',
    component: NoTaskComponent,
  },
  {
    path: 'users/:userId',
    component: UserTasksComponent,
    children: userRoutes
  },
  {
    path: '**',//catch all!
    component: NotFoundComponent
  }
]
