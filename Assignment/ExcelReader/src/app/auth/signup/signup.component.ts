import { Component, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';




//custom validator to match passwords
export function passwordMatchValidator(p1 = 'password', p2 = 'c_password'): ValidatorFn {
  return function passwordMatchValidator(control: AbstractControl) {
    const password = control.get(p1)?.value;
    const confirmPassword = control.get(p2)?.value;

    if (password && confirmPassword && password === confirmPassword) {
      return null;
    }
    control.get(p2)?.setErrors({ passwordsDoNotMatch: true })
    return { passwordsDoNotMatch: true };
  };
}


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  form = new FormGroup({
    name: new FormControl('', { validators: [Validators.required, Validators.minLength(2)] }),
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)] }),
    c_password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)] }),
  },
    {
      validators: passwordMatchValidator()
    })

  errorMessage = signal('')

  constructor(private authService: AuthService, private router: Router) { }

  formOnSubmit() {
    this.errorMessage.set("");

    if (!this.form.valid) {
      return
    }
    //create user
    this.authService.signup(
      {
        name: this.form.controls['name'].value!,
        email: this.form.controls['email'].value!,
        password: this.form.controls['password'].value!
      }
    ).subscribe({
      next: (response) => {
        if (response.status === 'ok') {
          this.router.navigate(['/'])
        } else {
          this.errorMessage.set(response.message)
        }
      },
      error: (error) => {
        this.errorMessage.set(error)
      }
    })


    //auto login
    // this.authService.login(this.form.controls['email'].value!,
    //   this.form.controls['password'].value!)
  }
}
