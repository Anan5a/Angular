import { Component, computed, DestroyRef, inject, input, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-tasks',
  standalone: true,
  templateUrl: './user-tasks.component.html',
  styleUrl: './user-tasks.component.css',
  imports: [RouterOutlet,RouterLink],
})
export class UserTasksComponent implements OnInit {
  userId = input.required<string>();
  private usersService = inject(UsersService)
  private activatedRoute = inject(ActivatedRoute)
  private destroyRef = inject(DestroyRef)
  userName = ''

  ngOnInit(): void {
    const subscription = this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        this.userName = this.usersService.users.find(user => user.id === paramMap.get('userId'))?.name || ''

      }
    })
    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }



  // userName = computed(() => this.usersService.users.find(user => user.id === this.userId())?.name)

}
