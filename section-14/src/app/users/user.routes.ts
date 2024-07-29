import { Routes } from "@angular/router";
import { NewTaskComponent } from "../tasks/new-task/new-task.component";
import { TasksComponent } from "../tasks/tasks.component";

export const routes: Routes =
  [
    {
      path: '',
      redirectTo: 'tasks',
      pathMatch: 'full' as 'full', //yeah, f-u typescript
    },
    {
      path: 'tasks',
      component: TasksComponent,
      // loadComponent: () => import('../tasks/tasks.component').then(module => module.TasksComponent),//lazy loading!
    },
    {
      path: 'tasks/new',
      component: NewTaskComponent,
    },
  ]
