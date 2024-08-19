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
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { CategoryComponent } from "./expense/category/category.component";
import { ExpenseComponent } from "./expense/expense.component";
import { FabService } from './fab.service';
import { NgIf } from '@angular/common';
import { NewExpenseComponent } from './expense/new-expense/new-expense.component';
import { MatDialog } from '@angular/material/dialog';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatTooltipModule,
    RouterOutlet, LoginComponent, SignupComponent, CategoryComponent, ExpenseComponent, NgIf, DashboardComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ExpenseTracker2';

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches)
  );

  isFabVisible = this.fabService.isVisible
  icon = this.fabService.icon
  action = this.fabService.action

  constructor(private breakpointObserver: BreakpointObserver, private fabService: FabService, private readonly dialog: MatDialog, private authService: AuthService, private router: Router
  ) { }

  get isAuthenticated() {
    return this.authService.isAuthenticated
  }


  openNewExpenseDialog() {
    const dialogRef = this.dialog.open(NewExpenseComponent, {});

    dialogRef.afterClosed().subscribe(result => { });
  }



  logout() {
    this.authService.logout()
    this.router.navigate(['/login'])
  }
}
