import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { map } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import { HomeComponent } from "./dashboard/home/home.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthService } from './services/auth.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatTooltipModule,
    RouterOutlet,
    RouterLink,
    NgIf,
    HomeComponent,
    LoginComponent,
    SignupComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'FileKeeper';

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches)
  );
  isAuthenticated = this.authService.isAuthenticated
  isAdmin = this.authService.isAdmin

  constructor(private breakpointObserver: BreakpointObserver, private router: Router,
    private authService: AuthService, private socialAuthService: SocialAuthService, private toastrService: ToastrService
  ) { }
  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      //social login
      this.onSocialAuth(user.idToken)
    })
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['/'])
    window.location.reload()
  }


  onSocialAuth(idToen: string) {
    this.authService.socialAuth(idToen).subscribe({
      next: (response) => {
        //login ok
        this.toastrService.success(response.message)
        this.router.navigate(['/'])
      }
    })
  }
}