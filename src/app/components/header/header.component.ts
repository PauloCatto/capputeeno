import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
  showDropdown = false;

  constructor(
    public catalogService: CatalogService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.translate.use(savedLang);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  onSearch(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

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
        this.searchResults.emit(this.filteredProducts);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
