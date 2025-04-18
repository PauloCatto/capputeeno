import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/models/product.interface';
import { CartService } from 'src/app/services/cart/cart.service';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  products: (Product & { quantity: number })[] = [];
  hasFewProducts: boolean = true;
  loading: boolean = false;

  constructor(
    private cartService: CartService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.products = this.cartService.getProducts();
    this.updateCartStatus();
  }

  get totalQuantity(): number {
    return this.cartService.getTotalQuantity();
  }

  get totalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  increaseQuantity(item: Product & { quantity: number }): void {
    item.quantity += 1;
    this.cartService.updateCart(this.products);
    this.updateCartStatus();
  }

  decreaseQuantity(item: Product & { quantity: number }): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.removeItem(item);
      return;
    }
    this.cartService.updateCart(this.products);
    this.updateCartStatus();
  }

  removeItem(product: Product & { quantity: number }): void {
    forkJoin({
      title: this.translate.get('delete_confirmation_title'),
      message: this.translate.get('delete_confirmation_message'),
      confirmText: this.translate.get('delete_button'),
      cancelText: this.translate.get('cancel_button'),
    }).subscribe((translations) => {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: {
          ...translations,
          showCancel: true,
        },
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.products = this.products.filter((p) => p.id !== product.id);
          this.cartService.updateCart(this.products);
          this.updateCartStatus();
        }
      });
    });
  }
  updateCartStatus(): void {
    console.log(this.products.length)
    this.hasFewProducts = this.products.length <= 2;
  }

  finishPurchase(): void {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '700px',
        data: {
          title: this.translate.instant('purchase_success_title'),
          message: this.translate.instant('purchase_success_message'),
          confirmText: null,
          showCancel: false,
        },
      });

      setTimeout(() => {
        dialogRef.close();
        this.cartService.clearCart();
        this.router.navigate(['/']);
      }, 5000);
    }, 1000);
  }
}
