import { Component } from '@angular/core';
import { Product } from 'src/app/models/product.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  filteredProducts: Product[] = [];

  constructor(){}

  updateFilteredProducts(products: Product[]) {
    this.filteredProducts = products;
  }
}
