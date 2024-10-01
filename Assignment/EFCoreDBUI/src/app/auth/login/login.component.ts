import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MaterialImportsModule } from '../../material-imports/material-imports.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialImportsModule, FormsModule,ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form = new FormGroup({
    userName: new FormControl('', { validators: [Validators.required] }),
    password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)] }),
  })

  formErrorMessage = signal<string | null>(null)
  constructor(private authService: AuthService, private router: Router, private toastrService: ToastrService,
  ) { }



  formOnSubmit() {
    if (!this.form.valid) {
      return
    }
    this.authService.login({ userName: this.form.controls['userName'].value!, password: this.form.controls['password'].value! }).subscribe({
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
