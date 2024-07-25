import { afterNextRender, Component, DestroyRef, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [FormsModule]
})
export class LoginComponent {

  private form = viewChild<NgForm>('form')
  private destroyRef = inject(DestroyRef)
  constructor() {
    afterNextRender(() => {
      const savedFormData = window.localStorage.getItem('saved-login-form')
      if (savedFormData) {
        const loadedFormData = JSON.parse(savedFormData)
        const savedEmail = loadedFormData.email
        setTimeout(() => {
          this.form()?.controls['email'].setValue(savedEmail);
        }, 1)
      }


      const subscription = this.form()?.valueChanges?.pipe(debounceTime(300)).subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value?.email, password: value?.password })
          )
        }
      });
      this.destroyRef.onDestroy(() => subscription?.unsubscribe())
    })
  }
  onFormSubmit(form: NgForm) {

    if (form.form.invalid) {
      return;
    }
    const enteredEmail = form.form.value.email
    const enteredPassword = form.form.value.password
    console.log(form.form)
    console.log(form.form.valid)

    console.log(enteredEmail, enteredPassword)
    form.form.reset();


  }
}
