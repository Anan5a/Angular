import { Component, Input } from '@angular/core';
import { TaskComponent } from './task/task.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { NewTask } from './task/task.model';
import { TasksService } from './tasks.service';
@Component({
  selector: 'app-tasks',
  // standalone: true,
  // imports: [TaskComponent, AddTaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {

  @Input() name?: string;
  @Input({ required: true }) userId!: string
  isAddingTask: boolean = false

  constructor(private tasksService: TasksService) { }


  get selectedUserTasks() {
    return this.tasksService.getUserTask(this.userId)
  }



  onStartAddingTask() {
    this.isAddingTask = true
  }
  onCloseAddTask(ev: boolean) {
    this.isAddingTask = false
  }
  


}
