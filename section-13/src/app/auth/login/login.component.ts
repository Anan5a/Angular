import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { of } from 'rxjs';

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }
  return { doesNotContainQuestionMark: true };
}

function myAsyncValidator(control: AbstractControl) {
  if (control.value !== 'test@example.com') {
    return of(null);
  }
  return of({ notUnique: true });
}


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule]
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required, myAsyncValidator],

    }),
    password: new FormControl('', [Validators.required, Validators.minLength(6), mustContainQuestionMark]),
  })

  get emailIsInvalid() {
    return this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid
  }
  get passwordIsInvalid() {
    return this.form.controls.password.touched && this.form.controls.password.dirty && this.form.controls.password.invalid
  }

  onSubmit() {
    console.log(this.form)
    const enteredEmail = this.form.value.email
    const enteredPassword = this.form.value.password
    console.log(enteredEmail, enteredPassword)
    this.form.reset();

  }
}



































// import { afterNextRender, Component, DestroyRef, inject, viewChild } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { debounceTime } from 'rxjs';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css',
//   imports: [FormsModule]
// })
// export class LoginComponent {

//   private form = viewChild<NgForm>('form')
//   private destroyRef = inject(DestroyRef)
//   constructor() {
//     afterNextRender(() => {
//       const savedFormData = window.localStorage.getItem('saved-login-form')
//       if (savedFormData) {
//         const loadedFormData = JSON.parse(savedFormData)
//         const savedEmail = loadedFormData.email
//         setTimeout(() => {
//           this.form()?.controls['email'].setValue(savedEmail);
//         }, 1)
//       }


//       const subscription = this.form()?.valueChanges?.pipe(debounceTime(300)).subscribe({
//         next: (value) => {
//           window.localStorage.setItem(
//             'saved-login-form',
//             JSON.stringify({ email: value?.email, password: value?.password })
//           )
//         }
//       });
//       this.destroyRef.onDestroy(() => subscription?.unsubscribe())
//     })
//   }
//   onFormSubmit(form: NgForm) {

//     if (form.form.invalid) {
//       return;
//     }
//     const enteredEmail = form.form.value.email
//     const enteredPassword = form.form.value.password
//     console.log(form.form)
//     console.log(form.form.valid)

//     console.log(enteredEmail, enteredPassword)
//     form.form.reset();


//   }
// }
