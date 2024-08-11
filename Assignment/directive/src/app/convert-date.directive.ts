import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appConvertDate]',
  standalone: true
})
export class ConvertDateDirective implements OnInit {

  @Input({ required: true }) appConvertDate!: string
  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.elementRef.nativeElement.style.backgroundColor = 'blue';
    this.elementRef.nativeElement.textContent = this.convertDate();
  }

  private convertDate() {
    const parts = this.appConvertDate.split('/');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
}
