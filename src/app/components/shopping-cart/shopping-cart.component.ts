import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.interface';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  products: (Product & { quantity: number })[] = [];
  hasFewProducts: boolean = true;

  constructor(){}

  ngOnInit(): void {
    const storedProducts = localStorage.getItem('selectedProducts');
    const parsedProducts: (Product & { quantity?: number })[] = storedProducts
      ? JSON.parse(storedProducts)
      : [];

    this.products = parsedProducts.map((item) => ({
      ...item,
      quantity: item.quantity ?? 1,
    }));

    this.updateCartStatus();
  }

  getTotalQuantity(): number {
    return this.products.reduce(
      (total, item) => total + (item.quantity ?? 0),
      0
    );
  }

  getTotalPrice(): number {
    return this.products.reduce(
      (total, item) =>
        total +
        (((item.price_in_cents ?? 0) * (item.quantity ?? 0)) / 100),
      0
    );
  }

  increaseQuantity(item: Product & { quantity: number }): void {
    item.quantity += 1;
    this.saveToLocalStorage();
  }

  decreaseQuantity(item: Product & { quantity: number }): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.removeItem(item);
      return;
    }
    this.saveToLocalStorage();
  }

  removeItem(product: Product & { quantity: number }): void {
    this.products = this.products.filter((p) => p.id !== product.id);
    this.saveToLocalStorage();
  }

  saveToLocalStorage(): void {
    localStorage.setItem('selectedProducts', JSON.stringify(this.products));
    this.updateCartStatus();
  }

  updateCartStatus(): boolean {
    this.hasFewProducts = this.products.length <= 2;
    return this.hasFewProducts;
  }
}
