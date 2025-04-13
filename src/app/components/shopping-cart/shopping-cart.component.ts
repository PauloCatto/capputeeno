import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/models/product.interface';
import { CartService } from 'src/app/services/cart/cart.service';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        message: this.translate.instant('delete_confirmation_message'),
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.products = this.products.filter((p) => p.id !== product.id);
        this.cartService.updateCart(this.products);
        this.updateCartStatus();
      }
    });
  }

  updateCartStatus(): void {
    this.hasFewProducts = this.products.length <= 2;
  }

  finishPurchase(): void {
    this.loading = true;
    this.cartService.setPurchasedItems(this.products);

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
}
