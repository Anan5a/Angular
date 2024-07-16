import { Component, effect, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-server-status',
  standalone: true,
  imports: [],
  templateUrl: './server-status.component.html',
  styleUrl: './server-status.component.css'
})
export class ServerStatusComponent implements OnInit, OnDestroy {
  currentStatus = 'online';
  private interval?: ReturnType<typeof setInterval>

  constructor() {
    //ONLY WITH SIGNLAS
    effect(() => {
      console.log(this.currentStatus)
    })
  }


  ngOnDestroy(): void {
    clearTimeout(this.interval)
  }

  ngOnInit() {
    this.interval = setInterval(() => {
      const rnd = Math.random()
      if (rnd < 0.5) {
        this.currentStatus = 'online'
      } else if (rnd < 0.9) {
        this.currentStatus = 'offline'
      } else {
        this.currentStatus = 'unknown'
      }
    }, 2000)
  }
}
