import { Component, ElementRef, inject, ViewChild, viewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../users/auth.service';
import { NgIf } from '@angular/common';
import { ProductsService } from '../../products/products.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @ViewChild('menuToggle') menuButtonElementRef!: ElementRef<HTMLButtonElement>
  @ViewChild('menuList') menuListElementRef!: ElementRef<HTMLUListElement>

  private authService = inject(AuthService)
  private productsService = inject(ProductsService)
  private router = inject(Router)

  isAdmin = this.authService.isAdmin
  isAuthenticated = this.authService.isAuthenticated
  user = this.authService.user
  // cart = this.productsService.cart
  wishList = this.productsService.wishList
  cart = this.productsService.cart
  onClickExpand() {
    this.menuListElementRef.nativeElement.classList.toggle('active')
  }
  logoutUser() {
    this.authService.logout()
    this.router.navigate(['/'])
  }

}
