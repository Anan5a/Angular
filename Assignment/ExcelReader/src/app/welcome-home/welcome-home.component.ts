import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-welcome-home',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './welcome-home.component.html',
  styleUrl: './welcome-home.component.css',
})
export class WelcomeHomeComponent implements OnInit {
  isAuthenticated$ = this.authService.isAuthenticated;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.isAuthenticated$()) {
      //we really dont want logged in users on this page
      this.router.navigate(['/dashboard']);
    }
  }
}
