import { Component, ElementRef, inject, ViewChild, viewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @ViewChild('menuToggle') menuButtonElementRef!: ElementRef<HTMLButtonElement>
  @ViewChild('menuList') menuListElementRef!: ElementRef<HTMLUListElement>

  onClickExpand() {
    this.menuListElementRef.nativeElement.classList.toggle('active')
  }


}
