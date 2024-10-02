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
import { LoginComponent } from "./auth/login/login.component";
import { AuthService } from './services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatChipsModule } from '@angular/material/chips';

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
    LoginComponent,
    MatChipsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'EFCoreDBUI';

  isHandset$ = false

  isAuthenticated = this.authService.isAuthenticated


  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthService,
    private toastrService: ToastrService,
  ) {
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(result => this.isHandset$ = result.matches)
    );
  }

  ngOnInit(): void {



  }

  logout() {
    this.authService.logout()
    this.router.navigate(['/'])
    window.location.reload()
  }





}
