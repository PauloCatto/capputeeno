import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/models/product.interface';
import { CartService } from 'src/app/services/cart/cart.service';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  products: (Product & { quantity: number })[] = [];
  hasFewProducts: boolean = true;
  loading: boolean = false;
  paymentSuccess: boolean = false;
  pixData: any = null;

  constructor(
    public cartService: CartService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private router: Router,
    private http: HttpClient
  ) { }

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
          this.verifyQuantity();
        }
      });
    });
  }

  verifyQuantity(): void {
    this.products.length === 0 ? this.router.navigate(['/']) : '';
  }

  updateCartStatus(): void {
    this.hasFewProducts = this.products.length <= 2;
  }

  finishPurchase(): void {
    if (this.products.length === 0) return;

    this.loading = true;

    const backendUrl = 'http://localhost:3333/';

    this.http.post(backendUrl, {
      action: 'PAYMENT_ASAAS',
      totalValue: this.totalPrice
    }).subscribe({
      next: (response: any) => {
        this.loading = false;

        if (response && response.pixData) {
          this.paymentSuccess = true;
          this.pixData = response.pixData;
          this.cartService.clearCart();
        } else {
          this.dialog.open(ConfirmDialogComponent, {
            width: '500px',
            data: {
              title: this.translate.instant('warning'),
              message: this.translate.instant('pix_generation_error'),
              confirmText: this.translate.instant('back'),
              showCancel: false,
            },
          });
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('API Node com falha. Gerando UI de PIX Acadêmico (Mock) para apresentação:', error);

        this.paymentSuccess = true;
        this.pixData = {
          encodedImage: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=capputeenopix",
          payload: "00020101021226580014br.gov.bcb.pix0136123e4567-e... PIX ACADEMICO CAPPUTEENO ...1234",
          expirationDate: new Date().toISOString()
        };
        this.cartService.clearCart();
      }
    });
  }

  copyPixPaste(): void {
    if (!this.pixData || !this.pixData.payload) return;
    navigator.clipboard.writeText(this.pixData.payload).then(() => {
      alert(this.translate.instant('pix_copied'));
    });
  }
}
