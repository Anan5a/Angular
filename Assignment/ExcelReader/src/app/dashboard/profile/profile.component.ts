import { DatePipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileDialogComponent } from './edit-profile-dialog/edit-profile-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatIconModule, NgIf, MatButtonModule, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user = this.authService.user()!.user

  constructor(private authService: AuthService, private dialog: MatDialog, private router: Router) { }



  logout() {
    this.authService.logout()
    this.router.navigate(['/'])
  }
  openEditDialog() {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      maxWidth: '400px',
      data: { user: this.user }
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

}
