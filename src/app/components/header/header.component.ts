import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';
import { Product } from 'src/app/models/product.interface';
import { CartService } from 'src/app/services/cart/cart.service';
import { CatalogService } from 'src/app/services/catalog/catalog.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() searchResults = new EventEmitter<Product[]>();
  searchControl = new FormControl('');
  filteredProducts: Product[] = [];
  showDropdown = false;
  cartItemCount: number = 0;
  currentLang: string = '';

  constructor(
    public catalogService: CatalogService,
    private translate: TranslateService,
    private cartService: CartService,
    public router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.initLanguage();
    this.subscribeToCart();
    this.setupSearchListener();
  }

  private initLanguage(): void {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.translate.use(savedLang);
    this.currentLang = savedLang;
  }

  private subscribeToCart(): void {
    this.cartService.totalQuantity$.subscribe((count) => {
      this.cartItemCount = count || 0;
    });
  }

  validateCart(): void {
    if (this.cartItemCount > 0) {
      this.router.navigate(['/shopping-cart']);
    } else {
      this.toast.showError(this.translate.instant('cart_empty_message'));
    }
  }

  private setupSearchListener(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((inputValue: string | null) => {
        this.searchProducts(inputValue || '');
      });
  }

  private searchProducts(input: string): void {
    const value = input?.trim().toLowerCase();

    if (!value || value.length < 2) {
      this.filteredProducts = [];
      this.searchResults.emit(this.filteredProducts);
      return;
    }

    this.catalogService
      .getProducts()
      .then((data: Product[]) => {
        const words = value
          .split(' ')
          .map((word) => word.trim())
          .filter((word) => word.length >= 2);

        this.filteredProducts = data.filter((product) =>
          words.every((word) => product.name.toLowerCase().includes(word))
        );

        this.searchResults.emit(this.filteredProducts);
      })
      .catch((error) => console.error(error));
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    this.currentLang = lang;
  }
}
