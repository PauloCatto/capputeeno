import { Component } from '@angular/core';
import { Product, SearchEvent } from 'src/app/models/product.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  filteredProducts: Product[] = [];
  searchState!: SearchEvent;

  constructor(){}

  updateSearchState(event: SearchEvent): void {
    this.searchState = event;
  }
}
