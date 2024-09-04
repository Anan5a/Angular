import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { NgIf, NgStyle } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, RouterLink, NgIf, NgStyle],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isHandset$ = false

  subscription = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches)
  ).subscribe({
    next: value => this.isHandset$ = value
  });
  canAddUser = this.authService.isAdmin() || this.authService.isSuperAdmin()
  constructor(private authService: AuthService, private breakpointObserver: BreakpointObserver) { }
}
