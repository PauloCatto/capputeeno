import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: Product | null = null;

  constructor() {}

  ngOnInit(): void {
      const storedProduct = localStorage.getItem('selectedProduct');
      if (storedProduct) {
        this.product = JSON.parse(storedProduct);
      } else {
        console.error('Nenhum produto encontrado no localStorage.');
      }
  }
}
