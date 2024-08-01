import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateUserRequestModel } from '../users.models';
import { NgIf } from '@angular/common';
import { AuthService } from '../auth.service';
import { RedirectCommand, Router, RouterLink } from '@angular/router';
import { LoadingSpinnerService } from '../../shared/loading-spinner/loading-spinner.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  private authService = inject(AuthService)
  private destroyRef = inject(DestroyRef)
  private router = inject(Router)
  private loadingSpinnerService = inject(LoadingSpinnerService)
  hideForm = false

  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', { validators: [Validators.required, Validators.minLength(5)] }),
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { validators: [Validators.required, Validators.minLength(6)] }),
  })

  ngOnInit(): void {
    this.loadingSpinnerService.setState(false)
  }
  get emailIsInvalid() {
    return (
      this.formGroup.controls['email'].touched &&
      this.formGroup.controls['email'].dirty &&
      this.formGroup.controls['email'].invalid
    );
  }
  get passwordIsInvalid() {
    return (
      this.formGroup.controls['password'].touched &&
      this.formGroup.controls['password'].dirty &&
      this.formGroup.controls['password'].invalid
    );
  }
  get nameIsInvalid() {
    return (
      this.formGroup.controls['name'].touched &&
      this.formGroup.controls['name'].dirty &&
      this.formGroup.controls['name'].invalid
    );
  }
  onSubmitForm() {
    if (!this.formGroup.valid) {
      return;
    }
    const subscription = this.authService.signup(this.formGroup.value as CreateUserRequestModel).subscribe({
      next: (response) => {
        //don't really care about the response
      },
      complete: () => {
        //send to login route
        this.hideForm = true
        // return new RedirectCommand(this.router.parseUrl('/login'))
      }
    })
    this.destroyRef.onDestroy(() => subscription.unsubscribe())

  }
}
