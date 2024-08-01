import { NgIf } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RedirectCommand, RouterLink } from '@angular/router';
import { LoadingSpinnerService } from '../../shared/loading-spinner/loading-spinner.service';
import { UserLoginRequestModel } from '../users.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService)
  private destroyRef = inject(DestroyRef)
  private router = inject(Router)
  private loadingSpinnerService = inject(LoadingSpinnerService)
  hideForm = false

  formGroup: FormGroup = new FormGroup({
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

  onSubmitForm() {
    if (!this.formGroup.valid) {
      return;
    }
    const subscription = this.authService.login(this.formGroup.value as UserLoginRequestModel).subscribe({
      next: (response) => {
        //don't really care about the response here, already stored in the service
        this.hideForm = !this.hideForm
        setTimeout(() => {
          this.router.navigate(['/'])
        }, 1000)
      },
    })
    this.destroyRef.onDestroy(() => subscription.unsubscribe())

  }
}
