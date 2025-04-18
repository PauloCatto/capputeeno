import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private products: (Product & { quantity: number })[] = [];

  private totalQuantitySubject = new BehaviorSubject<number>(0);
  totalQuantity$ = this.totalQuantitySubject.asObservable();

  private purchasedItemsSubject = new BehaviorSubject<
    (Product & { quantity: number })[]
  >([]);
  public purchasedItems$ = this.purchasedItemsSubject.asObservable();

  constructor() {
    const stored = localStorage.getItem('selectedProducts');
    this.products = stored ? JSON.parse(stored) : [];
    this.updateTotalQuantity();
  }

  getProducts(): (Product & { quantity: number })[] {
    return [...this.products];
  }

  getTotalQuantity(): number {
    return this.products.reduce((sum, p) => sum + p.quantity, 0);
  }

  getTotalPrice(): number {
    return this.products.reduce(
      (total, item) =>
        total + ((item.price_in_cents ?? 0) * (item.quantity ?? 0)) / 100,
      0
    );
  }

  setPurchasedItems(items: (Product & { quantity: number })[]): void {
    this.purchasedItemsSubject.next(items);
  }

  addProduct(product: Product): void {
    const existing = this.products.find((p) => p.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.products.push({ ...product, quantity: 1 });
    }
    this.saveAndUpdate();
  }

  updateCart(products: (Product & { quantity: number })[]): void {
    this.products = products;
    this.saveAndUpdate();
  }

  private saveAndUpdate(): void {
    localStorage.setItem('selectedProducts', JSON.stringify(this.products));
    this.updateTotalQuantity();
  }

  private updateTotalQuantity(): void {
    const total = this.getTotalQuantity();
    this.totalQuantitySubject.next(total);
  }

  clearCart(): void {
    this.products = [];
    localStorage.removeItem('selectedProducts');
    this.updateTotalQuantity();
  }
}
