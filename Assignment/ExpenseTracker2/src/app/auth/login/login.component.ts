import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { validators: [Validators.required, Validators.minLength(6)] }),
  })

  formErrorMessage = signal<string | null>(null)
  constructor(private authService: AuthService, private router: Router) { }


  formOnSubmit() {
    if (!this.form.valid) {
      return
    }
    const loginState = this.authService.login(this.form.controls['email'].value!, this.form.controls['password'].value!);

    if (loginState === null) {
      this.formErrorMessage.set("No user found")
      //no user
      return
    }
    if (loginState === false) {
      //invalid cred
      this.formErrorMessage.set("Invalid credentials!")
      return
    }
    //we have user
    this.formErrorMessage.set(null)
    //redirect to profile/dashboard
    this.router.navigate(['/'])
  }
}
