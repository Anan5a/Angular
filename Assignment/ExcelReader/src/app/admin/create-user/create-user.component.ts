import { NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { passwordMatchValidator } from '../../auth/signup/signup.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Role } from '../../app.models';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule, NgIf, RouterLink, MatSelectModule, MatInputModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements AfterViewInit {
  form = new FormGroup({
    name: new FormControl('', { validators: [Validators.required, Validators.minLength(2)] }),
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)] }),
    c_password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)] }),
    roleId: new FormControl('', { validators: [Validators.required,] }),
  },
    {
      validators: passwordMatchValidator()
    })

  errorMessage = signal('')

  assignableRoles = signal<Role[]>([])

  constructor(private authService: AuthService, private router: Router, private toastrService: ToastrService, private userService: UserService
  ) { }


  ngAfterViewInit(): void {
    //get roles
    this.userService.getNewUserConfig().subscribe({
      next: (response) => {
        this.assignableRoles.set(response.data?.roles!)
      }
    })
  }
  formOnSubmit() {
    this.errorMessage.set("");

    if (!this.form.valid) {
      this.errorMessage.set("Invalid data in the form");
      return
    }
    //create user
    this.userService.createNewUser(
      {
        name: this.form.controls['name'].value!,
        email: this.form.controls['email'].value!,
        password: this.form.controls['password'].value!,
        roleId: this.form.controls['roleId'].value!,
      }
    ).subscribe({
      next: (response) => {
        if (response.status === 'ok') {
          this.router.navigate(['/'])
          this.toastrService.success(response.message)
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
