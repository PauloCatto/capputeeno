import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.interface';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  products: Product[] = [];
  hasFewProducts: boolean = true;

  ngOnInit(): void {
    const storedProducts = localStorage.getItem('selectedProducts');
    this.products = storedProducts ? JSON.parse(storedProducts) : [];
    this.updateCartStatus();
  }

  getTotalQuantity(): number {
    return this.products.length || 0;
  }

  getTotalPrice(): number {
    return this.products.reduce((total, item) => total + (item.price_in_cents / 100), 0);
  }

  removeItem(product: Product): void {
    this.products = this.products.filter(p => p.id !== product.id);
    localStorage.setItem('selectedProducts', JSON.stringify(this.products));
  }

  updateCartStatus(): boolean {
    this.hasFewProducts = this.products.length <= 2;
    return this.hasFewProducts;
  }

}
