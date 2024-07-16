import { Directive, ElementRef, inject, input, Input } from "@angular/core";

@Directive({
  selector: 'a[appSafeLink]',
  standalone: true,
  host: {
    '(click)': 'onLinkClick($event)',
  }
})
export class SafeLinkDirective {
  queryparam = input('myapp', { alias: 'appSafeLink' })

  private hostElementRef = inject<ElementRef<HTMLAnchorElement>>(ElementRef)
  constructor() {
    console.log("SafeLinkDirective active!")
  }

  onLinkClick(event: MouseEvent) {
    console.log("Link clicked")
    const wantsToLeave = window.confirm("Do you want to leave the app?")
    if (wantsToLeave) {
      const address = this.hostElementRef.nativeElement.href;
      this.hostElementRef.nativeElement.href = address + "?from=" + this.queryparam()
      return;
    }
    event.preventDefault();
  }
}
