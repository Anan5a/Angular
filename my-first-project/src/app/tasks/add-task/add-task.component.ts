import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewTask } from '../task/task.model';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-add-task',
  // standalone: true,
  // imports: [FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {
  @Input({ required: true }) userId!: string
  @Output() close = new EventEmitter<boolean>()
  private tasksService = inject(TasksService)
  enteredTitle = '';
  enteredSummary = '';
  enteredDueDate = '';


  onCancelAddingTask() {
    this.close.emit(true)
  }
  onSubmit() {
    this.close.emit(true)

    this.tasksService.addTask({
      title: this.enteredTitle,
      summary: this.enteredSummary,
      date: this.enteredDueDate
    }, this.userId)
  }
}
