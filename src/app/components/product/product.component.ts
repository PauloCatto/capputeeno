import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Product } from 'src/app/models/product.interface';
import { CartService } from 'src/app/services/cart/cart.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  product: Product | null = null;
  loading!: boolean;

  constructor(
    private router: Router,
    @Inject(ToastService) public toast: ToastService,
    private translate: TranslateService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const storedProduct = localStorage.getItem('selectedProduct');
    if (storedProduct) {
      this.product = JSON.parse(storedProduct);
    } else {
      console.error(this.translate.instant('NO_PRODUCT_IN_STORAGE'));
    }
  }

  addToCart(product: Product): void {
    this.loading = true;

    let cart: (Product & { quantity: number })[] = JSON.parse(
      localStorage.getItem('selectedProducts') || '[]'
    );

    const existingProduct = cart.find((p) => p.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('selectedProducts', JSON.stringify(cart));
    this.cartService.updateCart(cart);

    setTimeout(() => {
      this.loading = false;
      this.toast.showSuccess(this.translate.instant('PRODUCT_ADDED_SUCCESS'));

      setTimeout(() => {
        this.router.navigate(['/shopping-cart']);
      }, 2100);
    }, 3000);
  }
}
