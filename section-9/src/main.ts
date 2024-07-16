import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { TasksComponent } from './app/tasks/tasks.component';

//a way to inject services
// bootstrapApplication(AppComponent, {
//   providers:[TasksComponent]
// }).catch((err) => console.error(err));

bootstrapApplication(AppComponent).catch((err) => console.error(err));
