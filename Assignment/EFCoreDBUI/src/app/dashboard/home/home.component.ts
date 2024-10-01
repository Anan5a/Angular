import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { NgIf, NgStyle } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, RouterLink, NgIf, NgStyle],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isHandset$ = false

  subscription = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches)
  ).subscribe({
    next: value => this.isHandset$ = value
  });
  constructor(private authService: AuthService, private userService: UserService, private breakpointObserver: BreakpointObserver) { }


  dashboardData?: null

  ngOnInit(): void {
    // this.userService.dashboardData().subscribe({
    //   next: (data) => {
    //     this.dashboardData = data?.data;
    //   },
    // })

  }

}
