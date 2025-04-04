import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: Product | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
      const storedProduct = localStorage.getItem('selectedProduct');
      if (storedProduct) {
        this.product = JSON.parse(storedProduct);
      } else {
        console.error('Nenhum produto encontrado no localStorage.');
      }
  }

  addToCart(product: Product): void {
    let cart: Product[] = JSON.parse(localStorage.getItem('selectedProducts') || '[]');
    cart.push(product);
    localStorage.setItem('selectedProducts', JSON.stringify(cart));
    this.router.navigate(['/shopping-cart']);
  }

}
