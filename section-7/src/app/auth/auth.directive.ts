import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Permission } from './auth.model';
import { AuthService } from './auth.service';

@Directive({
  selector: '[appAuth]',
  standalone: true
})
export class AuthDirective {
  userType = input.required<Permission>({ alias: 'appAuth' })

  private authService = inject(AuthService)
  private templateRef = inject(TemplateRef)//content of the template
  private viewContainerRef = inject(ViewContainerRef)

  constructor() {
    effect((onCleanup) => {
      if (this.authService.activePermission() === this.userType()) {
        this.viewContainerRef.createEmbeddedView(this.templateRef)
        console.log("show element")
      } else {
        console.log("do not show element")
        this.viewContainerRef.clear()
      }
    })
  }

}
