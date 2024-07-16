import { NgModule } from "@angular/core";
import { TasksComponent } from "./tasks.component";
import { TaskComponent } from "./task/task.component";
import { AddTaskComponent } from "./add-task/add-task.component";
import { CommonModule, DatePipe } from "@angular/common";
import { CardComponent } from "../shared/card/card.component";
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [TasksComponent, TaskComponent, AddTaskComponent],
    exports: [TasksComponent],
    imports: [CommonModule, SharedModule, FormsModule]
})
export class TasksModule { }