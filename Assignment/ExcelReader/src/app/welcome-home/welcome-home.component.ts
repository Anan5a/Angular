import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-welcome-home',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './welcome-home.component.html',
  styleUrl: './welcome-home.component.css',
})
export class WelcomeHomeComponent {
  isAuthenticated$ = this.authService.isAuthenticated;

  constructor(private authService: AuthService) {}
}
