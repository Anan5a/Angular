import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
    password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)] }),
  })

  formErrorMessage = signal<string | null>(null)
  constructor(private authService: AuthService, private router: Router, private toastrService: ToastrService
  ) { }


  formOnSubmit() {
    if (!this.form.valid) {
      return
    }
    this.authService.login({ email: this.form.controls['email'].value!, password: this.form.controls['password'].value! }).subscribe({
      next: (response) => {
        //login ok
        this.toastrService.success(response.message)

        this.formErrorMessage.set(null)
        this.router.navigate(['/'])
      },
      error: (error) => {
        console.log(error);
        this.formErrorMessage.set(error)

      }
    })


  }
}
