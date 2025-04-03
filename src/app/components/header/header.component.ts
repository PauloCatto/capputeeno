import { Component, EventEmitter, Output } from '@angular/core';
import { Product } from 'src/app/models/product.interface';
import { CatalogService } from 'src/app/services/catalog.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() searchResults = new EventEmitter<Product[]>();
  filteredProducts: Product[] = [];

  constructor(public catalogService: CatalogService) {}

  onSearch(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    console.log('Buscando por:', inputValue);

    if (inputValue.length < 2) {
      this.filteredProducts = [];
      return;
    }

    this.catalogService
      .getProducts()
      .then((data: Product[]) => {
        this.filteredProducts = data.filter((product) =>
          product.name.toLowerCase().includes(inputValue)
        );
        console.log('Resultados filtrados:', this.filteredProducts);
        this.searchResults.emit(this.filteredProducts);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
