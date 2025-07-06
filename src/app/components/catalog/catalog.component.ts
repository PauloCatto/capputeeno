import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Product, Tab } from 'src/app/models/product.interface';
import { CatalogService } from 'src/app/services/catalog/catalog.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit {
  @Input() filtered: Product[] = [];
  @Input() typed!: boolean;
  @Input() found!: boolean;

  products: Product[] = [];
  tabs: Tab[] = [];
  selectedTab = 0;
  loading!: boolean;
  itemsPerPage = 10;

  constructor(
    private catalogService: CatalogService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.catalogService
      .getProducts()
      .then((data: Product[]) => {
        if (data && data.length > 0) {
          this.processProducts(data);
          this.onItemsPerPageChange(this.itemsPerPage);
        } else {
          console.error(this.translate.instant('NO_PRODUCTS_FOUND'));
        }
      })
      .catch((error) => {
        console.error(this.translate.instant('ERROR_FETCHING_PRODUCTS', error));
      });
  }

  changeItemsPerPage(step: number): void {
    const newValue = this.itemsPerPage + step;
    if (newValue >= 10 && newValue <= 60) {
      this.itemsPerPage = newValue;
      this.onItemsPerPageChange(newValue);
    }
  }

  onItemsPerPageChange(value: number): void {
    this.tabs = this.tabs.map((tab) => ({
      ...tab,
      dataToShow: tab.data.slice(0, value),
    }));
  }

  selectTab(index: number): void {
    this.selectedTab = index;
  }

  processProducts(data: Product[]): void {
    this.products = data;
    const allProducts = data;

    const tshirts = data.filter((product: { name: string }) =>
      product.name.toLowerCase().includes('camiseta')
    );
    const mugs = data.filter((product: { name: string }) =>
      product.name.toLowerCase().includes('caneca')
    );

    this.tabs = [
      {
        label: 'ALL_PRODUCTS',
        data: allProducts,
        dataToShow: allProducts.slice(0, this.itemsPerPage),
      },
      {
        label: 'TSHIRTS',
        data: tshirts,
        dataToShow: tshirts.slice(0, this.itemsPerPage),
      },
      {
        label: 'MUGS',
        data: mugs,
        dataToShow: mugs.slice(0, this.itemsPerPage),
      },
    ];
  }

  onProductClick(product: Product): void {
    this.loading = true;
    localStorage.setItem('selectedProduct', JSON.stringify(product));

    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/product']);
    }, 2000);
  }
}
